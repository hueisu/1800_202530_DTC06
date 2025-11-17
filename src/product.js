import { auth, db } from "./firebaseConfig";
import { doc, getDoc, getDocs, query } from "firebase/firestore";
import $ from "jquery";
import { hideLoading, showAlert, showLoading } from "./general";
import { addProductToCurrentList } from "./getProducts";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ADMIN } from "./constant";

async function displayProduct() {
  const productID = new URL(window.location.href).searchParams.get("id");

  showLoading();
  try {
    const productRef = doc(db, "products", productID);
    const querySnapshot = await getDoc(productRef);
    const product = querySnapshot.data();
    const productContainer = $("#product-information");

    const storeNames = await Promise.all(
      product.stores.map(async (store) => {
        if (!store.length) {
          return;
        }
        const storeRef = doc(db, "stores", store);
        const storeSnapshot = await getDoc(storeRef);
        return storeSnapshot.data().name;
      })
    );

    const $element = $(`
      <div class="max-w-xl mx-auto">
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-center grow-1 border border-gray-300 rounded-md ">
            <img src="${product.imageUrl}" class="" alt="${
      product.name
    }-image" />
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
                `<a href="/store-list.html" class="rounded bg-purple-200 py-1 px-2">${storeName}</a>`
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

    $element.on("click", "#writeReviewBtn", function () {
      if (!productID) {
        console.warn("No product ID found!");
        return;
      }
      // Save ID to localStorage and redirect
      localStorage.setItem("productDocID", productID);
      window.location.href = "review.html";
    });

    productContainer.append($element);
  } catch (error) {
    showAlert("Something went wrong...", "error");
    console.error(error);
  }
  hideLoading();
}

document.addEventListener("DOMContentLoaded", async () => {
  await displayProduct();
});

onAuthStateChanged(auth, (user) => {
  const productID = new URL(window.location.href).searchParams.get("id");

  if (user || ADMIN.includes(user.uid)) {
    $("#product-information").prepend(
      `<a href="/editProduct?id=${productID}" class="block bg-purple-200 p-2 rounded w-fit mb-5 ml-auto self-end">Edit</a>`
    );
  }
});
