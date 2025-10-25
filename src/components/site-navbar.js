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
      <div style="height: 92px"></div>
      <nav
        class="d-flex p-3 fixed-top bg-white justify-content-between align-items-center"
      >
        <a href="" class="text-black">
          <i class="fa-solid fa-bars fa-2xl"></i>
        </a>
        <a class="navbar-brand" href="#">
          <img src="./images/Fridge_Friends.png" height="60" />
        </a>
        <div class="d-flex gap-2">
          <a href="" class="text-black">
            <i class="fa-solid fa-magnifying-glass fa-2xl"></i>
          </a>
          <a href="" class="text-black">
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
