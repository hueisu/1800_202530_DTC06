import { db } from "./firebaseConfig";
import { addDoc, collection, getDocs } from "firebase/firestore";
import $ from "jquery";
import { hideLoading, showLoading } from "./general";

async function displayProductsCards() {
  const productsRef = collection(db, "products");
  const productContainer = $("#product-container");

  showLoading();
  try {
    const querySnapshot = await getDocs(productsRef);
    let elements = "";

    querySnapshot.forEach((doc) => {
      const product = doc.data();

      elements += `
        <a href="/product?id=${doc.id}" class="hover:cursor-pointer border border-gray-300 rounded-md flex flex-col">
          <div class="flex items-center justify-center grow-1">
            <img src="${product.imageUrl}" class="" alt="${product.name}-image" />
          </div>
          <div class="p-3">
            <h5 class="font-bold">${product.name}</h5>
            <p>
              ${product.quantity} ${product.unit} - $${product.price}
            </p>
          </div>
        </a>
      `;
    });

    productContainer.html(elements);
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

  addDoc(productsRef, {
    brand: "Horizon",
    category: "dairy",
    description:
      "A rich, thick dairy product with a high fat content (usually around 36–40%), perfect for adding a smooth, velvety texture to sauces, soups, desserts, and coffee. Heavy cream can be whipped into soft or stiff peaks for use in cakes, pastries, or toppings. Keep refrigerated and shake lightly before use.",
    imageUrl: "./images/heavy-cream.png",
    name: "Heavy cream",
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
    price: 4.25,
    quantity: 1,
    unit: "pack",
  });
}

displayProductsCards();
seedProducts();
