import { writable } from "svelte/store";
import { browser } from "$app/env";


// Store onboarding complete info in browser cookie
export const onboardingComplete = writable(browser && (localStorage.getItem('onboardingComplete') || false));


// On store change, update the browser cookie
onboardingComplete.subscribe((val) => browser && (localStorage.onboardingComplete = val));

