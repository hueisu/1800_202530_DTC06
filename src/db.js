import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import { hideLoading, showAlert, showLoading } from "./general";

export async function addProductToCurrentList(product, productId) {
  // get current user id
  const userID = auth.currentUser?.uid;

  // redirect to login if no user
  if (!userID) {
    window.location.href = "/login.html";
    return;
  }

  showLoading();
  // get current list
  try {
    const queryRef = doc(db, "users", userID, "currentList", productId);
    const querySnapshot = await getDoc(queryRef);

    const productInCurrentList = querySnapshot.data();
    if (!productInCurrentList) {
      // add to current list
      console.log("product is not in current list");
      await setDoc(queryRef, {
        productId: productId,
        imageUrl: product.imageUrl,
        name: product.name,
        price: product.price,
        count: 1,
        sharedWith: [userID],
      });
    } else {
      // update to current list
      console.log("product is in current list");
      await updateDoc(queryRef, {
        count: productInCurrentList.count + 1,
      });
    }
    showAlert("Product is added to your list", "warning");
  } catch (error) {
    showAlert("Something went wrong...", "warning");
    console.log(error);
  } finally {
    hideLoading();
  }
}

export async function toggleFavorite(docID) {
  // get current user id
  const userID = auth.currentUser?.uid;

  // redirect to login if no user
  if (!userID) {
    window.location.href = "/login.html";
    return;
  }

  const userRef = doc(db, "users", userID);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data() || {};
  const favorites = userData.favorites || []; // default to empty array

  const iconId = "save-" + docID;
  const icon = document.getElementById(iconId);

  // JS function ".includes" will return true if an item is found in the array
  const currentlyFavorited = favorites.includes(docID);
  let newFavoritedState;
  try {
    if (currentlyFavorited) {
      // Remove from Firestore array
      await updateDoc(userRef, { favorites: arrayRemove(docID) });
      icon.classList.add("fa-regular");
      icon.classList.remove("fa-solid");
      newFavoritedState = false;
    } else {
      // Add to Firestore array
      await updateDoc(userRef, { favorites: arrayUnion(docID) });
      icon.classList.add("fa-solid");
      icon.classList.remove("fa-regular");
      newFavoritedState = true;
    }
    return newFavoritedState;
  } catch (err) {
    console.error("Error toggling favorites:", err);
  }
}

export async function addReviewToProduct(productID, score) {
  try {
    const productRef = doc(db, "products", productID);
    const previousProduct = await getDoc(productRef);
    const previousScores = previousProduct.data().totalScores || 0;
    const previousReviewQuantity =
      previousProduct.data().totalReviewQuantity || 0;
    const newAverageRating =
      (previousScores + score) / (previousReviewQuantity + 1);
    await updateDoc(productRef, {
      totalScores: increment(score),
      totalReviewQuantity: increment(1),
      averageRating: newAverageRating,
    });
  } catch (error) {
    console.error("add review to product failed", error);
  }
}
