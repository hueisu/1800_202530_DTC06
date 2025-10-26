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
              <a href="/login" class="block p-3">Login</a>
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
            <a href="" class="py-2">
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
    // const authControls = this.querySelector("#authControls");
    // // Initialize with invisible placeholder to maintain layout space
    // authControls.innerHTML = `<div class="btn btn-outline-light" style="visibility: hidden; min-width: 80px;">Log out</div>`;
    // onAuthStateChanged(auth, (user) => {
    //   let updatedAuthControl;
    //   if (user) {
    //     updatedAuthControl = `<button class="btn btn-outline-light" id="signOutBtn" type="button" style="min-width: 80px;">Log out</button>`;
    //     authControls.innerHTML = updatedAuthControl;
    //     const signOutBtn = authControls.querySelector("#signOutBtn");
    //     signOutBtn?.addEventListener("click", logoutUser);
    //   } else {
    //     updatedAuthControl = `<a class="btn btn-outline-light" id="loginBtn" href="/login.html" style="min-width: 80px;">Log in</a>`;
    //     authControls.innerHTML = updatedAuthControl;
    //   }
    // });
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
