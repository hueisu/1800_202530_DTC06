import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { onAuthReady } from "./authentication.js";
import { db } from "./firebaseConfig";
import $ from "jquery";
import { hideLoading, showAlert, showLoading } from "./general";
import { addProductToCurrentList, toggleFavorite } from "./db";

function showFavorites() {
  onAuthReady(async (user) => {
    // 1. Build a reference to the user document
    const userRef = doc(db, "users", user.uid);

    // 2. Read that document once
    const userDoc = await getDoc(userRef);
    const userData = userDoc.exists() ? userDoc.data() : {};

    // 4. Read bookmarks as a plain array (no globals)
    const favorites = userData.favorites || [];

    // 5. Display cards, but now pass userRef and bookmarks (array)
    await displayFavoritesCards(user.uid, favorites);
  });
}

async function displayFavoritesCards(userID, favorites) {
  const productsRef = collection(db, "products");
  const favoriteContainer = $("#favorite-container");

  showLoading();
  try {
    const querySnapshot = await getDocs(productsRef);
    querySnapshot.forEach((doc) => {
      if (!favorites.includes(doc.id)) {
        return;
      }
      const product = doc.data();
      //If product was in user's favorites, heart icon should be filled
      const isInitiallyFavorited = favorites.includes(doc.id);
      const initialClass = isInitiallyFavorited ? "fa-solid" : "fa-regular";

      const $productCard = $(`
        <a href="product.html?id=${doc.id}" class="hover:cursor-pointer hover:shadow-lg transition-shadow duration-300 hover:scale-105 border border-gray-300 hover:border-gray-700 rounded-md flex flex-col relative bg-white">
          <div class="absolute right-3 top-3 text-red-500" data-favorite>
            <i id="save-${doc.id}" class="${initialClass} fa-heart fa-xl"></i>
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

            <div class="fa-lg border rounded-full self-start p-1 hover:bg-gray-100 ml-2" data-add-to-list>
              <i class="fa-solid fa-plus"></i>
            </div>
          </div>
        </a>
      `);

      // add to favorite
      $productCard.on("click", "[data-favorite]", async function (e) {
        e.preventDefault();
        const isFavorited = await toggleFavorite(doc.id);
        if (isFavorited) {
          showAlert("Product was added to favorites!");
        } else {
          showAlert("Product was removed from favorites!");
        }
        $productCard.remove();
      });

      // add to current list
      $productCard.on("click", "[data-add-to-list]", async function (e) {
        e.preventDefault();
        await addProductToCurrentList(product, doc.id);
      });
      favoriteContainer.append($productCard);
    });
  } catch (error) {
    console.error(error);
  }
  hideLoading();
}

showFavorites();
