import { hideLoading, showLoading } from "./general";
import $ from "jquery";

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

async function getShoppingList() {
  showLoading();

  try {
    // TODO: empty cart
    if (!DUMMY_ITEMS.length) return;

    $("#cart-items-count").text(
      DUMMY_ITEMS.reduce((acc, cur) => acc + cur.count, 0)
    );
    const cartContainer = $("#cart-container");
    const cartItems = [];

    // loop added items to create DOM nodes
    DUMMY_ITEMS.forEach((item, index) => {
      const $item = $(`
        <div
            id="cart-item-${index}"
            class="rounded-lg bg-gray-200 p-4 flex justify-between gap-2 min-w-fit"
          >
          <div class="min-w-[80px] max-w-[150px]">
            <img src="${item.imageUrl}" alt="${item.name}" />
          </div>

          <div class="basis-2/3 flex justify-between gap-2 max-h-30">
            <div class="flex flex-col items-start justify-between">
              <p class="font-semibold">${item.name}</p>
              <button class="text-red-500 hover:cursor-pointer">Remove</button>
            </div>

            <div class="flex flex-col justify-between items-end">
              <div class="flex items-center gap-2">
                <button id="${
                  item.id
                }-reduce" class="hover:cursor-pointer px-2 rounded bg-blue-200">
                  -
                </button>
                <input
                  id="${item.id}-count"
                  class="bg-white w-[30px] text-center"
                  name="quantity"
                  value="${item.count}"
                />
                <button id="${
                  item.id
                }-add" class="hover:cursor-pointer px-2 rounded bg-blue-200">
                  +
                </button>
              </div>
              <p class="text-right font-semibold">
                $<span id="${item.id}-sum">
                  ${formatPrice(item.price * item.count)}
                </span>
              </p>
            </div>
          </div>
        </div>
      `);

      // add
      $item.find(`#${item.id}-add`).on("click", function () {
        const currentCount = $(`#${item.id}-count`).val();
        const newCount = Number(currentCount) + 1;
        const newSum = formatPrice(newCount * item.price);

        // update count
        $(`#${item.id}-count`).val(newCount);
        // update sum
        $(`#${item.id}-sum`).text(newSum);
      });

      // reduce
      $item.find(`#${item.id}-reduce`).on("click", function () {
        const currentCount = $(`#${item.id}-count`).val();
        const newCount = Number(currentCount) - 1;
        const newSum = formatPrice(newCount * item.price);

        // update count
        $(`#${item.id}-count`).val(newCount);
        // update sum
        $(`#${item.id}-sum`).text(newSum);
      });

      // input
      $item.find(`#${item.id}-count`).on("change", function () {
        const newCount = $(this).val();
        const newSum = formatPrice(newCount * item.price);

        // update sum
        $(`#${item.id}-sum`).text(newSum);
      });

      // TODO: remove
      cartItems.push($item);
    });

    // TODO: summary section
    // append to DOM
    cartContainer.append(cartItems);
  } catch (error) {
    console.error(error);
  }
  hideLoading();
}

getShoppingList();
