import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
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
