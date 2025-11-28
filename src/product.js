import { auth, db } from "./firebaseConfig";
import { doc, getDoc, getDocs, query } from "firebase/firestore";
import $ from "jquery";
import { hideLoading, showAlert, showLoading } from "./general";
import { addProductToCurrentList, toggleFavorite } from "./db";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ADMIN } from "./constant";

async function displayProduct(userID = null, favorites = []) {
  const productID = new URL(window.location.href).searchParams.get("id");

  showLoading();
  try {
    const productRef = doc(db, "products", productID);
    const querySnapshot = await getDoc(productRef);
    const product = querySnapshot.data();
    const productContainer = $("#product-information");

    const storeNames = await Promise.all(
      (product.stores || []).map(async (store) => {
        if (!store.length) {
          return;
        }

        const storeRef = doc(db, "stores", store);
        const storeSnapshot = await getDoc(storeRef);
        return storeSnapshot.data().name;
      })
    );

    // If product was in user's favorites, heart icon should be filled
    const isInitiallyFavorited = favorites.includes(productID);
    const initialClass = isInitiallyFavorited ? "fa-solid" : "fa-regular";

    const $element = $(`
      <div class="max-w-xl mx-auto">
        <div class="flex flex-col gap-3 relative">
          <div class="flex items-center justify-center grow-1 border border-gray-300 rounded-md ">
            <img src="${product.imageUrl}" alt="${product.name}-image" />
          </div>
          <div class="absolute right-3 top-3 text-red-500" data-favorite>
            <i id="save-${
              querySnapshot.id
            }" class="${initialClass} fa-heart fa-xl"></i>
          </div>
          <div class="flex justify-between">
            <div>
              <h5 class="font-bold">${product.name}</h5>
              <p>
              ${product.quantity} ${product.unit} - $${product.price}
              </p>
            </div>
            <button id="add-to-list" class="bg-blue-200 py-2 px-3 rounded hover:cursor-pointer hover:bg-blue-300">Add to list</button>
          </div>
          <div class="flex gap-2 flex-wrap">
          ${storeNames
            .map(
              (storeName) =>
                `<a href="store-list.html" class="rounded bg-purple-200 py-[2px] px-[5px] text-xs">${storeName}</a>`
            )
            .join("")}
          </div>
          <p>${product.description}</p>
        </div>
        <button id="writeReviewBtn" class="bg-blue-200 py-2 px-3 rounded hover:cursor-pointer hover:bg-blue-300 mt-3">
          Write Review
        </button>
      </div>
    `);

    $element.on("click", "#add-to-list", async function () {
      await addProductToCurrentList(product, productID);
    });

    // add to favorite
    $element.on("click", "[data-favorite]", async function (e) {
      e.preventDefault();
      if (userID) {
        const isFavorited = await toggleFavorite(productID);
        if (isFavorited) {
          showAlert("Product was added to favorites!");
        } else {
          showAlert("Product was removed from favorites!");
        }
      } else {
        window.location.href = "login.html";
      }
    });

    $element.on("click", "#writeReviewBtn", function () {
      if (!productID) {
        console.warn("No product ID found!");
        return;
      }
      // Save ID to localStorage and redirect
      localStorage.setItem("productDocID", productID);
      window.location.href = "review.html";
    });

    productContainer.prepend($element);
  } catch (error) {
    showAlert("Something went wrong...", "error");
    console.error(error);
  }
  hideLoading();
}

document.addEventListener("DOMContentLoaded", async () => {});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    if (ADMIN.includes(user.uid)) {
      const productID = new URL(window.location.href).searchParams.get("id");
      $("#product-information").prepend(
        `<a href="editProduct.html?id=${productID}" class="block bg-purple-200 p-2 rounded w-fit mb-5 ml-auto self-end">Edit</a>`
      );
    }
    const userID = user.uid;
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.exists() ? userDoc.data() : {};
    const favorites = userData.favorites || [];
    console.log(favorites);

    await displayProduct(userID, favorites);
  } else {
    await displayProduct();
  }
});
