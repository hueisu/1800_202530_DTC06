import {
  collection,
  endAt,
  getDocs,
  orderBy,
  query,
  startAt,
  doc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import $ from "jquery";
import { db } from "./firebaseConfig";
import { hideLoading, showAlert, showLoading } from "./general";
import { addProductToCurrentList, toggleFavorite } from "./db";
import { onAuthReady } from "./authentication.js";
const ENTER = 13;

async function searchByKeyword(keyword = "", userID = "", favorites = []) {
  const resultContainer = $("#result");
  // reset result
  resultContainer.html(``);
  showLoading();

  try {
    const productQuery = query(
      collection(db, "products"),
      orderBy("name_lower"),
      startAt(`${keyword}`),
      endAt(`${keyword}\uf8ff`)
    );
    const querySnapshot = await getDocs(productQuery);

    // no result error
    if (!querySnapshot.docs.length) {
      resultContainer.append(`
        <div class="text-gray-700">There is no product named ${keyword}. <br/>Try another one.</div>
        `);
    }

    querySnapshot.forEach((doc) => {
      const product = doc.data();
      const docID = doc.id;
      const isInitiallyFavorited = favorites.includes(docID);

      const $productCard = $(`
        <a href="/product?id=${doc.id}" class="hover:cursor-pointer border border-gray-300 rounded-md flex flex-col relative">
          <div class="absolute right-3 top-3 text-red-500" data-favorite>
            <i id="save-${docID}" class="fa-regular fa-heart fa-xl"></i>
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
        // Use the existing toggleFavorite function
        if (userID) {
          const isFavorited = await toggleFavorite(docID);
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

      resultContainer.append($productCard);
    });
  } catch (error) {
    console.error(error);
    showAlert("Something went wrong...", "error");
  } finally {
    hideLoading();
  }
}

function setup() {
  onAuthReady(async (user) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.exists() ? userDoc.data() : {};
      const favorites = userData.favorites || [];

      $("#search").on("keydown", function (e) {
        if (e.which === ENTER) {
          searchByKeyword(e.target.value, user.uid, favorites);
        }
      });
    } else {
      $("#search").on("keydown", function (e) {
        if (e.which === ENTER) {
          searchByKeyword(e.target.value);
        }
      });
    }
  });
}

setup();
