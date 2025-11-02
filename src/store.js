import { collection, getDocs, addDoc } from "firebase/firestore";

// Helper function to add the sample store documents.
function addStoreData() {
  const storesRef = collection(db, "stores");
  console.log("Adding grocery store data");
  addDoc(storesRef, {
    name: "Costco",
  });
  addDoc(storesRef, {
    name: "T&T",
  });
  addDoc(storesRef, {
    name: "Safeway",
  });
  addDoc(storesRef, {
    name: "Save-on-Foods",
  });
  addDoc(storesRef, {
    name: "Superstore",
  });
  addDoc(storesRef, {
    name: "Walmart",
  });
}

async function seedStores() {
  const storesRef = collection(db, "stores");
  const querySnapshot = await getDocs(storesRef);

  // Check if the collection is empty
  if (querySnapshot.empty) {
    console.log("Stores collection is empty. Seeding data...");
    addStoreData();
  } else {
    console.log("Stores collection already contains data. Skipping seed.");
  }
}

// Call the seeding function when the main.html page loads.
seedHikes();
