export const getUserFromLocalStorage = () => {
    return localStorage.user ? JSON.parse(localStorage.user) : false;
}