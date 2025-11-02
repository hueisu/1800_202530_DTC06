import { db } from "./firebaseConfig.js";
import { collection, getDocs, addDoc } from "firebase/firestore";

// Helper function to add the sample store documents.

async function getStores() {
  try {
    const storesCollection = collection(db, "stores");
    const querySnapshot = await getDocs(storesCollection);
    const storesArray = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    return storesArray;
  } catch (error) {
    console.error("Error: ", error);
    return [];
  }
}

function switchView(showStores) {
  const storeView = document.getElementById("store-list-view");
  const productView = document.getElementById("product-list-view");

  if (showStores) {
    storeView.style.display = "block";
    productView.style.display = "none";
  } else {
    storeView.style.display = "none";
    productView.style.display = "block";
  }
}

async function loadProducts(storeId, storeName) {
  document.getElementById(
    "store-name-header"
  ).textContent = `#{storeName} Products`;

  try {
    const productsList = collection(db, "stores", storeId, "products");
    const querySnapshot = await getDocs(productsList);
    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    displayProducts(products);

    // Switch view to product
    switchView(false);
  } catch (error) {
    console.error("Error: ", error);
  }

  // Switch view to product
  switchView(false);
}

// Call the seeding function when the main.html page loads.
seedHikes();
