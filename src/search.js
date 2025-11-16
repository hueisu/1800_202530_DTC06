import {
  collection,
  endAt,
  getDocs,
  orderBy,
  query,
  startAt,
} from "firebase/firestore";
import $ from "jquery";
import { db } from "./firebaseConfig";
import { hideLoading, showAlert, showLoading } from "./general";

const ENTER = 13;

async function searchByKeyword(keyword = "") {
  const resultContainer = $("#result");
  resultContainer.html(``);
  showLoading();

  try {
    // console.log(keyword);
    const productQuery = query(
      collection(db, "products"),
      orderBy("name_lower"),
      startAt(`${keyword}`),
      endAt(`${keyword}\uf8ff`)
    );
    const querySnapshot = await getDocs(productQuery);
    querySnapshot.forEach((doc) => {
      const product = doc.data();

      const $productCard = $(`
        <a href="/product?id=${doc.id}" class="hover:cursor-pointer border border-gray-300 rounded-md flex flex-col relative">
          <div class="absolute right-3 top-3 text-red-500" data-favorite>
            <i class="fa-regular fa-heart fa-xl"></i>
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
      $productCard.on("click", "[data-favorite]", function (e) {
        e.preventDefault();
        // TODO: add to favorite function here 🔥
      });

      // hover on add to favorite
      $productCard.on("mouseenter", "[data-favorite]", function () {
        $(this).find(".fa-heart").addClass("fa-solid");
        $(this).find(".fa-heart").removeClass("fa-regular");
      });
      $productCard.on("mouseleave", "[data-favorite]", function () {
        $(this).find(".fa-heart").addClass("fa-regular");
        $(this).find(".fa-heart").removeClass("fa-solid");
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
  $("#search").on("keydown", function (e) {
    if (e.which === ENTER) {
      searchByKeyword(e.target.value);
    }
  });
}

setup();
