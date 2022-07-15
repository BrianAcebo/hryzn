import { writable } from "svelte/store";
import { browser } from "$app/env";


// Store user info in browser cookie
export const authenticated = writable(browser && localStorage.auth ? JSON.parse(localStorage.auth) == 'SIGNED_IN' : false);


// On store change, update the browser cookie
if (browser) {
    authenticated.subscribe((value) => localStorage.auth = JSON.stringify(value))
}
