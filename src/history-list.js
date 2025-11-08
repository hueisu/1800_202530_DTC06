// src/history-list.js
import { db } from "./firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";
import { onAuthReady } from "./authentication.js";
import $ from "jquery";

// your actual user ID
const MONTH = new Date().toLocaleString("en-US", { month: "short" });

async function loadHistory(userId) {
  const $container = $("#history-container");
  const $noHistory = $("#no-history");

  $container.empty();
  $noHistory.addClass("hidden");

  try {
    // Get this user's history document under their UID
    const docRef = doc(db, `users/${userId}/history-list/${userId}`);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.warn("No history found for this user.");
      $noHistory.removeClass("hidden");
      return;
    }

    const data = docSnap.data();
    console.log("History data:", data);

    const monthData = data[MONTH];
    if (!monthData) {
      console.warn(`No month data found under '${MONTH}'`);
      $noHistory.removeClass("hidden");
      return;
    }

    
    Object.keys(monthData).forEach((day) => {
      const item = monthData[day];
      const total = Number(item.price) * Number(item.count);
      const imgName = item.name.toLowerCase().replace(/\s+/g, "-");

      const $shoppingList = $(`
        <div class="bg-gray-200 rounded-lg p-4 mb-4">
          <h2 class="text-lg font-semibold mb-2">Shopping - ${MONTH} ${day}</h2>
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
          <div class="text-right mt-4">
            <span class="font-bold">Total: $${total.toFixed(2)}</span>
          </div>
        </div>
      `);

      $container.append($shoppingList);
    });
  } catch (err) {
    console.error("Error loading history:", err);
    $container.html(`<p class="text-red-500">Failed to load history.</p>`);
  }
}

//Automatically runs once user is logged in
onAuthReady((user) => {
  if (user) {
    console.log(`Loading history for ${user.uid}`);
    loadHistory(user.uid);
  } else {
    $("#history-container").html(
      `<p class="text-gray-500">Please sign in to view your history.</p>`
    );
  }
});

$(document).ready(loadHistory);

