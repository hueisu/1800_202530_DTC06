// src/history-list.js
import { db } from "./firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";
import $ from "jquery";

// your actual user ID
const USER_ID = "nfvjqtJYjsgMuls0NwbfGEWOKBl2";
const HISTORY_DOC = "rishi"; // the document name
const MONTH = "Oct"; // the field name inside that doc

async function loadHistory() {
  const $container = $("#history-container");
  const $noHistory = $("#no-history");

  $container.empty();
  $noHistory.addClass("hidden");

  try {
    console.log(`Fetching: users/${USER_ID}/history-list/${HISTORY_DOC}`);
    const docRef = doc(db, `users/${USER_ID}/history-list/${HISTORY_DOC}`);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.warn("No such document!");
      $noHistory.removeClass("hidden");
      return;
    }

    const data = docSnap.data();
    console.log("Document data:", data);

    const monthData = data[MONTH];
    if (!monthData) {
      console.warn(`No month data found under '${MONTH}'`);
      $noHistory.removeClass("hidden");
      return;
    }

    // Loop over days (12, 15, etc.)
    Object.keys(monthData).forEach((day) => {
      const item = monthData[day];
      const total = Number(item.price) * Number(item.count);

      const $shoppingList = $(`
        <div class="bg-gray-200 rounded-lg p-4 mb-4">
          <h2 class="text-lg font-semibold mb-2">Shopping - ${MONTH} ${day}</h2>
          <div id="items-${MONTH}-${day}" class="space-y-2"></div>
          <div class="text-right mt-4">
            <span class="font-bold">Total: $${total.toFixed(2)}</span>
          </div>
        </div>
      `);

      const $itemsContainer = $shoppingList.find(`#items-${MONTH}-${day}`);
      const imgName = item.name.toLowerCase().replace(/\s+/g, "-");

      const $item = $(`
        <div class="flex items-center mb-2">
          <img src="./images/${imgName}.png" alt="${item.name}" class="w-12 h-12 mr-2">
          <div>
            <span class="font-semibold">${item.name}</span>
            <span class="text-gray-600 ml-2">$${item.price}</span>
          </div>
          <input
            type="number"
            value="${item.count}"
            class="w-10 ml-auto p-1 border rounded bg-white text-center"
            readonly
          >
        </div>
      `);

      $itemsContainer.append($item);
      $container.append($shoppingList);
    });
  } catch (err) {
    console.error("Error loading history:", err);
    $container.html(`<p class="text-red-500">Failed to load history.</p>`);
  }
}

$(document).ready(loadHistory);

