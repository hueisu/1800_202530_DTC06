// Import specific functions from the Firebase Auth SDK
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "/src/firebaseConfig.js";
import { logoutUser } from "/src/authentication.js";
import $ from "jquery";
import { ADMIN } from "../constant";

class SiteNavbar extends HTMLElement {
  constructor() {
    super();
    this.renderNavbar();
    this.renderAuthControls();
    this.renderMenu();
  }

  renderNavbar() {
    this.innerHTML = `
      <!-- Navbar: single source of truth -->
      <div style="height: 160px"></div>
      <nav
        class="z-9 fixed w-full top-0 bg-white border-b border-gray-300"
      >
        <div class="flex py-10 px-2 items-center justify-between md:max-w-4xl m-auto">
          <div class="flex gap-2 relative iteams-center">
            <button id="menu" class="py-2 hover:cursor-pointer flex flex-col items-center">
              <i class="fa-solid fa-bars fa-2xl"></i>
              <span class="text-xs mt-3 font-bold">Menu</span>
            </button>
            <div id="menu-content" class="hidden bg-zinc-500 text-white w-50 absolute top-[42px]">
              <a href="storeList.html" class="block p-3">Grocery Stores</a>
              <a href="favorites.html" class="block p-3 border-b-2 border-zinc-800">Favorites</a>
              
              <div id="authControls" class="block p-3 hover:cursor-pointer"></div>
              <a href="profile.html" class="block p-3">Profile</a>
              <a href="help.html" class="block p-3">Help</a>
            </div>
            <!-- Placeholder icon --!>
            <div>
              <i class="fa-solid fa-2xl"></i>
            </div>
          </div>
          <a href="/">
            <img class="h-20" src="./images/Fridge_Friends.png" alt="logo" />
          </a>
          <div class="flex gap-3">
            <a href="search.html" class="py-2 flex flex-col items-center">
              <i class="fa-solid fa-magnifying-glass fa-2xl"></i>
              <span class="text-xs mt-4 font-bold">Search</span>
            </a>
            <a href="shoppingList.html" class="py-2 flex flex-col items-center">
              <i class="fa-solid fa-basket-shopping fa-2xl mr-3"></i>
              <span class="text-xs mt-4 mr-3 font-bold leading-tight text-center">
              Shopping <br /> list </span>
            </a>
          </div>
        </div>
      </nav>
        `;
  }
  renderAuthControls() {
    const authControls = $("#authControls");
    onAuthStateChanged(auth, (user) => {
      let updatedAuthControl;
      if (user) {
        updatedAuthControl = `<button id="signOutBtn" class="hover:cursor-pointer">Log out</button>`;
        authControls.html(updatedAuthControl);
        $("#signOutBtn").on("click", logoutUser);
        // permissions
        if (ADMIN.includes(user.uid)) {
          $("#menu-content").append(
            `<a href="editProduct.html?create=true" class="block p-3 text-gray-800 underline">
              Add product
            </a>`
          );
        }
      } else {
        updatedAuthControl = `<a href="login.html">Login</a>`;
        authControls.html(updatedAuthControl);
      }
    });
  }

  renderMenu() {
    $("#menu").on("click", function () {
      // toggle class of menu icon
      $("#menu").toggleClass("border-b-2 bg-zinc-500");
      // toggle class of menu content visibility
      $("#menu-content").toggleClass("hidden");
    });
  }
}

customElements.define("site-navbar", SiteNavbar);
