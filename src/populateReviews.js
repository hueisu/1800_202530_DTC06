import { db } from "./firebaseConfig.js";
import { collection, query, where, getDocs } from "firebase/firestore";

async function populateReviews() {
  const reviewCardTemplate = document.getElementById("reviewCardTemplate");
  const reviewCardGroup = document.getElementById("reviewCardGroup");
  const detailsGoHere = document.getElementById("details-go-here");

  // Clear previous content (in case)
  reviewCardGroup.innerHTML = "";
  detailsGoHere.textContent = "";

  // Read product ID from URL: ?id=abc123
  const params = new URL(window.location.href);
  const productID = params.searchParams.get("id");
  if (!productID) {
    detailsGoHere.textContent = "No product ID in URL. Reviews can't be loaded.";
    console.warn("No product ID found in URL.");
    return;
  }

  try {
    // Query reviews where productDocID == productID
    const q = query(collection(db, "reviews"), where("productDocID", "==", productID));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      detailsGoHere.textContent = "No reviews yet. Be the first to write one!";
      return;
    }

    // For each review doc, clone template and populate fields
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();

      const title = data.title || "(No title)";
      const description = data.description || "";
      const rating = data.rating ?? 0;

      // Clone template
      const reviewCard = reviewCardTemplate.content.cloneNode(true);
      reviewCard.querySelector(".title").textContent = title;
      reviewCard.querySelector(".description").textContent = description;

      // Build star HTML using Material Icons
      let starHTML = "";
      for (let i = 0; i < rating; i++) {
        starHTML += '<span class="material-icons text-yellow-500">star</span>';
      }
      for (let i = rating; i < 5; i++) {
        starHTML += '<span class="material-icons text-gray-300">star_outline</span>';
      }
      reviewCard.querySelector(".star-rating").innerHTML = starHTML;

      // Append to container
      reviewCardGroup.appendChild(reviewCard);
    });
  } catch (err) {
    console.error("Error loading reviews:", err);
    detailsGoHere.textContent = "Error loading reviews. See console for details.";
  }
}

// Run after DOM is ready so template elements are available
document.addEventListener("DOMContentLoaded", populateReviews);

export { populateReviews };
