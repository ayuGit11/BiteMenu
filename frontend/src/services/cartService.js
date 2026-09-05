const API_URL = "http://localhost:8080/cart";


// GET CURRENT USER'S CART
export async function getCart() {

    const response = await fetch(API_URL, {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Failed to fetch cart");
    }

    return response.json();
}


// ADD FOOD TO CART
export async function addToCart(foodId) {

    const response = await fetch(`${API_URL}/${foodId}`, {
        method: "POST",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Failed to add food to cart");
    }

    return response.json();
}


// UPDATE QUANTITY
export async function updateCartQuantity(foodId, quantity) {

    const response = await fetch(
        `${API_URL}/${foodId}?quantity=${quantity}`,
        {
            method: "PUT",
            credentials: "include"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update cart");
    }

    return response.json();
}


// REMOVE FOOD
export async function removeFromCart(foodId) {

    const response = await fetch(`${API_URL}/${foodId}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Failed to remove food");
    }
}


// CLEAR CART
export async function clearCart() {

    const response = await fetch(API_URL, {
        method: "DELETE",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Failed to clear cart");
    }
}