import { onAuthStateChanged } from "firebase/auth";
import { hideLoading, showLoading } from "./general";
import $ from "jquery";
import { auth, db } from "./firebaseConfig";
import { collection, doc, getDocs } from "firebase/firestore";

function formatPrice(number) {
  return parseFloat(number.toFixed(2));
}

const DUMMY_ITEMS = [
  {
    id: "tHm6SI3eBQK0hauIMROQ",
    brand: "Horizon",
    imageUrl: "./images/heavy-cream.png",
    name: "Heavy cream",
    category: "dairy",
    price: 6.89,
    count: 3,
  },
  {
    id: "VZ4RSOtHWZuN9ZgYzTn6",
    brand: "",
    imageUrl: "./images/bananas.png",
    name: "Bananas",
    category: "produce",
    price: 0.35,
    count: 2,
  },
  {
    id: "YdV7gX78XN4YBvhC2hk1",
    brand: "Horizon",
    imageUrl: "./images/mini-oreo.png",
    name: "Mini oreo",
    category: "snacks",
    price: 4.25,
    count: 8,
  },
];

// TODO: tax info in category?

async function getShoppingList(userID) {
  showLoading();

  try {
    const currentListRef = collection(db, "users", userID, "currentList");
    const currentListSnapshot = await getDocs(currentListRef);
    const productsSnapshot = currentListSnapshot.docs;

    // TODO: empty cart
    if (!productsSnapshot) return;

    $("#cart-items-count").text(
      productsSnapshot.reduce((acc, cur) => acc + cur.data().count, 0)
    );
    const cartContainer = $("#cart-container");
    const cartItems = [];

    // loop list items to create DOM nodes
    productsSnapshot.forEach((productSnapshot, index) => {
      const productID = productSnapshot.id;
      const product = productSnapshot.data();

      const $product = $(`
        <div
            id="cart-item-${index}"
            class="rounded-lg bg-gray-200 p-4 flex justify-between gap-2 min-w-fit"
          >
          <div class="min-w-[80px] max-w-[150px]">
            <a href="/product?id=${productID}">
              <img src="${product.imageUrl}" alt="${product.name}" />
            </a>
          </div>

          <div class="basis-2/3 flex justify-between gap-2 max-h-30">
            <div class="flex flex-col items-start justify-between">
              <a href="/product?id=${productID}" class="font-semibold">
                ${product.name}
              </a>
              <button id="${productID}-remove" class="text-red-500 hover:cursor-pointer">Remove</button>
            </div>

            <div class="flex flex-col justify-between items-end">
              <div class="flex items-center gap-2">
                <button id="${productID}-reduce" class="hover:cursor-pointer px-2 rounded bg-blue-200">
                  -
                </button>
                <input
                  id="${productID}-count"
                  class="bg-white w-[30px] text-center"
                  name="quantity"
                  value="${product.count}"
                />
                <button id="${productID}-add" class="hover:cursor-pointer px-2 rounded bg-blue-200">
                  +
                </button>
              </div>
              <p class="text-right font-semibold">
                $<span id="${productID}-sum">
                  ${formatPrice(product.price * product.count)}
                </span>
              </p>
            </div>
          </div>
        </div>
      `);

      // add
      $product.on("click", `#${productID}-add`, function () {
        const currentCount = $(`#${productID}-count`).val();
        const newCount = Number(currentCount) + 1;
        const newSum = formatPrice(newCount * product.price);

        // update count
        $(`#${productID}-count`).val(newCount);
        // update sum
        $(`#${productID}-sum`).text(newSum);
      });

      // reduce
      $product.on("click", `#${productID}-reduce`, function () {
        const currentCount = $(`#${productID}-count`).val();
        const newCount = Number(currentCount) - 1;
        if (newCount === 0) {
          $product.remove();
        }
        const newSum = formatPrice(newCount * product.price);

        // update count
        $(`#${productID}-count`).val(newCount);
        // update sum
        $(`#${productID}-sum`).text(newSum);
      });

      // input
      $product.on("change", `#${productID}-count`, function () {
        const newCount = $(this).val();
        const newSum = formatPrice(newCount * product.price);

        // update sum
        $(`#${productID}-sum`).text(newSum);
      });

      // remove
      $product.on("click", `#${productID}-remove`, function () {
        $product.remove();
      });

      cartItems.push($product);
    });

    // TODO: summary section
    // append to DOM
    cartContainer.append(cartItems);
  } catch (error) {
    console.error(error);
  }
  hideLoading();
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userID = user.uid;
    getShoppingList(userID);
  } else {
    // TODO: not login error
  }
});
