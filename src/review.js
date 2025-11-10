import { db, auth } from "./firebaseConfig.js";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

// -----------------------------------------------------------
// 1️⃣ Get product ID from Local Storage
// 2️⃣ Go to Firestore to get the product name (using this ID)
// 3️⃣ Display in title of the page
// -----------------------------------------------------------

const productDocID = localStorage.getItem("productDocID");
displayProductName(productDocID);

async function displayProductName(id) {
  try {
    const productRef = doc(db, "products", id);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      const productName = productSnap.data().name;
      document.getElementById("productName").textContent = productName;
    } else {
      console.warn("No such product found!");
    }
  } catch (error) {
    console.error("Error getting product document:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  manageStars();
});

let productRating = 0;

function manageStars() {
  const stars = document.querySelectorAll(".star");

  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      // Change star appearance on click
      stars.forEach((s, i) => {
        s.textContent = i <= index ? "star" : "star_outline";
        s.style.color = i <= index ? "#facc15" : "#9ca3af"; // gold or gray
      });

      productRating = index + 1;
      console.log("⭐ Current rating:", productRating);
    });

    // Optional: Hover effect
    star.addEventListener("mouseenter", () => {
      stars.forEach((s, i) => {
        s.textContent = i <= index ? "star" : "star_outline";
        s.style.color = i <= index ? "#fde047" : "#9ca3af";
      });
    });

    star.addEventListener("mouseleave", () => {
      stars.forEach((s, i) => {
        s.textContent = i < productRating ? "star" : "star_outline";
        s.style.color = i < productRating ? "#facc15" : "#9ca3af";
      });
    });
  });
}

async function writeReview() {
  console.log("📝 Inside writeReview");

  // Collect form data
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const store = document.getElementById("store").value;

  // Simple validation
  if (!title || !description) {
    alert("Please complete all required fields.");
    return;
  }

  const user = auth.currentUser;

  if (user) {
    try {
      const userID = user.uid;

      await addDoc(collection(db, "reviews"), {
        productDocID: productDocID,
        userID: userID,
        title: title,
        description: description,
        store: store,
        rating: productRating,
        timestamp: serverTimestamp(),
      });

      console.log("✅ Review successfully written!");

      // Redirect back to product page
      window.location.href = `product.html?id=${productDocID}`;

    } catch (error) {
      console.error("❌ Error adding review:", error);
    }
  } else {
    alert("You must be signed in to submit a review.");
  }
}

//-----------------------------------------------------------
// Event Listeners on page load
//-----------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  manageStars();

  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) {
    submitBtn.addEventListener("click", writeReview);
  }
});