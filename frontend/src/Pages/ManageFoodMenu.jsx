import React, { useContext, useState } from "react";
import { dataContext } from "../context/UserContext";
import { toast } from "react-toastify";
import FoodForm from "../Component/FoodForm";
import ConfirmModal from "../Component/ConfirmModal";

function ManageFoodMenu() {
    const {food,handleDeleteFood,handleAddFood,handleUpdateFood} = useContext(dataContext);
    const [showForm, setShowForm] = useState(false);
    const [editingFood, setEditingFood] = useState(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [pendingFood, setPendingFood] = useState(null);

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
            console.error(error);
            toast.error("Something went wrong");
        }
    }

    function askConfirmation(action, foodData) {
        setConfirmAction(action);
        setPendingFood(foodData);
        setShowConfirm(true);
    } 
    
    return (
        <div className="min-h-screen bg-pink-100 p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Food Dashboard </h1>
                <button onClick={() => {setEditingFood(null);setShowForm(true);}} className="bg-green-400 px-5 py-3 rounded font-bold">+ Add Food </button>
            </div>
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                       onClick={() => {
                        setShowForm(false);
                        setEditingFood(null);
                     }}
                ></div>
                 <div className="relative z-10 w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto">
                    <FoodForm
                        editingFood={editingFood}
                        closeForm={() => {
                            setShowForm(false);
                            setEditingFood(null);
                        }}
                        onRequestSubmit={(foodData) => { 
                            if (editingFood) {
                             askConfirmation("edit", {id: editingFood.id,data: foodData });
                            } else {
                              askConfirmation("add", foodData);
                            }
                        }}
                    />
                 </div>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {food.map(item => (
                    <div key={item.id} className="bg-white p-5 rounded shadow">
                     <img src={`http://localhost:8080/images/${item.foodImage}`} alt={`${item.foodName} not loaded`} className="w-full h-40 object-cover rounded" />
                        <h2 className="text-xl font-bold mt-3"> {item.foodName}</h2>
                        <p>Rs. {item.price}</p>
                        <p>{item.foodCategory}</p>
                        <div className="flex gap-3 mt-4">
                            <button  onClick={() => {setEditingFood(item);setShowForm(true);}} className="bg-yellow-500 text-white px-4 py-2 rounded">Edit </button>
                            <button  onClick={() => askConfirmation("delete", item)} className="bg-red-500 text-white px-4 py-2 rounded"> Delete </button>
                        </div>
                    </div>
                ))}
            </div>
            {showConfirm && (
               <ConfirmModal
                 title={
                    confirmAction === "delete" ? "Delete Food Item?": confirmAction === "edit"? "Save Changes?": "Add Food Item?"
                 }

                 message={
                  confirmAction === "delete"
                   ? "Are you sure you want to delete this food item? This action cannot be undone." : confirmAction === "edit"
                   ? "Are you sure you want to save these changes?" : "Are you sure you want to add this food item to your menu?"
                 }

                 confirmText={
                  confirmAction === "delete" ? "Delete" : confirmAction === "edit" ? "Save Changes" : "Add Food"
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