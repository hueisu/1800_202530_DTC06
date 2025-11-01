import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import $ from "jquery";

async function displayProductsCards() {
  const productsRef = collection(db, "products");
  const productContainer = $("#product-container");

  try {
    const querySnapshot = await getDocs(productsRef);
    let elements = "";
    querySnapshot.forEach((doc) => {
      const product = doc.data();

      elements += `
        <div class="border border-gray-300 rounded-md flex flex-col">
          <div class="flex items-center justify-center grow-1">
            <img src="${product.imageUrl}" class="" alt="${product.name}-image" />
          </div>
          <div class="p-3">
            <h5 class="font-bold">${product.name}</h5>
            <p>
              ${product.quantity} ${product.unit} - $${product.price}
            </p>
          </div>
        </div>
      `;
    });

    productContainer.html(elements);
  } catch (error) {
    console.error(error);
  }
}

async function seedProducts() {
  const productsRef = collection(db, "products");
  try {
    const querySnapshot = await getDocs(productsRef);

    // Check if the collection is empty
    if (querySnapshot.empty) {
      console.log("Products collection is empty. Seeding data...");
      // TODO: add data function
    }
  } catch (error) {
    console.error(error);
  }
}

seedProducts();
displayProductsCards();
