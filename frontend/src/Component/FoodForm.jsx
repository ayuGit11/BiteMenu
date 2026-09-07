import React, { useContext, useState } from "react";
import { dataContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { IoAttach } from "react-icons/io5";

function FoodForm({ editingFood, closeForm, onRequestSubmit }) {

    const {handleAddFood,handleUpdateFood} = useContext(dataContext);

    const [foodName, setFoodName] = useState(editingFood?.foodName || "");
    const [foodImage, setFoodImage] = useState(editingFood?.foodImage || "");
    const [price, setPrice] = useState(editingFood?.price || "");
    const [foodType, setFoodType] = useState(editingFood?.foodType || "veg");
    const [foodCategory, setFoodCategory] =useState(editingFood?.foodCategory || "");

    const [selectedImage, setSelectedImage] = useState(null);

    function handleSubmit(e) {
        e.preventDefault();
        const foodData = {foodName: foodName,
        foodImage: foodImage,
        price: Number(price),
        foodType: foodType,
        foodCategory: foodCategory,
        selectedImage: selectedImage};
        onRequestSubmit(foodData);
    }
    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold mb-5"> {editingFood ? "Edit Food": "Add Food"}</h2>
                    <p className="text-gray-500 text-sm"> {editingFood? "Update the details of this food item": "Add a new item to your menu"} </p>
                </div>
                <button type="button" onClick={closeForm} className="text-gray-400 hover:text-red-500 text-2xl"> ✕ </button>
            </div>
            <label className="block font-semibold mb-1">Food Name</label>
            <input className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-red-300" placeholder="Food Name" value={foodName} onChange={(e) => setFoodName(e.target.value)} required/>
            <label className="block font-semibold mb-1">Image URL</label>
            <div className="relative w-full mb-4">
                <input className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-red-300" 
                    placeholder="Image URL" value={selectedImage ? selectedImage.name : foodImage} 
                    onChange={(e) => setFoodImage(e.target.value)} required={!selectedImage}/>
                <label htmlFor="imageFile"
                    className="absolute right-2 top-3 cursor-pointer text-gray-500 hover:text-blue-500"
                        title="Attach Image">
                    <IoAttach className="text-2xl" />
                </label>
                <input id="imageFile" type="file" accept="image/*" className="hidden" onChange={(e) => {const file = e.target.files[0];if (file) {setSelectedImage(file);setFoodImage(file.name);}}}/>
            </div>
            <label className="block font-semibold mb-1">Price</label>
            <input className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-red-300" type="number" step="0.01" min="0" placeholder="Price" value={price} onChange={(e) =>setPrice(e.target.value)} required/>
            <label className="block font-semibold mb-1">Category</label>
            <select className={`border border-gray-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-red-300 `} 
             value={foodCategory} onChange={(e) => setFoodCategory(e.target.value)} required >
                <option value="" disabled> Select Category </option>
                <option value="breakfast"> Breakfast </option>
                <option value="soups"> Soups </option>
                <option value="pasta"> Pasta </option>
                <option value="main_course"> Main Course </option>
                <option value="pizza"> Pizza </option>
                <option value="burger"> Burger </option>
            </select>
            <label className="block font-semibold mb-1">Food Type</label>
            <select className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-red-300" value={foodType} onChange={(e) => setFoodType(e.target.value)}>
                <option value="veg"> Veg </option>
                <option value="non-veg"> Non-Veg </option>
            </select>
            <div className="flex gap-3">
                <button type="submit" className="bg-green-400 px-5 py-3 rounded font-bold">
                    {editingFood? "Update Food": "Add Food"}
                </button>
                <button type="button" onClick={closeForm} className="bg-gray-300 px-5 py-3 rounded">
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default FoodForm;