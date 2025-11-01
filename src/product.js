import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

async function displayProductsCards() {
  const productsRef = collection(db, "products");

  try {
    const querySnapshot = await getDocs(productsRef);
    querySnapshot.forEach((doc) => {
      const product = doc.data();
      console.log(product);
    });
  } catch (error) {
    console.error(error);
  }
}

async function seedProducts() {
  const productsRef = collection(db, "products");
  try {
    const querySnapshot = await getDocs(productsRef);

    // Check if the collection is empty
    if (querySnapshot.empty) {
      console.log("Products collection is empty. Seeding data...");
      // TODO: add data function
    }
  } catch (error) {
    console.error(error);
  }
}

seedProducts();
displayProductsCards();
