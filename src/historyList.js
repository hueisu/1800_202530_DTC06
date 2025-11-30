import { db } from "./firebaseConfig.js";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { onAuthReady } from "./authentication.js";
import $ from "jquery";
import { formatPrice, hideLoading, showLoading } from "./general.js";

async function loadHistory(userId) {
  const $container = $("#history-container");
  const $noHistory = $("#no-history");

  $container.empty();
  $noHistory.addClass("hidden");

  showLoading();
  try {
    // Get this user's history document under their UID
    const historyListRef = collection(db, `users/${userId}/historyList`);
    const historyQuery = query(historyListRef, orderBy("date", "desc"));
    const historyListSnapshot = await getDocs(historyQuery);

    // no history
    if (!historyListSnapshot.docs.length) {
      console.warn("No history found for this user.");
      $noHistory.removeClass("hidden");
      return;
    }

    historyListSnapshot.docs.forEach((list) => {
      const listData = list.data();
      const total = listData.content.reduce(
        (acc, cur) => acc + cur.price * cur.count,
        0
      );
      const listDate = listData.date.toDate();
      const listMonth = listDate.toLocaleString("default", { month: "short" });

      const $historyList = $(`
          <div class="bg-gray-200 rounded-lg p-4 mb-4">
            <h2 class="text-lg font-semibold mb-2">Shopping - ${listMonth} ${listDate.getDate()}</h2>
            <div data-list></div>
            <div class="text-right mt-4">
              <span class="font-bold">Total: $${formatPrice(total)}</span>
            </div>
          </div>
        `);

      const dataListContainer = $historyList.find("[data-list]");

      listData.content.forEach((item) => {
        const $item = $(`
          <div class="flex items-center mb-2">
            <a href="product.html?id=${item.productId}">
              <img src="${item.imageUrl}"
                alt="${item.name}" class="w-12 h-12 mr-2">
            </a>
            <div>
              <span class="font-semibold">${item.name}</span>
              <span class="text-gray-600 ml-2">$${formatPrice(
                item.price
              )}</span>
            </div>
            <input
              type="number"
              value="${item.count}"
              class="w-10 ml-auto p-1 border rounded bg-white text-center"
              readonly
            >
          </div>
          `);

        dataListContainer.append($item);
      });
      $container.append($historyList);
    });
  } catch (error) {
    console.error("Error loading history:", err);
    $container.html(`<p class="text-red-500">Failed to load history.</p>`);
  } finally {
    hideLoading();
  }
}

// Automatically runs once user is logged in
onAuthReady((user) => {
  if (user) {
    loadHistory(user.uid);
  } else {
    $("#history-container").html(
      `<p class="text-gray-500">Please sign in to view your history.</p>`
    );
  }
});
