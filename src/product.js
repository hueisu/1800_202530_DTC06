import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import $ from "jquery";
import { hideLoading, showLoading } from "./general";
import { addProductToCurrentList } from "./getProducts";

async function displayProduct() {
  const productID = new URL(window.location.href).searchParams.get("id");

  showLoading();
  try {
    const productRef = doc(db, "products", productID);
    const querySnapshot = await getDoc(productRef);
    const product = querySnapshot.data();
    const productContainer = $("#product-information");

    const $element = $(`
      <div class="max-w-xl mx-auto">
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-center grow-1 border border-gray-300 rounded-md ">
            <img src="${product.imageUrl}" class="" alt="${product.name}-image" />
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
          <div>
            <span class="rounded bg-blue-100 py-1 px-2">Store1</span>
            <span class="rounded bg-blue-100 py-1 px-2">Store2</span>
            <span class="rounded bg-blue-100 py-1 px-2">Store3</span>
            <span class="rounded bg-blue-100 py-1 px-2">Store4</span>
          </div>
          <p>${product.description}</p>
        </div>
      </div>
    `);

    $element.on("click", "#add-to-list", async function () {
      await addProductToCurrentList(product, productID);
    });

    productContainer.append($element);
  } catch (error) {
    console.error(error);
  }
  hideLoading();
}

displayProduct();
