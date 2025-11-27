import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import $, { error } from "jquery";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  addedValueInArray,
  hideLoading,
  removedValueInArray,
  showAlert,
  showLoading,
} from "./general";
import { ADMIN } from "./constant";

async function createForm() {
  const $form = $(defaultForm);
  $form.append(`
        <button type="button" class="mt-4 border bg-blue-200 hover:cursor-pointer" id="create-btn">Create product</button>
    `);
  showLoading();
  try {
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
    $form.on("click", "#create-btn", submitCreateProduct);
    // add create in products, stores, categories

    $("#product-container").append($form);
  } catch (error) {
    showAlert("Something went wrong...", "error");
    console.error(error);
  } finally {
    hideLoading();
  }
}

async function submitCreateProduct() {
  const isValid = validateForm();
  if (!isValid) {
    showAlert("* are required fields, check again", "error");
    return;
  }

  const name = $("#name").val();
  const quantity = $("#quantity").val();
  const unit = $("#unit").val();
  const imageUrl = $("#imageUrl").val();
  const price = $("#price").val();
  const brand = $("#brand").val();
  const category = $("#category-dropdown").val();
  const description = $("#description").val();
  const stores = $("#store-dropdown")
    .val()
    .filter((x) => x);
  const featured = $("#featured").prop("checked");

  const productDetail = {
    name,
    price,
    quantity,
    unit,
    imageUrl,
    category,
    brand,
    description,
    stores,
    featured,
  };

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
    const productID = await addToProducts(productDetail);
    // 2, add product doc in categories collection
    if (category) {
      await addToCategories(productID, productDetail);
    }
    // 3, add product doc in stores collection
    await addToStores(stores, productID, productDetail);
    showAlert("success!", "success");
    window.location.href = `/product?id=${productID}`;
  } catch (error) {
    console.error(error);
    showAlert("Check console", "error");
  } finally {
    hideLoading();
  }
}

async function editForm(productID) {
  const $form = $(defaultForm);
  $form.append(`
        <button type="button" class="mt-4 border bg-blue-200 hover:cursor-pointer" id="save-btn">Save product</button>
    `);
  showLoading();
  try {
    // Product: get product info
    const productDoc = await getDoc(doc(db, "products", productID));
    const product = productDoc.data();

    // Set product values
    $form.find("#name").val(product.name);
    $form.find("#quantity").val(product.quantity);
    $form.find("#unit").val(product.unit);
    $form.find("#imageUrl").val(product.imageUrl);
    $form.find("#price").val(product.price);
    $form.find("#brand").val(product.brand);
    $form.find("#description").val(product.description);
    $form.find("#featured").prop("checked", product.featured);

    // Category: add cate dropdown with its value
    const categories = await getDocs(collection(db, "categories"));
    categories.forEach((cate) => {
      $form.find("#category-dropdown").append(`
      <option value="${cate.id}">${cate.data().name}</option>
      `);
    });
    // Category: set cate value
    $form.find("#category-dropdown").val(product.category);

    // Stores: add stores dropdown with its value
    const stores = await getDocs(collection(db, "stores"));
    stores.forEach((store) => {
      $form.find("#store-dropdown").append(`
      <option value="${store.id}">${store.data().name}</option>
      `);
    });
    // Stores: set stores value
    $form.find("#store-dropdown").val(product.stores);

    $form.on("click", "#save-btn", () =>
      submitUpdateProduct(productID, product)
    );

    $("#product-container").append($form);
  } catch (error) {
    showAlert("Something went wrong...", "error");
    console.error(error);
  } finally {
    hideLoading();
  }
}

async function submitUpdateProduct(productID, originalProductData) {
  const isValid = validateForm();
  if (!isValid) {
    showAlert("* are required fields, check again", "error");
    return;
  }

  const name = $("#name").val();
  const price = $("#price").val();
  const quantity = $("#quantity").val();
  const unit = $("#unit").val();
  const imageUrl = $("#imageUrl").val();
  const category = $("#category-dropdown").val();
  const brand = $("#brand").val();
  const description = $("#description").val();
  const stores = $("#store-dropdown")
    .val()
    .filter((x) => x);
  const featured = $("#featured").prop("checked");

  const productDetail = {
    name,
    price,
    quantity,
    unit,
    imageUrl,
    category,
    brand,
    description,
    stores,
    featured,
  };

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
    await updateProduct(productID, productDetail);
    // 2, add product doc in categories collection
    if (originalProductData.category !== category) {
      // 2-1 add to new category
      if (category) {
        await addToCategories(productID, productDetail);
      }

      // 2-2 remove from old category
      if (originalProductData.category) {
        await removeFromCategories(productID, originalProductData.category);
      }
    }
    // 3, add product doc in stores collection
    // 3-1, remove from old stores
    const oldStores = removedValueInArray(
      originalProductData?.stores || [],
      stores
    );
    oldStores.length > 0 && (await removeFromStores(oldStores, productID));
    // 3-2, add to new stores
    const newStores = addedValueInArray(
      originalProductData.stores || [],
      stores
    );
    newStores.length > 0 &&
      (await addToStores(newStores, productID, productDetail));
    showAlert("success!", "success");
    window.location.href = `/product?id=${productID}`;
  } catch (error) {
    console.error(error);
    showAlert("Check console", "error");
  } finally {
    hideLoading();
  }
}

function validateForm() {
  const name = $("#name").val();
  const quantity = $("#quantity").val();
  const unit = $("#unit").val();
  const imageUrl = $("#imageUrl").val();
  const price = $("#price").val();
  const store = $("#store-dropdown").val();

  return Boolean(name && quantity && unit && imageUrl && price && store);
}

