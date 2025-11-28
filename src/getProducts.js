import { db } from "./firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import $ from "jquery";
import { hideLoading, showAlert, showLoading } from "./general";
import { addProductToCurrentList, toggleFavorite } from "./db";
import { onAuthReady } from "./authentication.js";

async function displayProductsCards(userID = null, favorites = []) {
  const productsRef = collection(db, "products");

  showLoading();
  try {
    const querySnapshot = await getDocs(productsRef);
    const sortedProducts = querySnapshot.docs.sort(
      (a, b) => b.data()?.averageRating || 0 - a.data()?.averageRating || 0
    );

    sortedProducts.forEach((doc) => {
      const product = doc.data();
      const isInitiallyFavorited = favorites.includes(doc.id);
      const initialClass = isInitiallyFavorited ? "fa-solid" : "fa-regular";

      const $productCard = $(`
        <a href="product.html?id=${doc.id}" class="hover:cursor-pointer border border-gray-300 rounded-md flex flex-col relative">
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
        if (userID) {
          const isFavorited = await toggleFavorite(doc.id);
          if (isFavorited) {
            showAlert("Product was added to favorites!");
          } else {
            showAlert("Product was removed from favorites!");
          }
        } else {
          window.location.href = "/login.html";
        }
      });

      // add to current list
      $productCard.on("click", "[data-add-to-list]", async function (e) {
        e.preventDefault();
        await addProductToCurrentList(product, doc.id);
      });

      if (product.featured) {
        const featuredProductContainer = $("#featured-product");
        featuredProductContainer.append($productCard);
      } else {
        const otherProductContainer = $("#other-product");
        otherProductContainer.append($productCard);
      }
    });
  } catch (error) {
    console.error(error);
  }
  hideLoading();
}

//Show previously added list
async function displayPreviouslyAddedCards(userID) {
  const previouslyAddedRef = collection(db, "users", userID, "historyList");
  const previouslyAddedContainer = $("#previously-added-container");
  const heading = document.getElementById("previously-added-title");
  const mostRecentList = query(
    previouslyAddedRef,
    orderBy("date", "desc"),
    limit(1)
  );
  showLoading();
  try {
    const querySnapshot = await getDocs(mostRecentList);
    if (querySnapshot.empty) {
      heading.innerText = "Previously Added (No History Available)";
      return;
    }
    querySnapshot.forEach((doc) => {
      const historyRecord = doc.data();
      let displayDate = "";
      const dateObject = historyRecord.date.toDate();
      displayDate = dateObject.toDateString();
      console.log(displayDate);
      heading.innerText = `Previously Added On ${displayDate}`;
      historyRecord.content.forEach((product) => {
        const $productCard = $(`
          <a href="product.html?id=${product.productId}" class="hover:cursor-pointer border border-gray-300 rounded-md flex flex-col relative">
            <div class="flex items-center justify-center grow-1">
              <img src="${product.imageUrl}" class="" alt="${product.name}-image" />
            </div>
  
            <div class="p-3 flex justify-between">
              <div>
                <h5 class="font-bold">${product.name}</h5>
                <p>
                  ${product.count} at $${product.price} each
                </p>
              </div>
  
              <div class="fa-lg border rounded-full self-start p-1 hover:bg-gray-100 ml-2" data-add-to-list>
                <i class="fa-solid fa-plus"></i>
              </div>
            </div>
          </a>
        `);
        // add to current list
        $productCard.on("click", "[data-add-to-list]", async function (e) {
          e.preventDefault();
          await addProductToCurrentList(product, doc.id);
        });
        previouslyAddedContainer.append($productCard);
      });
    });
  } catch (error) {
    console.error(error);
  } finally {
    hideLoading();
  }
}

onAuthReady(async (user) => {
  if (user) {
    // 1. Build a reference to the user document
    const userRef = doc(db, "users", user.uid);

    // 2. Read that document once
    const userDoc = await getDoc(userRef);
    const userData = userDoc.exists() ? userDoc.data() : {};

    // 4. Read bookmarks as a plain array (no globals)
    const favorites = userData.favorites || [];

    // 5. Display cards, but now pass userRef and bookmarks (array)
    await displayProductsCards(user.uid, favorites);
    await displayPreviouslyAddedCards(user.uid);
  } else {
    await displayProductsCards();
  }
});
