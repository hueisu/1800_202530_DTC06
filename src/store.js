import { db } from "./firebaseConfig.js";
import { collection, getDocs, addDoc } from "firebase/firestore";

// Get store data from Firestore
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

// Get store data synchronously
async function init() {
  const storesData = await getStores();
  if (storesData && storesData.length > 0) {
    displayStores(storesData);
  } else {
    console.log("No store data");
  }
}

init();

// Display stores in dynamically made cards
function displayStores(stores) {
  const container = document.getElementById("store-cards-container");

  container.innerHTML = "";
  stores.forEach((store) => {
    const storeCard = `
            <div class="border border-gray-300 rounded-md flex flex-col" data-store-id="${store.id}" data-store-name="${store.name}">
                <div class="flex items-center justify-center grow-1">
                    <img class = "hover:cursor-pointer" src="${store.imageUrl}" class="" alt="${store.name} logo" />
                </div>
                <div class="p-3">
                    <h5 class="font-bold text-center">${store.name}</h5>
                </div>
            </div>
        `;
    const cardDiv = document.createElement("div");
    cardDiv.innerHTML = storeCard.trim();
    const storeCardElement = cardDiv.firstChild;

    // Change to product list on click
    storeCardElement.addEventListener("click", () => {
      const storeId = storeCardElement.dataset.storeId;
      const storeName = storeCardElement.dataset.storeName;
      getProducts(storeId, storeName);
    });

    container.appendChild(storeCardElement);
  });
}

// Switch from store list to product list
function switchView(showStores) {
  const storeView = document.getElementById("store-list-view");
  const productView = document.getElementById("product-list-view");

  if (showStores) {
    // Show stores view
    storeView.classList.remove("hidden");
    storeView.classList.add("block");

    // Hide product view
    productView.classList.remove("block");
    productView.classList.add("hidden");
  } else {
    // Show product view
    storeView.classList.remove("block");
    storeView.classList.add("hidden");

    // Hide stores view
    productView.classList.remove("hidden");
    productView.classList.add("block");
  }
}

// Get store product data
async function getProducts(storeId, storeName) {
  document.getElementById(
    "store-name-header"
  ).textContent = `${storeName} Products`;

  try {
    const productsList = collection(db, "stores", storeId, "storeProducts");
    const querySnapshot = await getDocs(productsList);
    const productArray = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    displayProducts(productArray);
    // Switch view to product
    switchView(false);
  } catch (error) {
    console.error("Error: ", error);
  }
}

// Display product
function displayProducts(products) {
  const container = document.getElementById("product-cards-container");
  container.innerHTML = "";

  products.forEach((product) => {
    const productCard = `
            <div class="border border-gray-300 rounded-md flex flex-col">
                <div class="flex items-center justify-center grow-1">
                    <img src="${product.imageUrl}" alt="${product.name}" class=""/>
                </div>    
                <div>
                    <h5 class="font-bold text-center">${product.name}</h5>
                    <p class="text-sm text-gray-600">Price: ${product.price}</p>
                </div>    
            </div>
        `;
    const cardDiv = document.createElement("div");
    cardDiv.innerHTML = productCard.trim();
    container.appendChild(cardDiv.firstChild);
  });
}

window.switchView = switchView;
