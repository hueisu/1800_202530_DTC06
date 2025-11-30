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
    });
    await Promise.all(sharedList);
    await shareNotification(userID, sharedUserID);
    const shareLink = generateShareableLink(userID);
    displayShareLinkModal(shareLink);
    showAlert("List successfully shared!");
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
}

function generateShareableLink(ownerID) {
  const baseURL = "http://localhost:5173/view-shared-list.html";
  return `${baseURL}?owner=${ownerID}`;
}

function displayShareLinkModal(link) {
  const linkModal = document.getElementById("link-display-modal");
  linkModal.innerHTML = `
        <h3 class="text-lg font-bold mb-4">Share this link and send it to whoever:</h3>
        <input
          type="text"
          value="${link}"
          class="border p-2 w-full mb-4"
        />
        <div class="flex justify-end">
          <button
            id="close-link-modal"
            type="button"
            class="p-2 border rounded hover:cursor-pointer"
          >
            Close
          </button>
        </div>
    `;
  linkModal.showModal();
  const cancelLinkModal = document.getElementById("close-link-modal");
  cancelLinkModal.addEventListener("click", () => {
    linkModal.close();
  });
}
