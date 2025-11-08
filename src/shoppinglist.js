import { onAuthStateChanged } from "firebase/auth";
import { hideLoading, showLoading } from "./general";
import $ from "jquery";
import { auth, db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

function formatPrice(number) {
  return parseFloat(number.toFixed(2));
}

// TODO: tax info in category?

async function getShoppingList(userID) {
  showLoading();

  try {
    const currentListRef = collection(db, "users", userID, "currentList");
    const currentListSnapshot = await getDocs(currentListRef);
    const productsSnapshot = currentListSnapshot.docs;

    // TODO: empty cart
    if (!productsSnapshot) return;

    $("#cart-items-count").text(
      productsSnapshot.reduce((acc, cur) => acc + cur.data().count, 0)
    );
    $("#total").text(
      productsSnapshot.reduce((acc, cur) => acc + cur.data().price, 0)
    );
    const cartContainer = $("#cart-container");
    const cartItems = [];

    // loop list items to create DOM nodes
    productsSnapshot.forEach((productSnapshot, index) => {
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
      $product.on("click", `#${productID}-add`, function () {
        const currentCount = $(`#${productID}-count`).val();
        const newCount = Number(currentCount) + 1;
        const newSum = formatPrice(newCount * product.price);

        // update count
        $(`#${productID}-count`).val(newCount);
        // update sum
        $(`#${productID}-sum`).text(newSum);
        // update total
        updateTotalPrice();
      });

      // reduce
      $product.on("click", `#${productID}-reduce`, function () {
        const currentCount = $(`#${productID}-count`).val();
        const newCount = Number(currentCount) - 1;
        if (newCount === 0) {
          $product.remove();
        }
        const newSum = formatPrice(newCount * product.price);

        // update count
        $(`#${productID}-count`).val(newCount);
        // update sum
        $(`#${productID}-sum`).text(newSum);
        // update total
        updateTotalPrice();
        // update cart item count
        updateCartItemCount();
      });

      // input
      $product.on("change", `#${productID}-count`, function () {
        let newCount = $(this).val();
        if (newCount < 1) {
          // TODO: show error msg
          newCount = 1;
          // fixed to 1 as minimum
          $(this).val(1);
        }
        console.log(newCount);
        const newSum = formatPrice(newCount * product.price);

        // update sum
        $(`#${productID}-sum`).text(newSum);
        // update total
        updateTotalPrice();
      });

      // remove
      $product.on("click", `#${productID}-remove`, function () {
        $product.remove();
        // update total
        updateTotalPrice();
        // update cart item count
        updateCartItemCount();
      });

      cartItems.push($product);
    });

    // TODO: summary section
    // append to DOM
    cartContainer.append(cartItems);
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

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userID = user.uid;
    getShoppingList(userID);
  } else {
    // TODO: not login error
  }
});
