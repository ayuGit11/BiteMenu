const API_URL = "http://localhost:8080/foods";

// GET all food
export async function getAllFoods() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error("Failed to fetch foods");
    }
    return await response.json();
}

// ADD food
export async function addFood(food) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(food)
    });
    if (!response.ok) {
        throw new Error("Failed to add food");
    }
    return await response.json();
}


// UPDATE food
export async function updateFood(id, food) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(food)
    });
    if (!response.ok) {
        throw new Error("Failed to update food");
    }
    return await response.json();
}


// DELETE food
export async function deleteFood(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });
    if (!response.ok) {
        throw new Error("Failed to delete food");
    }
    return await response.text();
}