import { getAuth, onAuthStateChanged } from "firebase/auth";
import { hideLoading, showAlert, showLoading, showModal } from "./general";
import $ from "jquery";
import { auth, db } from "./firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  addDoc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { shareListWithUser } from "./share";

export function formatPrice(number) {
  return parseFloat(number.toFixed(2));
}

function isNumericString(str) {
  return typeof str === "string" && !Number.isNaN(Number(str));
}

// TODO: tax info in category?

async function getShoppingList(userID) {
  showLoading();

  try {
    const currentListRef = collection(db, "users", userID, "currentList");
    const currentListSnapshot = await getDocs(currentListRef);
    const productsSnapshot = currentListSnapshot.docs;

    // checkout btn
    productsSnapshot.length && $("#checkout-btn").removeClass("hidden");

    const cartContainer = $("#cart-container");
    const cartItems = [];

    // loop list items to create DOM nodes
    productsSnapshot.forEach((productSnapshot) => {
      const productID = productSnapshot.id;
      const product = productSnapshot.data();

      const $product = $(`
        <div
            id="cart-item-${productID}"
            class="rounded-lg bg-gray-200 p-4 flex justify-between gap-2 min-w-fit"
            data-price=${product.price}
          >
          <div class="min-w-[80px] max-w-[150px]">
            <a href="/product?id=${productID}">
              <img src="${product.imageUrl}" alt="${product.name}" />
            </a>
          </div>

          <div class="basis-2/3 flex justify-between gap-2 max-h-30">
            <div class="flex flex-col items-start justify-between">
              <a href="/product?id=${productID}" class="font-semibold">
                ${product.name}
              </a>
              <button id="${productID}-remove" class="text-red-500 hover:cursor-pointer">Remove</button>
            </div>

            <div class="flex flex-col justify-between items-end">
              <div class="flex items-center gap-2">
                <button id="${productID}-reduce" class="hover:cursor-pointer px-2 rounded bg-blue-200">
                  -
                </button>
                <input
                  id="${productID}-count"
                  class="bg-white w-[30px] text-center"
                  name="quantity"
                  value="${product.count}"
                  data-count
                />
                <button id="${productID}-add" class="hover:cursor-pointer px-2 rounded bg-blue-200">
                  +
                </button>
              </div>
              <p class="text-right font-semibold">
                $<span id="${productID}-sum">
                  ${formatPrice(product.price * product.count)}
                </span>
              </p>
            </div>
          </div>
        </div>
      `);

      // add
      $product.on("click", `#${productID}-add`, () =>
        addProductCount(productID, product)
      );

      // reduce
      $product.on("click", `#${productID}-reduce`, () =>
        reduceProductCount(productID, product)
      );

      // input
      $product.on("change", `#${productID}-count`, () =>
        editProductCount(productID, product)
      );

      // remove
      $product.on("click", `#${productID}-remove`, () => {
        showModal("Remove product from list?", () => removeProduct(productID));
      });

      cartItems.push($product);
    });

    // append to DOM
    cartContainer.append(cartItems);

    updateCartItemCount();
    updateTotalPrice();
  } catch (error) {
    console.error(error);
  }
  hideLoading();
}

function updateTotalPrice() {
  const productsInList = $('[id^="cart-item-"]');
  let total = 0;
  productsInList.each(function (index, element) {
    const count = $(element).find("[data-count]").val();
    const price = $(element).attr("data-price");
    total += count * price;
  });

  $("#total").text(formatPrice(total));
}

function updateCartItemCount() {
  const productsInList = $('[id^="cart-item-"]');
  $("#cart-items-count").text(productsInList.length);
}

async function addProductCount(productID, product) {
  const currentCount = $(`#${productID}-count`).val();
  const newCount = Number(currentCount) + 1;
  const newSum = formatPrice(newCount * product.price);

  // update in DB
  updateProductInDB(productID, newCount);
  // update count
  $(`#${productID}-count`).val(newCount);
  // update sum
  $(`#${productID}-sum`).text(newSum);
  // update total
  updateTotalPrice();
}

