const API_URL = "http://localhost:8080/foods";

//GET stored Basic Auth credentials
const getAuthHeaders = () => { 
    const credentials = sessionStorage.getItem("auth"); 
    if (!credentials) { 
        return {}; 
    } 
    return {
         Authorization: `Basic ${credentials}`, 
    };
 };

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
    const formData = new FormData();

    formData.append("foodName", food.foodName);
    formData.append("price", food.price);
    formData.append("foodType", food.foodType);
    formData.append("foodCategory", food.foodCategory);
    formData.append("foodImage", food.foodImage);

    if (food.selectedImage) {
        formData.append("image", food.selectedImage);
    }
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { ...getAuthHeaders(), },
        body: formData
    });
    if (!response.ok) {
        throw new Error("Failed to add food");
    }
    return await response.json();
}


// UPDATE food
export async function updateFood(id, food) {
    const formData = new FormData();

    formData.append("foodName", food.foodName);
    formData.append("price", food.price);
    formData.append("foodType", food.foodType);
    formData.append("foodCategory", food.foodCategory);

    if (food.selectedImage) {
        formData.append("image", food.selectedImage);
    }
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { ...getAuthHeaders(), },
        body: formData

    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", errorText);
        throw new Error("Failed to update food");
    }
    return await response.json();
}


// DELETE food
export async function deleteFood(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { ...getAuthHeaders(), },
    });
    if (!response.ok) {
        throw new Error("Failed to delete food");
    }
    return await response.text();
}