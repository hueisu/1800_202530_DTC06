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
  where,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import $ from "jquery";
import { hideLoading, showAlert, showLoading } from "./general";
import { addProductToCurrentList, toggleFavorite } from "./db";
import { onAuthReady } from "./authentication.js";

async function displayProductsCards(userID = null, favorites = []) {
  const productsRef = collection(db, "products");
  const featuredProducts = query(productsRef, where("featured", "==", "true"));
  const productContainer = $("#product-container");

  showLoading();
  try {
    const querySnapshot = await getDocs(featuredProducts);
    querySnapshot.forEach((doc) => {
      const product = doc.data();
      const isInitiallyFavorited = favorites.includes(doc.id);
      const initialClass = isInitiallyFavorited ? "fa-solid" : "fa-regular";
      const $productCard = $(`
        <a href="/product?id=${doc.id}" class="hover:cursor-pointer border border-gray-300 rounded-md flex flex-col relative">
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

  updateDoc(productsRef, {
    brand: "Horizon",
    category: "dairy",
    description:
      "A rich, thick dairy product with a high fat content (usually around 36–40%), perfect for adding a smooth, velvety texture to sauces, soups, desserts, and coffee. Heavy cream can be whipped into soft or stiff peaks for use in cakes, pastries, or toppings. Keep refrigerated and shake lightly before use.",
    imageUrl: "./images/heavy-cream.png",
    name: "Heavy cream",
    nameLower: "heavy cream",
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
    nameLower: "bananas",
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
    nameLower: "pumpkin pie",
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
    nameLower: "mini oreo",
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
          <a href="/product?id=${product.productId}" class="hover:cursor-pointer border border-gray-300 rounded-md flex flex-col relative">
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

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userID = user.uid;
    console.log(userID);
    displayPreviouslyAddedCards(userID);
  }
});

function showDashboard() {
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
    } else {
      await displayProductsCards();
    }
  });
}

showDashboard();
seedProducts();
