class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <!-- Footer: single source of truth -->
            <footer class="bg-gray-100 p-5">
                <div class="md:max-w-3xl mx-auto grid md:grid-cols-4 sm:grid-cols-2 gap-5 mt-5 text-sm">
                    <img class="h-15" src="./images/Fridge_Friends.png" alt="logo" />
                    <ul>
                        <li class="font-bold">Available Stores</li>
                        <li class="hover:cursor-pointer">SuperStore</li>
                        <li class="hover:cursor-pointer">Costco</li>
                        <li class="hover:cursor-pointer">No Frills</li>
                        <li class="hover:cursor-pointer">T&T</li>
                        <li class="hover:cursor-pointer">Walmart</li>
                        <li class="hover:cursor-pointer">Save on Foods</li>
                        <li class="hover:cursor-pointer">PriceSmart</li>
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
                                d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c0 -.249 1.51 -2.772 1.818 -4.013z"
                            />
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
