import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import $ from "jquery";

export const ADMIN = [
  import.meta.env.VITE_SU,
  import.meta.env.VITE_MATTHEW,
  import.meta.env.VITE_RISHI,
];

async function createForm() {
  $("#add-product").append(`
    <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <label value="name">Product Name:</label>
          <input id="name" value="" class="border" />
        </div>

        <div class="flex items-center justify-between">
          <label value="category">Category:</label>
          <select id="category-dropdown" value="" class="border"></select>
        </div>

        <div class="flex items-center justify-between">
          <label value="quantity">Product quantity:</label>
          <input id="quantity" value="" class="border" />
        </div>

        <div class="flex items-center justify-between">
          <label value="unit">Product unit:</label>
          <input id="unit" value="" class="border" placeholder="kg, ml ..." />
        </div>

        <div class="flex items-center justify-between">
          <label value="brand">(optional) Brand:</label>
          <input id="brand" value="" class="border" />
        </div>

        <div class="flex items-center justify-between">
          <label value="description">Description:</label>
          <textarea id="description" value="" class="border"></textarea>
        </div>

        <div class="flex items-center justify-between">
          <label value="image">Image name:</label>
          <input id="image" value="" class="border" placeholder="" />
        </div>

        <div class="flex items-center justify-between">
          <label value="name">Stores:</label>
          <select id="store-dropdown" value="" class="border"></select>
        </div>
      </div>

      <button class="border bg-blue-200" id="submit">Create product</button>
  `);
}

onAuthStateChanged(auth, (user) => {
  if (!user || !ADMIN.includes(user.uid)) {
    return;
  }
  createForm();
});