function reduceProductCount(productID, product) {
  const productElement = $(`#cart-item-${productID}`);
  const currentCount = $(`#${productID}-count`).val();
  const newCount = Number(currentCount) - 1;
  if (newCount === 0) {
    showModal("Remove product from list?", () => removeProduct(productID));
    return;
  }
  const newSum = formatPrice(newCount * product.price);

  // update in DB
  updateProductInDB(productID, newCount);
  // update count
  $(`#${productID}-count`).val(newCount);
  // update sum
  $(`#${productID}-sum`).text(newSum);
  // update total
  updateTotalPrice();
  // update cart item count
  updateCartItemCount();
}

function editProductCount(productID, product) {
  let productInputElement = $(`#${productID}-count`);
  let newCount = productInputElement.val();
  if (newCount < 1 || !isNumericString(newCount)) {
    showAlert("Not a valid number...", "warning");
    newCount = 1;
    // fixed to 1 as minimum & error default
    productInputElement.val(1);
  }
  const newSum = formatPrice(newCount * product.price);

  // update in DB
  updateProductInDB(productID, newCount);
  // update sum
  $(`#${productID}-sum`).text(newSum);
  // update total
  updateTotalPrice();
}

function removeProduct(productID) {
  $(`#cart-item-${productID}`).remove();

  // update in DB
  removeProductInDB(productID);
  // update total
  updateTotalPrice();
  // update cart item count
  updateCartItemCount();
}

async function updateProductInDB(productID, newCount) {
  try {
    const userID = getAuth().currentUser.uid;
    const productRef = doc(db, "users", userID, "currentList", productID);
    await updateDoc(productRef, {
      count: newCount,
    });
  } catch (error) {
    showAlert("Something went wrong :(", "warning");
    console.log(error);
  }
}

async function removeProductInDB(productID) {
  try {
    const userID = getAuth().currentUser.uid;
    const productRef = doc(db, "users", userID, "currentList", productID);
    await deleteDoc(productRef);
  } catch (error) {
    showAlert("Something went wrong :(", "warning");
    console.log(error);
  }
}

const openShareModalBtn = document.getElementById("open-share-modal-btn");
const shareModal = document.getElementById("share-modal");
const cancelShare = document.getElementById("cancel-share");
const submitShare = document.getElementById("submit-share");
document.addEventListener("DOMContentLoaded", () => {
  targetUserIDInput = document.getElementById("target-user-id");
  if (openShareModalBtn) {
    openShareModalBtn.addEventListener("click", () => {
      shareModal.showModal();
    });
  }
  if (cancelShare) {
    cancelShare.addEventListener("click", () => {
      shareModal.close();
    });
  }
  if (submitShare) {
    submitShare.addEventListener("click", shareConfirm);
    console.log(122);
  }
});

let targetUserIDInput;

async function shareConfirm() {
  const userID = auth.currentUser.uid;
  const sharedUserID = targetUserIDInput.value.trim();
  try {
    await shareListWithUser(userID, sharedUserID);
    shareModal.close();
    targetUserIDInput.value = "";
  } catch (error) {
    console.error("Sharing failed", error);
    showAlert("Error occurred while sharing.");
  }
}

async function markAsComplete() {
  const userID = auth.currentUser.uid;
  try {
    const currentListRef = collection(db, "users", userID, "currentList");
    const currentListSnapshot = await getDocs(currentListRef);
    const productsSnapshot = currentListSnapshot.docs;

    const historyListRef = collection(db, "users", userID, "historyList");

    // add to history list
    await addDoc(historyListRef, {
      date: Timestamp.now(),
      name: "",
      content: productsSnapshot.map((product) => product.data()),
    });

    // remove data in current list
    const batch = writeBatch(db);
    productsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    showAlert("Successfully added to list history", "success");
  } catch (error) {
    console.log(error);
    showAlert("something went wrong...", "warning");
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userID = user.uid;
    getShoppingList(userID);
    $("#checkout-btn").on("click", () =>
      showModal("Mark as complete?", markAsComplete)
    );
  } else {
    // TODO: not login error
  }
});
