import { onAuthReady } from "./authentication.js";
import { db } from "./firebaseConfig.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth } from "./firebaseConfig.js";
import { showAlert } from "./general.js";


function showDashboard() {
  const nameElement = document.getElementById("name-goes-here"); // the <h1> element to display "Hello, {name}"

  // Wait for Firebase to determine the current authentication state.
  // onAuthReady() runs the callback once Firebase finishes checking the signed-in user.
  // The user's name is extracted from the Firebase Authentication object
  // You can "go to console" to check out current users.
  onAuthReady((user) => {
    if (!user) {
      // If no user is signed in → redirect back to login page.
      location.href = "index.html";
      return;
    }

    // If a user is logged in:
    // Use their display name if available, otherwise show their email.
    const name = user.displayName || user.email;

    // Update the welcome message with their name/email.
    if (nameElement) {
      nameElement.textContent = `${name}`;
    }
  });
}

function showEmail() {
  const emailElement = document.getElementById("email-goes-here"); // the <h1> element to display "Hello, {name}"

  // Wait for Firebase to determine the current authentication state.
  // onAuthReady() runs the callback once Firebase finishes checking the signed-in user.
  // The user's name is extracted from the Firebase Authentication object
  // You can "go to console" to check out current users.
  onAuthReady((user) => {
    if (!user) {
      // If no user is signed in → redirect back to login page.
      location.href = "index.html";
      return;
    }

    // If a user is logged in:
    // Use their display name if available, otherwise show their email.
    const email = user.email;

    // Update the welcome message with their name/email.
    if (emailElement) {
      emailElement.textContent = `${email}`;
    }
  });
}

function showUserID() {
  const userElement = document.getElementById("userID-goes-here");

  // Wait for Firebase to determine the current authentication state.
  // onAuthReady() runs the callback once Firebase finishes checking the signed-in user.
  // The user's name is extracted from the Firebase Authentication object
  // You can "go to console" to check out current users.
  onAuthReady((user) => {
    if (!user) {
      // If no user is signed in → redirect back to login page.
      location.href = "index.html";
      return;
    }

    // If a user is logged in:
    // Use their display name if available, otherwise show their email.
    const userID = user.uid;

    // Update the welcome message with their name/email.
    if (userElement) {
      userElement.textContent = `${userID}`;
    }
  });
}

showDashboard();
showEmail();
showUserID();

// ------------------------------------------------------
// NEW: FIRESTORE EDIT FEATURE FOR NAME + EMAIL
// ------------------------------------------------------

const nameSpan = document.getElementById("name-goes-here");


const nameInput = document.getElementById("name-input");


const editBtn = document.getElementById("edit-btn");
const editActions = document.getElementById("edit-actions");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");

let userRef = null;

// Load Firestore user data
onAuthReady(async (user) => {
  if (!user) return;
  userRef = doc(db, "users", user.uid);

  const snap = await getDoc(userRef);
  if (snap.exists()) {
    const data = snap.data();
    nameSpan.textContent = data.name;

  }
});


// ----- EDIT -----
editBtn.addEventListener("click", () => {
  nameInput.value = nameSpan.textContent;


  nameSpan.classList.add("hidden");


  nameInput.classList.remove("hidden");


  editBtn.classList.add("hidden");
  editActions.classList.remove("hidden");
});

// ----- CANCEL -----
cancelBtn.addEventListener("click", () => {
  nameInput.classList.add("hidden");


  nameSpan.classList.remove("hidden");


  editActions.classList.add("hidden");
  editBtn.classList.remove("hidden");
});

// ----- SAVE -----
saveBtn.addEventListener("click", async () => {
  const newName = nameInput.value.trim();


  // Save to Firestore
  await updateDoc(userRef, {
    name: newName,

  });

  // Update UI
  nameSpan.textContent = newName;


  nameInput.classList.add("hidden");


  nameSpan.classList.remove("hidden");


  editActions.classList.add("hidden");
  editBtn.classList.remove("hidden");

  showAlert("Your name has been updated!", "success");

});
