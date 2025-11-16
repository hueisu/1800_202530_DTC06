import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import $, { error } from "jquery";
import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import { hideLoading, showAlert, showLoading, showModal } from "./general";

export const ADMIN = [
  import.meta.env.VITE_SU,
  import.meta.env.VITE_MATTHEW,
  import.meta.env.VITE_RISHI,
];

async function createForm() {
  const $form = $(`
      <div class="flex flex-col gap-2">
        <div class="flex justify-between flex-col gap-2">
          <span class="font-bold" value="name">Product Name*:</span>
          <input id="name" value="" class="border" placeholder="Heavy cream"/>
        </div>

        <div class="flex justify-between flex-col gap-2">
          <span class="font-bold" value="price">Product Price*:</span>
          <input id="price" value="" class="border" placeholder="5.99"/>
        </div>
        
        <div class="flex justify-between flex-col gap-2">
          <span class="font-bold" value="quantity">Product quantity*:</span>
          <input id="quantity" value="" class="border" placeholder="980"/>
        </div>
        
        <div class="flex justify-between flex-col gap-2">
          <span class="font-bold" value="unit">Product unit*:</span>
          <input id="unit" value="" class="border" placeholder="kg, ml ..." />
        </div>
        
        <div class="flex justify-between flex-col gap-2">
          <span class="font-bold" value="image">Image name*:</span>
          <input id="image" value="" class="border" placeholder="heavy-cream (only file name)" />
        </div>

        <div class="flex justify-between flex-col gap-2">
          <span class="font-bold" value="category">Category*:</span>
          <select id="category-dropdown" class="border">
            <option value=""></option>
          </select>
        </div>
        
        <div class="flex justify-between flex-col gap-2">
          <span class="font-bold" value="brand">(optional) Brand:</span>
          <input id="brand" value="" class="border" placeholder="Horizontal"/>
        </div>

        <div class="flex justify-between flex-col gap-2">
          <span class="font-bold" value="description">Description:</span>
          <textarea id="description" value="" class="border" placeholder="Yum yum"></textarea>
        </div>

        <div class="flex justify-between flex-col gap-2">
          <span class="font-bold" value="name">Stores*:</span>
          <span class="text-xs">Press cmd / ctrl to select multiple when you are on desktop view</span>
          <select id="store-dropdown" class="border h-30" multiple>
            <option value=""></option>
          </select>
        </div>

        <button type="button" class="mt-4 border bg-blue-200 hover:cursor-pointer" id="submit-btn">Create product</button>
      </div>
      `);

  // add cate dropdown
  const categories = await getDocs(collection(db, "categories"));
  categories.forEach((cate) => {
    $form.find("#category-dropdown").append(`
      <option value="${cate.id}">${cate.data().name}</option>
      `);
  });
  // add stores dropdown
  const stores = await getDocs(collection(db, "stores"));
  stores.forEach((store) => {
    $form.find("#store-dropdown").append(`
      <option value="${store.id}">${store.data().name}</option>
      `);
  });
  // add checking function
  $form.on("click", "#submit-btn", addProduct);
  // add create in products, stores, categories

  $("#add-product").append($form);
}

async function addProduct() {
  const isValid = validateForm();
  if (!isValid) {
    showAlert("* are required fields, check again", "error");
    return;
  }

  const name = $("#add-product").find("#name").val();
  const quantity = $("#add-product").find("#quantity").val();
  const unit = $("#add-product").find("#unit").val();
  const image = $("#add-product").find("#image").val();
  const price = $("#add-product").find("#price").val();
  const brand = $("#add-product").find("#brand").val();
  const category = $("#add-product").find("#category-dropdown").val();
  const description = $("#add-product").find("#description").val();
  const stores = $("#add-product").find("#store-dropdown").val();

  // price, quantity must be integer
  try {
    const qtyNum = Number(quantity);
    const priceNum = Number(price);
    if (Number.isNaN(qtyNum) || Number.isNaN(priceNum)) {
      throw error;
    }
  } catch (err) {
    console.log(err);
    showAlert("Price, Quantity must be integer");
    return;
  }

  showLoading();
  try {
    // 1, products collection
    const productsRef = collection(db, "products");
    const newProduct = await addDoc(productsRef, {
      name: name,
      name_lower: name.toLowerCase(),
      quantity: Number(quantity),
      unit: unit,
      price: Number(price),
      brand: brand,
      imageUrl: `./images/${image}.png`,
      category: category,
      description: description,
    });
    const productID = newProduct.id;
    // 2, add product doc in categories collection
    const categoriesRef = doc(
      db,
      "categories",
      category,
      "products",
      productID
    );
    await setDoc(categoriesRef, {
      name: name,
      name_lower: name.toLowerCase(),
      quantity: Number(quantity),
      unit: unit,
      price: Number(price),
      brand: brand,
      imageUrl: `./images/${image}.png`,
      category: category,
      description: description,
    });
    // 3, add product doc in stores collection
    stores.forEach(async (storeID) => {
      const storeRef = doc(db, "stores", storeID, "storeProducts", productID);
      await setDoc(storeRef, {
        name: name,
        name_lower: name.toLowerCase(),
        quantity: Number(quantity),
        unit: unit,
        price: Number(price),
        brand: brand,
        imageUrl: `./images/${image}.png`,
        category: category,
        description: description,
      });
    });
    showAlert("success!", "success");
  } catch (error) {
    console.error(error);
    showAlert("Check console", "error");
  } finally {
    hideLoading();
  }
}

function validateForm() {
  const name = $("#add-product").find("#name").val();
  const quantity = $("#add-product").find("#quantity").val();
  const unit = $("#add-product").find("#unit").val();
  const image = $("#add-product").find("#image").val();
  const price = $("#add-product").find("#price").val();
  const category = $("#add-product").find("#category-dropdown").val();
  const store = $("#add-product").find("#store-dropdown").val();

  return Boolean(
    name && quantity && unit && image && price && category && store
  );
}

onAuthStateChanged(auth, (user) => {
  if (!user || !ADMIN.includes(user.uid)) {
    return;
  }
  createForm();
});
