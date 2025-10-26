// Import specific functions from the Firebase Auth SDK
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "/src/firebaseConfig.js";
import { logoutUser } from "/src/authentication.js";

class SiteNavbar extends HTMLElement {
  constructor() {
    super();
    this.renderNavbar();
    this.renderAuthControls();
  }

  renderNavbar() {
    this.innerHTML = `
      <!-- Navbar: single source of truth -->
      <div style="height: 160px"></div>
      <nav
        class="flex fixed top-0 bg-white py-10 px-2 items-center justify-between w-full md:max-w-4xl"
      >
        <div class="flex gap-2">
          <div>
            <i class="fa-solid fa-bars fa-2xl"></i>
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
          <a href="" class="">
            <i class="fa-solid fa-magnifying-glass fa-2xl"></i>
          </a>
          <a href="" class="">
            <i class="fa-solid fa-cart-shopping fa-2xl"></i>
          </a>
        </div>
      </nav>
        `;
  }
  renderAuthControls() {
    // TODO: add logout feature
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
}

customElements.define("site-navbar", SiteNavbar);
