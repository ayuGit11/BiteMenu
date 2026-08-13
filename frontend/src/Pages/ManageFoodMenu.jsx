import React, { useContext, useState } from "react";
import { dataContext } from "../context/UserContext";
import { toast } from "react-toastify";
import FoodForm from "../Component/FoodForm";

function ManageFoodMenu() {
    const {food,handleDeleteFood} = useContext(dataContext);
    const [showForm, setShowForm] = useState(false);
    const [editingFood, setEditingFood] = useState(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [pendingFood, setPendingFood] = useState(null);

    async function handleDelete(id) {
        try {
            await handleDeleteFood(id);
            toast.success("Food deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("Unable to delete food");
        }
    }

    function handleEdit(item) {
        setEditingFood(item);
        setShowForm(true);
    }

    function handleAdd() {
        setEditingFood(null);
        setShowForm(true);
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
                <button onClick={handleAdd} className="bg-red-400 px-5 py-3 rounded font-bold">+ Add Food </button>
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
                            <button onClick={() => handleEdit(item)} className="bg-yellow-300 px-4 py-2 rounded">Edit </button>
                            <button onClick={() => handleDelete(item.id)} className="bg-red-400 px-4 py-2 rounded"> Delete </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default ManageFoodMenu;