import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import $ from "jquery";
import { collection, getDocs } from "firebase/firestore";

export const ADMIN = [
  import.meta.env.VITE_SU,
  import.meta.env.VITE_MATTHEW,
  import.meta.env.VITE_RISHI,
];

async function createForm() {
  const $form = $(`
    <div class="flex flex-col gap-2">
        <div class="flex justify-between flex-col gap-2">
          <span class="font-bold" value="name">Product Name:</span>
          <input id="name" value="" class="border" placeholder="Heavy cream"/>
        </div>

        <div class="flex justify-between flex-col gap-2">
          <span class="font-bold" value="category">Category:</span>
          <select id="category-dropdown" value="" class="border"></select>
        </div>

        <div class="flex justify-between flex-col gap-2">
          <span class="font-bold" value="quantity">Product quantity:</span>
          <input id="quantity" value="" class="border" placeholder="980"/>
        </div>

        <div class="flex justify-between flex-col gap-2">
          <span class="font-bold" value="unit">Product unit:</span>
          <input id="unit" value="" class="border" placeholder="kg, ml ..." />
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
          <span class="font-bold" value="image">Image name:</span>
          <input id="image" value="" class="border" placeholder="heavy-cream (only file name)" />
        </div>

        <div class="flex justify-between flex-col gap-2">
          <span class="font-bold" value="name">Stores:</span>
          <select id="store-dropdown" value="" class="border" multiple></select>
        </div>
      </div>

      <button class="border bg-blue-200" id="submit">Create product</button>
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
  // add create in products, stores, categories

  $("#add-product").append($form);
}

onAuthStateChanged(auth, (user) => {
  if (!user || !ADMIN.includes(user.uid)) {
    return;
  }
  createForm();
});
