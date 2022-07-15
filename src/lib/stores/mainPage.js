import { writable } from "svelte/store";
import { browser } from "$app/env";


// Store main page info in local storage for the chevron in topnav
export const mainPage = writable(browser && localStorage.mainPage ? JSON.parse(localStorage.mainPage) : {isMainPage: false, mainPage: ''})


// On store change, update the local storage
if (browser) {
    mainPage.subscribe((value) => localStorage.mainPage = JSON.stringify(value))
}