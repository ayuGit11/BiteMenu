const API_URL = "http://localhost:8080/cart";

const getAuthHeaders = () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
        return {};
    }

    return {
        Authorization: `Bearer ${token}`
    };
};
// GET CURRENT USER'S CART
export async function getCart() {

    const response = await fetch(API_URL, {
        method: "GET",
        credentials: "include",
        headers: {
            ...getAuthHeaders()
        }
    });

    if (!response.ok) {
        const error = new Error("Failed to fetch cart");
        error.status = response.status;
        throw error;
    }

    return response.json();
}


// ADD FOOD TO CART
export async function addToCart(foodId) {

    const response = await fetch(`${API_URL}/${foodId}`, {
        method: "POST",
        credentials: "include",
        headers: {
            ...getAuthHeaders()
        }
    });

    if (!response.ok) {
        const error = new Error("Failed to add food to cart");
        error.status = response.status;
        throw error;
    }

    return response.json();
}


// UPDATE QUANTITY
export async function updateCartQuantity(foodId, quantity) {

    const response = await fetch(
        `${API_URL}/${foodId}?quantity=${quantity}`,
        {
            method: "PUT",
            credentials: "include",
            headers: {
                ...getAuthHeaders()
            }
        }
    );

    if (!response.ok) {
        const error = new Error("Failed to update cart");
        error.status = response.status;
        throw error;
    }

    return response.json();
}


// REMOVE FOOD
export async function removeFromCart(foodId) {

    const response = await fetch(`${API_URL}/${foodId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            ...getAuthHeaders()
        }
    });

    if (!response.ok) {
        const error = new Error("Failed to remove food");
        error.status = response.status;
        throw error;
    }
}


// CLEAR CART
export async function clearCart() {

    const response = await fetch(API_URL, {
        method: "DELETE",
        credentials: "include",
        headers: {
            ...getAuthHeaders()
        }
    });

    if (!response.ok) {
        const error = new Error("Failed to clear cart");
        error.status = response.status;
        throw error;
    }
}