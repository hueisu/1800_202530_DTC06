// This Vite config file (vite.config.js) tells Rollup (production bundler)
// to treat multiple HTML files as entry points so each becomes its own built page.

import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        editProduct: resolve(__dirname, "editProduct.html"),
        favorites: resolve(__dirname, "favorites.html"),
        help: resolve(__dirname, "help.html"),
        "history-list": resolve(__dirname, "history-list.html"),
        index: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "login.html"),
        main: resolve(__dirname, "main.html"),
        product: resolve(__dirname, "product.html"),
        profile: resolve(__dirname, "profile.html"),
        review: resolve(__dirname, "review.html"),
        search: resolve(__dirname, "search.html"),
        shoppinglist: resolve(__dirname, "shoppinglist.html"),
        "store-list": resolve(__dirname, "store-list.html"),
        "view-shared-list": resolve(__dirname, "view-shared-list.html"),
      },
    },
  },
});
