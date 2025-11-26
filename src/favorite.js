import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { toggleFavorite } from "./getProducts";
import { onAuthReady } from "./authentication.js";

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

      const $productCard = $(`
        <a href="/product?id=${doc.id}" class="hover:cursor-pointer border border-gray-300 rounded-md flex flex-col relative">
          <div class="absolute right-3 top-3 text-red-500" data-favorite>
            <i id="save-${doc.id}" class="fa-heart fa-xl"></i>
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

      const isInitiallyFavorited = favorites.includes(doc.id);
      const iconClass = isInitiallyFavorited ? "fa-solid" : "fa-regular";

      const icon = $productCard.find(".fa-heart");
      icon.addClass(iconClass);
      icon.removeClass(isInitiallyFavorited ? "fa-regular" : "fa-solid");

      // add to favorite
      $productCard.on("click", "[data-favorite]", async function (e) {
        e.preventDefault();
        // TODO: add to favorite function here
        const isFavorited = await toggleFavorite(userID, doc.id);
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
