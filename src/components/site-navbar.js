// Import specific functions from the Firebase Auth SDK
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "/src/firebaseConfig.js";
import { logoutUser } from "/src/authentication.js";
import $ from "jquery";

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
        class="fixed w-full top-0 bg-white border-b border-gray-300"
      >
        <div class="flex py-10 px-2 items-center justify-between md:max-w-4xl m-auto">
          <div class="flex gap-2 relative">
            <button id="menu" class="py-2 hover:cursor-pointer">
              <i class="fa-solid fa-bars fa-2xl"></i>
            </button>
            <div id="menu-content" class="hidden bg-zinc-500 text-white w-50 absolute top-[42px]">
              <a href="" class="block p-3">Grocery Stores</a>
              <a href="" class="block p-3">Products</a>
              <a href="" class="block p-3">Categories</a>
              <a href="" class="block p-3 border-b-2 border-zinc-800">Coupons</a>
              <div id="authControls" class="block p-3 hover:cursor-pointer"></div>
              <a href="" class="block p-3">Profile</a>
              <a href="" class="block p-3">Help</a>
            </div>
            <!-- Placeholder icon --!>
            <div>
              <i class="fa-solid fa-2xl"></i>
            </div>
          </div>
          <a href="/">
            <img class="h-20" src="./images/Fridge_Friends.png" alt="logo" />
          </a>
          <div class="flex gap-2">
            <a href="/search" class="py-2">
              <i class="fa-solid fa-magnifying-glass fa-2xl"></i>
            </a>
            <a href="" class="py-2">
              <i class="fa-solid fa-cart-shopping fa-2xl"></i>
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
      } else {
        updatedAuthControl = `<a href="/login">Login</a>`;
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
