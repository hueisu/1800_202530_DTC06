import { db } from "./firebaseConfig.js";
import {
  collection,
  getDocs,
  addDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  doc,
} from "firebase/firestore";
import { addProductToCurrentList, toggleFavorite } from "./db.js";
import $ from "jquery";
import { onAuthReady } from "./authentication.js";
import { showAlert } from "./general";

const params = new URLSearchParams(window.location.search);
const storeId = params.get("id");

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

async function fetchStoreName(storeId) {
  const storeDocRef = doc(db, "stores", storeId);
  const storeDocSnap = await getDoc(storeDocRef);
  if (storeDocSnap.exists()) {
    return storeDocSnap.data().name;
  }
  return "";
}

// Display stores in dynamically made cards
function displayStores(stores, userID, favorites) {
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
      getProducts(storeId, storeName, userID, favorites);
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
async function getProducts(storeId, storeName, userID, favorites) {
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
    displayProducts(productArray, userID, favorites);
    // Switch view to product
    switchView(false);
  } catch (error) {
    console.error("Get product error: ", error);
  }
}

// Display product
function displayProducts(products, userID, favorites) {
  const container = $("#product-cards-container");
  container.empty();

  products.forEach((product) => {
    const productID = product.id;
    //If product was in user's favorites, heart icon should be filled
    const isInitiallyFavorited = favorites.includes(product.id);
    const initialClass = isInitiallyFavorited ? "fa-solid" : "fa-regular";
    const $productCard = $(`
        <a href="product.html?id=${product.id}" class="hover:cursor-pointer border border-gray-300 rounded-md flex flex-col relative">
          <div class="absolute right-3 top-3 text-red-500" data-favorite>
            <i id="save-${productID}" class="${initialClass} fa-heart fa-xl"></i>
          </div>

          <div class="flex items-center justify-center grow-1">
            <img src="${product.imageUrl}" class="" alt="${product.name}-image" />
          </div>

          <div class="p-3 flex justify-between">
            <div>
              <h5 class="font-bold">${product.name}</h5>
              <p>
                ${product.quantity} ${product.unit} - $${product.price}
              </p>
            </div>

            <div class="fa-xl border rounded-full self-start p-1 hover:bg-gray-100" data-add-to-list>
              <i class="fa-solid fa-plus"></i>
            </div>
          </div>
        </a>
        `);
    // add to favorite
    $productCard.on("click", "[data-favorite]", async function (e) {
      e.preventDefault();
      if (userID) {
        const isFavorited = await toggleFavorite(productID);
        if (isFavorited) {
          showAlert("Product was added to favorites!", "success");
        } else {
          showAlert("Product was removed from favorites!", "warning");
        }
      } else {
        window.location.href = "login.html";
      }
    });
    // add to current list
    $productCard.on("click", "[data-add-to-list]", async function (e) {
      e.preventDefault();
      await addProductToCurrentList(product, product.id);
    });

    container.append($productCard);
  });
}

function setup() {
  onAuthReady(async (user) => {
    let favorites = [];
    let userID = null;

    if (user) {
      userID = user.uid;
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.exists() ? userDoc.data() : {};
      favorites = userData.favorites || [];
    }

    const storesData = await getStores();
    if (storesData && storesData.length > 0) {
      displayStores(storesData, userID, favorites);
    }

    if (storeId) {
      const storeName = await fetchStoreName(storeId);
      getProducts(storeId, storeName, userID, favorites);
      switchView(false); // Show products only
    }
  });
}
setup();

window.switchView = switchView;
