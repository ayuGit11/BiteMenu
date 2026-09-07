import React, { useContext, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { dataContext } from "../context/UserContext";
import { toast } from "react-toastify";
import FoodForm from "../Component/FoodForm";
import ConfirmModal from "../Component/ConfirmModal";
import { useAuth } from "../context/AuthContext";

import {MdFastfood,MdDashboard,MdRestaurantMenu,MdSearch,MdEdit,MdDelete,MdKeyboardArrowUp} from "react-icons/md";

function ManageFoodMenu() {

    const navigate = useNavigate();
    const { logout } = useAuth();
    const {food,handleDeleteFood,handleAddFood,handleUpdateFood} = useContext(dataContext);

    const [showForm, setShowForm] = useState(false);
    const [editingFood, setEditingFood] = useState(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [pendingFood, setPendingFood] = useState(null);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    async function handleConfirm() {
        try {

            if (confirmAction === "delete") {
                await handleDeleteFood(pendingFood.id);
                toast.success("Food deleted successfully");
            }

            if (confirmAction === "add") {
                await handleAddFood(pendingFood);
                toast.success("Food added successfully");
            }

            if (confirmAction === "edit") {
                await handleUpdateFood(
                    pendingFood.id,
                    pendingFood.data
                );

                toast.success("Food updated successfully");
            }

            setShowForm(false);
            setShowConfirm(false);
            setConfirmAction(null);
            setPendingFood(null);

        } catch (error) {
            console.error("Menu operation failed:", error);

            if (error.status === 401 || error.status === 403) {
                logout();
                toast.error("Your session has expired. Please login again.");
                navigate("/login");
                return;
            } 
            else {
                toast.error("Server is unavailable. Changes were not saved.");
            }
        }
    }

    function askConfirmation(action, foodData) {
        setConfirmAction(action);
        setPendingFood(foodData);
        setShowConfirm(true);
    }

    const categories = ["All",...new Set(food.map(item => item.foodCategory))];

    const filteredFood = food.filter(item => {
        const matchesSearch =item.foodName?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === "All" || item.foodCategory === category;
        return matchesSearch && matchesCategory;
    });

    const vegCount = food.filter(item => item.foodType?.toLowerCase() === "veg").length;
    const nonVegCount = food.filter(item => item.foodType?.toLowerCase() === "non-veg").length;

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* SIDEBAR */}
            <aside className="hidden md:flex w-64 bg-gray-900 text-white flex-col">
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <MdFastfood className="text-4xl text-orange-400" />
                        <span className="text-2xl font-bold">BiteMenu</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">
                        Admin Panel
                    </p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800">
                        <MdDashboard />
                        Dashboard
                    </Link>
                    <Link to="/menu" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-orange-500 text-white font-semibold">
                        <MdRestaurantMenu />
                        Food Menu
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <button onClick={scrollToTop} className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white">
                      <MdKeyboardArrowUp className="text-xl" />
                      Back to Top
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1">
                {/* TOP BAR */}
               <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Food Management</h1>
                        <p className="text-sm text-gray-500">Manage your BiteMenu food items</p>
                    </div>

                    <button onClick={() => { setEditingFood(null);setShowForm(true); }}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-semibold shadow-sm">
                        + Add Food
                    </button>
                </header>

                <div className="p-6">
                    {/* STAT CARDS */}
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
                        <div className="bg-white p-5 rounded-xl shadow-sm border">
                            <p className="text-sm text-gray-500">Total Food Items</p>
                            <h2 className="text-3xl font-bold text-gray-800 mt-2">{food.length}</h2>
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow-sm border">
                            <p className="text-sm text-gray-500">Vegetarian</p>
                            <h2 className="text-3xl font-bold text-green-600 mt-2">{vegCount}</h2>
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow-sm border">
                            <p className="text-sm text-gray-500">Non-Vegetarian</p>
                            <h2 className="text-3xl font-bold text-red-500 mt-2">{nonVegCount}</h2>
                        </div>
                    </div>
                    {/* SEARCH + FILTER */}
                    <div className="bg-white rounded-xl shadow-sm border p-4 mb-5">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                                <input type="text" placeholder="Search food..." value={search}onChange={(e) =>setSearch(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                                />
                            </div>
                            <select value={category} onChange={(e) => setCategory(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                            >
                                {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>
                                ))}
                           </select>
                        </div>
                    </div>
                    {/* FOOD TABLE */}
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="px-6 py-4 border-b">
                            <h2 className="font-bold text-lg text-gray-800">Food Items</h2>
                            <p className="text-sm text-gray-500">{filteredFood.length} items found</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-sm text-gray-500">Food</th>
                                        <th className="text-left px-6 py-4 text-sm text-gray-500">Category</th>
                                        <th className="text-left px-6 py-4 text-sm text-gray-500">Type</th>
                                        <th className="text-left px-6 py-4 text-sm text-gray-500">Price</th>
                                        <th className="text-right px-6 py-4 text-sm text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredFood.map(item => (
                                        <tr key={item.id} className="border-b last:border-none hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <img src={`http://localhost:8080/images/${item.foodImage}`}alt={item.foodName} className="w-14 h-14 rounded-lg object-cover"/>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{item.foodName}</p>
                                                        <p className="text-xs text-gray-400">ID: #{item.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                                                    {item.foodCategory}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm ${
                                                        item.foodType?.toLowerCase() === "veg"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {item.foodType}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 font-semibold">₹{item.price}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => {setEditingFood(item);setShowForm(true);}}
                                                        className="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                                        title="Edit food"
                                                    >
                                                        <MdEdit />
                                                    </button>

                                                    <button onClick={() => askConfirmation("delete",item)}
                                                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                                                        title="Delete food"
                                                    >
                                                        <MdDelete />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* ADD / EDIT FORM */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => {setShowForm(false);setEditingFood(null);}}
                    />
                    <div className="relative z-10 w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto">
                        <FoodForm editingFood={editingFood}
                            closeForm={() => {setShowForm(false);setEditingFood(null);}}
                            onRequestSubmit={(foodData) => {
                                if (editingFood) {
                                    askConfirmation("edit",{id: editingFood.id, data: foodData});
                                } else {
                                    askConfirmation("add",foodData);

                                }
                           }}
                        />
                    </div>
                </div>
            )}

            {/* CONFIRMATION MODAL */}
            {showConfirm && (
                <ConfirmModal
                    title={confirmAction === "delete"? "Delete Food Item?": confirmAction === "edit"? "Save Changes?": "Add Food Item?"}
                   message={
                        confirmAction === "delete"
                            ? "Are you sure you want to delete this food item? This action cannot be undone."
                            : confirmAction === "edit"
                                ? "Are you sure you want to save these changes?"
                                : "Are you sure you want to add this food item to your menu?"
                    }

                    confirmText={
                        confirmAction === "delete"
                            ? "Delete"
                            : confirmAction === "edit"
                                ? "Save Changes"
                                : "Add Food"
                    }

                    danger={confirmAction === "delete"}
                    onConfirm={handleConfirm}
                    onCancel={() => {
                        setShowConfirm(false);
                        setConfirmAction(null);
                        setPendingFood(null);
                    }}

                />

            )}

        </div>
    );
}

export default ManageFoodMenu;