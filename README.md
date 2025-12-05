# Fridge Friends

## Overview

Fridge Friends is a client-side JavaScript web application that helps users make better product decisions and plan their grocery trips by having aggregated grocery product reviews and a shared shopping list. The app displays product information from popular grocery stores. Users can browse the products and mark their favorite products for easy access later.

---

## Features

- Browse a list grocery products by store
- Add and remove products your favorites list for easy access
- Share your shopping list with another user
- Responsive design for desktop and mobile

---

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend**: Firebase for hosting
- **Database**: Firestore

---

## Usage

1. Open your browser and visit `https://project-fridge-friends.web.app/`.
2. Browse the list of products on the main page, list of stores, or search bar.
3. Click the heart icon to mark a product as a favorite.
4. View your favorite products in the favorites section.
5. Add products to your shopping list using the plus icon on any product.
6. View your current shopping list by clicking on the shopping basket icon in the top right.
7. Remove products from your shopping list by clicking the subtraction icon on the product card.
8. Find your ID in your Profile section, accessed from the Menu.
9. Share your current list by clicking the share list icon and entering the ID of the user you would like to share with.
10. Send the shared link to the user you would like to share with. This will display the original user's current list. Only one list is possible to be shared at a time. The shared with user can subtract, add and remove items from the list, but is cannot add new items to the list. Only the original user can mark the list as complete.
11. Once the shopping trip is finished, you can click 'Mark as Complete' on the shopping list to clear the list.
12. On the profile page, you can view previously cleared lists. The homepage also displays the items cleared on the most recent list.

---

## Project Structure

```
1800_202530_DTC06/
├── src/
│   └── components/
        └── site-footer.js
        └── site-navbar.js
    └── app.js
    └── authentication.js
    └── constant.js
    └── db.js
    └── editProduct.js
    └── favorite.js
    └── firebaseConfig.js
    └── general.js
    └── getProducts.js
    └── help.js
    └── historyList.js
    └── loginSignup.js
    └── main.js
    └── populateReviews.js
    └── product.js
    └── review.js
    └── search.js
    └── share.js
    └── sharedListDisplay.js
    └── shoppingList.js
    └── store.js
├── styles/
│   └── style.css
├── public\images/
├── editProduct.html
├── favorites.html
├── help.html
├── historyList.html
├── index.html
├── login.html
├── main.html
├── product.html
├── profile.html
├── review.html
├── search.html
├── shoppingList.html
├── skeleton.html
├── storeList.html
├── viewSharedList.html
├── tailwind.config.js
├── vite.config.js
├── package.json
├── README.md
```

---

## Contributors

- **Rishi** - BCIT CST Student with a passion for outdoor adventures and user-friendly applications. Fun fact: Loves solving Rubik's Cubes in under a minute.
- **Su**

  - **Main Page & Discovery**: Implemented Top-Rated Product Sorting (based on review averages) to highlight popular items on the main page.

  - **Core List Management**: Developed critical list operations, including Adding Products to the Current List and the mechanism to Transition the Current List to History.

  - **Navigation & Components**: Built the application's navigation systems (Navigation Bar, Toggle Menu, Search Functionality, and Product Detail Pages).

  - **UX Components**: Created reusable components for professional feedback and state management: Component Loading States, Modals, and Stackable Alerts.

  - **Authentication**: Managed the User Logout process.

- **Matthew**

  - **Main Page Featured & Most Recent List**: Implemented Featured Products and Products from User's Most Recent Shopping List on the main page

  - **Shared List**: Built shared list function, including generating a shared list link and the displaying of the shared list on the shared with user's account.

  - **Favorite Products**: Added Favorite Products function and page.

  - **Grocery Store Products**: Created grocery store page that lists each store's products.

---

## Acknowledgments

- Product data and images are for demonstration purposes only.
- Code snippets were adapted from resources such as [Stack Overflow](https://stackoverflow.com/), [MDN Web Docs](https://developer.mozilla.org/) and COMP 1800 course material.
- Icons sourced from [FontAwesome](https://fontawesome.com/) and images from [Unsplash](https://unsplash.com/) and [Google](https://www.google.com/).

---

## Limitations and Future Work

### Limitations

- Product data are placeholders.
- Shared list cannot be added to by the shared with user.
- Accessibility features can be further improved.

### Future Work

- Implement grocery store API with real data
- Add filtering and sorting options (e.g., by category, price).
- Create a dark mode for better usability in low-light conditions.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
