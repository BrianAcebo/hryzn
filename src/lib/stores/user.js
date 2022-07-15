import { writable } from "svelte/store";
import { browser } from "$app/env";


// Store user profile info in local storage
export const user = writable(browser && localStorage.user ? JSON.parse(localStorage.user) : false);


// On store change, update the local storage
if (browser) {
    user.subscribe((value) => localStorage.user = JSON.stringify(value))
}