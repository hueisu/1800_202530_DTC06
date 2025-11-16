import { getAuth, onAuthStateChanged } from "firebase/auth";
import { hideLoading, showAlert, showLoading, showModal } from "./general";
import { auth, db } from "./firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  setDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";

export async function shareListWithUser(userID, sharedUserID) {
  if (!userID || !sharedUserID) {
    showAlert("Error: User or shared user ID is invalid");
    return;
  }
  try {
    const listRef = collection(db, "users", userID, "currentList");
    const querySnapshot = await getDocs(listRef);

    const sharedList = [];
    querySnapshot.forEach((productDoc) => {
      const productID = productDoc.id;
      const productRef = doc(db, "users", userID, "currentList", productID);
      const updatePromise = updateDoc(productRef, {
        sharedWith: arrayUnion(sharedUserID),
      });
      sharedList.push(updatePromise);
      console.log(111);
    });
    await Promise.all(sharedList);
    await shareNotification(userID, sharedUserID);
    const shareLink = generateShareableLink(userID);
    showAlert(`List successfully shared! Share this link: ${shareLink}`);
  } catch (error) {
    console.error("Error sharing list:", error);
    showAlert("An error occurred while sharing the list.");
  }
}

async function shareNotification(ownerID, recipientID) {
  const shareNotificationReference = doc(
    db,
    "users",
    recipientID,
    "sharedWithMe",
    ownerID
  );
  await setDoc(shareNotificationReference, {
    listOwnerID: ownerID,
    readOnly: false,
    sharedDate: serverTimestamp(),
  });
  console.log(232);
}

function generateShareableLink(ownerID) {
  const baseURL = "http://localhost:5173/view-shared-list.html";
  return `${baseURL}?owner=${ownerID}`;
}