async function addToProducts(productDetail) {
  const {
    name,
    price,
    quantity,
    unit,
    imageUrl,
    category,
    brand,
    description,
    stores,
    featured,
  } = productDetail;
  const productsRef = collection(db, "products");
  const newProduct = await addDoc(productsRef, {
    name: name,
    featured: featured,
    nameLower: name.toLowerCase(),
    quantity: Number(quantity),
    unit: unit,
    price: Number(price),
    brand: brand,
    imageUrl: imageUrl,
    category: category,
    description: description,
    stores: stores,
  });
  return newProduct.id;
}

async function updateProduct(productID, productDetail) {
  const productsRef = doc(db, "products", productID);
  const {
    name,
    price,
    quantity,
    unit,
    imageUrl,
    category,
    brand,
    description,
    stores,
    featured,
  } = productDetail;
  await updateDoc(productsRef, {
    name: name,
    nameLower: name.toLowerCase(),
    quantity: Number(quantity),
    unit: unit,
    price: Number(price),
    brand: brand,
    imageUrl: imageUrl,
    category: category,
    description: description,
    stores: stores,
    featured: featured,
  });
}

async function addToCategories(productID, productDetail) {
  const {
    name,
    price,
    quantity,
    unit,
    imageUrl,
    category,
    brand,
    description,
  } = productDetail;
  const newCategoriesRef = doc(
    db,
    "categories",
    category,
    "products",
    productID
  );
  await setDoc(newCategoriesRef, {
    name: name,
    nameLower: name.toLowerCase(),
    quantity: Number(quantity),
    unit: unit,
    price: Number(price),
    brand: brand,
    imageUrl: imageUrl,
    category: category,
    description: description,
  });
}

async function removeFromCategories(productID, categoryID) {
  const oldCategoriesRef = doc(
    db,
    "categories",
    categoryID,
    "products",
    productID
  );
  await deleteDoc(oldCategoriesRef);
}

async function addToStores(newStoreIDs, productID, productDetail) {
  const {
    name,
    price,
    quantity,
    unit,
    imageUrl,
    category,
    brand,
    description,
    stores,
  } = productDetail;
  await Promise.all(
    newStoreIDs.map(async (newStoreID) => {
      if (!newStoreID) return;
      const storeRef = doc(
        db,
        "stores",
        newStoreID,
        "storeProducts",
        productID
      );
      await setDoc(storeRef, {
        name: name,
        nameLower: name.toLowerCase(),
        quantity: Number(quantity),
        unit: unit,
        price: Number(price),
        brand: brand,
        imageUrl: imageUrl,
        category: category,
        description: description,
      });
    })
  );
}

async function removeFromStores(oldStoreIDs, productID) {
  await Promise.all(
    oldStoreIDs.map(async (oldStoreID) => {
      if (!oldStoreID) return;
      const storeRef = doc(
        db,
        "stores",
        oldStoreID,
        "storeProducts",
        productID
      );
      await deleteDoc(storeRef);
    })
  );
}

document.addEventListener("DOMContentLoaded", async () => {
  onAuthStateChanged(auth, (user) => {
    if (!user || !ADMIN.includes(user.uid)) {
      return;
    }
    const productID = new URL(window.location.href).searchParams.get("id");
    const editMode = productID ? true : false;

    if (editMode) {
      editForm(productID);
    } else {
      createForm();
    }
  });
});

const defaultForm = `
      <div class="flex flex-col gap-2">
        <div class="flex justify-between flex-col gap-2">
          <span class="font-bold" value="name">Product Name<span class="text-red-500">*</span>:</span>
          <input id="name" value="" class="border p-1" placeholder="Heavy cream"/>
        </div>

        <div class="flex justify-between flex-col gap-2">
          <span class="font-bold" value="name">Featured:</span>
          <input id="featured" class="border p-1 scale-200" type="checkbox" />
        </div>

        <div class="flex justify-between flex-col gap-2">
          <span class="font-bold" value="price">Product Price<span class="text-red-500">*</span>:</span>
          <input id="price" value="" class="border p-1" placeholder="5.99"/>
        </div>
        
        <div class="flex justify-between flex-col gap-2">
          <span class="font-bold" value="quantity">Product quantity<span class="text-red-500">*</span>:</span>
          <input id="quantity" value="" class="border p-1" placeholder="980"/>
        </div>
        
        <div class="flex justify-between flex-col gap-2">
          <span class="font-bold" value="unit">Product unit<span class="text-red-500">*</span>:</span>
          <input id="unit" value="" class="border p-1" placeholder="kg, ml ..." />
        </div>
        
        <div class="flex justify-between flex-col gap-2">
          <span class="font-bold" value="imageUrl">Image url<span class="text-red-500">*</span>:</span>
          <input id="imageUrl" value="" class="border p-1" placeholder="./images/costco-chicken.png" />
        </div>

        <div class="flex justify-between flex-col gap-2">
          <span class="font-bold" value="category">Category: (optional)</span>
          <select id="category-dropdown" class="border p-1">
            <option value=""></option>
          </select>
        </div>

        <div class="flex justify-between flex-col gap-2">
          <span class="font-bold" value="name">Stores<span class="text-red-500">*</span>:</span>
          <span class="text-xs">Press cmd / ctrl to select multiple when you are on desktop view</span>
          <select id="store-dropdown" class="border h-30" multiple>
            <option value=""></option>
          </select>
        </div>
               
        <div class="flex justify-between flex-col gap-2">
          <span class="font-bold" value="brand">Brand:</span>
          <input id="brand" value="" class="border p-1" placeholder="Horizontal"/>
        </div>

        <div class="flex justify-between flex-col gap-2">
          <span class="font-bold" value="description">Description:</span>
          <textarea id="description" value="" class="border p-1" placeholder="Yum yum"></textarea>
        </div>
      </div>
      `;
