//--------------------------------------------------------------
// If you have custom global styles, import them as well:
//--------------------------------------------------------------
import { onAuthReady } from "./authentication.js";
import "/src/styles/style.css";

//--------------------------------------------------------------
// Custom global JS code (shared with all pages)can go here.
//--------------------------------------------------------------

function redirectUser() {
  // If user is logged in, redirect to main page with their customized products
  const isOnIndexPage = window.location.pathname == "/";
  onAuthReady((user) => {
    if (user && isOnIndexPage) {
      location.href = "main";
    }
  });
}

redirectUser();
