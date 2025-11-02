import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import $ from "jquery";
import { hideLoading, showLoading } from "./general";

async function displayProduct() {
  const productId = new URL(window.location.href).searchParams.get("id");

  showLoading();
  try {
    const productRef = doc(db, "products", productId);
    const querySnapshot = await getDoc(productRef);
    const product = querySnapshot.data();
    const productContainer = $("#product-information");

    const element = `
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
            <button class="bg-blue-200 py-2 px-3 rounded hover:cursor-pointer hover:bg-blue-300">Add to list</button>
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
    `;
    // });

    productContainer.html(element);
  } catch (error) {
    console.error(error);
  }
  hideLoading();
}

displayProduct();
