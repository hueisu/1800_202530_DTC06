import { auth, db } from "./firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import $ from "jquery";
import { hideLoading, showAlert, showLoading } from "./general";
import { addProductToCurrentList } from "./db";
import { onAuthReady } from "./authentication.js";

async function displayProductsCards(userID, favorites) {
  const productsRef = collection(db, "products");
  const productContainer = $("#product-container");

  showLoading();
  try {
    const querySnapshot = await getDocs(productsRef);
    querySnapshot.forEach((doc) => {
      const product = doc.data();

      const $productCard = $(`
        <a href="/product?id=${doc.id}" class="hover:cursor-pointer border border-gray-300 rounded-md flex flex-col relative">
          <div class="absolute right-3 top-3 text-red-500" data-favorite>
            <i id="save-${doc.id}" class="fa-regular fa-heart fa-xl"></i>
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
        // TODO: add to favorite function here
        const isFavorited = await toggleFavorite(userID, doc.id);
        if (isFavorited) {
          showAlert("Product was added to favorites!");
        } else {
          showAlert("Product was removed from favorites!");
        }
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
      productContainer.append($productCard);
    });
  } catch (error) {
    console.error(error);
  }
  hideLoading();
}

async function seedProducts() {
  const productsRef = collection(db, "products");
  try {
    const querySnapshot = await getDocs(productsRef);

    // Check if the collection is empty
    if (querySnapshot.empty) {
      console.log("Products collection is empty. Seeding data...");
      addProductData();
    }
  } catch (error) {
    console.error(error);
  }
}

function addProductData() {
  const productsRef = collection(db, "products");

  // TODO: cate with tax info
  updateDoc(productsRef, {
    brand: "Horizon",
    category: "dairy",
    description:
      "A rich, thick dairy product with a high fat content (usually around 36–40%), perfect for adding a smooth, velvety texture to sauces, soups, desserts, and coffee. Heavy cream can be whipped into soft or stiff peaks for use in cakes, pastries, or toppings. Keep refrigerated and shake lightly before use.",
    imageUrl: "./images/heavy-cream.png",
    name: "Heavy cream",
    name_lower: "heavy cream",
    price: 6.89,
    quantity: 986,
    unit: "ml",
  });
  addDoc(productsRef, {
    brand: "",
    category: "produce",
    description:
      "Fresh, naturally sweet bananas packed with potassium and essential nutrients. Perfect for smoothies, snacks, or baking. Enjoy them on their own or sliced over cereal, oatmeal, or yogurt for a healthy boost of energy.",
    imageUrl: "./images/bananas.png",
    name: "Bananas",
    name_lower: "bananas",
    price: 0.35,
    quantity: 1,
    unit: "ea",
  });
  addDoc(productsRef, {
    brand: "Horizon",
    category: "bakery",
    description:
      "A rich and creamy pumpkin pie made with real pumpkin purée and warm spices like cinnamon and nutmeg. Its buttery crust and smooth texture make it the perfect dessert for holidays or any cozy occasion.",
    imageUrl: "./images/pumpkin-pie.png",
    name: "Pumpkin pie",
    name_lower: "pumpkin pie",
    price: 6.99,
    quantity: 1.2,
    unit: "kg",
  });
  addDoc(productsRef, {
    brand: "Horizon",
    category: "snacks",
    description:
      "Bite-sized Oreo cookies with the same classic chocolate crunch and sweet crème filling you love. Great for snacking, lunch boxes, or as a fun topping for ice cream and desserts.",
    imageUrl: "./images/mini-oreo.png",
    name: "Mini oreo",
    name_lower: "mini oreo",
    price: 4.25,
    quantity: 1,
    unit: "pack",
  });
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
                  ${product.count} at $${product.price} each
                </p>
              </div>
  
              <div class="fa-lg border rounded-full self-start p-1 hover:bg-gray-100 ml-2" data-add-to-list>
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
        previouslyAddedContainer.append($productCard);
      });
    });
  } catch (error) {
    console.error(error);
  } finally {
    hideLoading();
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userID = user.uid;
    console.log(userID);
    displayPreviouslyAddedCards(userID);
  }
});

function showDashboard() {
  onAuthReady(async (user) => {
    // 1. Build a reference to the user document
    const userRef = doc(db, "users", user.uid);

    // 2. Read that document once
    const userDoc = await getDoc(userRef);
    const userData = userDoc.exists() ? userDoc.data() : {};

    // 4. Read bookmarks as a plain array (no globals)
    const favorites = userData.favorites || [];

    // 5. Display cards, but now pass userRef and bookmarks (array)
    await displayProductsCards(user.uid, favorites);
  });
}

async function toggleFavorite(userID, docID) {
  const userRef = doc(db, "users", userID);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data() || {};
  const favorites = userData.favorites || []; // default to empty array

  const iconId = "save-" + docID;
  const icon = document.getElementById(iconId);

  // JS function ".includes" will return true if an item is found in the array
  const currentlyFavorited = favorites.includes(docID);
  let newFavoritedState;
  try {
    if (currentlyFavorited) {
      // Remove from Firestore array
      await updateDoc(userRef, { favorites: arrayRemove(docID) });
      icon.classList.add("fa-regular");
      icon.classList.remove("fa-solid");
      newFavoritedState = false;
    } else {
      // Add to Firestore array
      await updateDoc(userRef, { favorites: arrayUnion(docID) });
      icon.classList.add("fa-solid");
      icon.classList.remove("fa-regular");
      newFavoritedState = true;
    }
    return newFavoritedState;
  } catch (err) {
    console.error("Error toggling favorites:", err);
  }
}

showDashboard();
seedProducts();
