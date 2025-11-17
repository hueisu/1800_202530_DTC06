class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <!-- Footer: single source of truth -->
            <footer class="bg-gray-100 p-5">
                <div class="md:max-w-3xl mx-auto grid md:grid-cols-4 sm:grid-cols-2 gap-5 mt-5 text-sm">
                    <img class="h-15" src="./images/Fridge_Friends.png" alt="logo" />
                    <ul>
                        <li class="font-bold">Available Stores</li>
                        <li><a href="/store-list.html?id=superstore" class="hover:cursor-pointer hover:underline">SuperStore</a></li>
                        <li><a href="/store-list.html?id=costco" class="hover:cursor-pointer hover:underline">Costco</li>
                        
                        <li><a href="/store-list.html?id=t&t" class="hover:cursor-pointer hover:underline">T&T
                        </li>
                        <li><a href="/store-list.html?id=walmart" class="hover:cursor-pointer hover:underline">Walmart</li>
                        <li><a href="/store-list.html?id=save-on" class="hover:cursor-pointer hover:underline">Save on Foods</li>
                        <li><a href="/store-list.html?id=safeway" class="hover:cursor-pointer hover:underline">SafeWay</li>
                    </ul>

                    <ul>
                        <li class="font-bold">Quick Links</li>
                        <li class="hover:cursor-pointer">Top Rated Items</li>
                        <li class="hover:cursor-pointer">Products</li>
                        <li class="hover:cursor-pointer">Favorites</li>
                    </ul>

                    <div class="flex flex-col space-y-1">
                        <p class="font-bold">Contact Us</p>
                        <p>999-999-6662</p>
                        <p class="hover:cursor-pointer">thisisfake@yahoo.ca</p>
                        <div class="flex mt-2 space-x-4">
                            <svg
                            class="hover:cursor-pointer"
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#000000"
                            stroke-width="1"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            >
                            <path
                                d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"
                            />
                            </svg>
                            <svg 
                            class="hover:cursor-pointer mt-1"
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#000000"
                            stroke-width="1"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            >
                            <path d="M17.2705 22.464 1.5 1.53589h5.22951L22.5 22.464h-5.2295Z" />
                            <path d="m21.7578 1.53589 -8.313 8.91461" />
                            <path d="m2.24207 22.464 8.30673 -8.9078" />
                            </svg>
                            <svg
                            class="hover:cursor-pointer"
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#000000"
                            stroke-width="1"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            >
                            <path
                                d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z"
                            />
                            <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                            <path d="M16.5 7.5l0 .01" />
                            </svg>
                        </div>
                    </div>
                </div>
                <hr class="md:max-w-4xl mx-auto mt-8 bg-gray-300" />
                <p class="mt-5 text-center text-sm">&copy BCIT COMP-1800 DTC 06</p>
            </footer>
        `;
  }
}

customElements.define("site-footer", SiteFooter);
