import React, { createContext, useState,useEffect } from 'react'
import {getAllFoods,addFood,updateFood,deleteFood } from "../services/foodService";
//import { food_items } from '../food';
export const dataContext = createContext();
function UserContext({children}) {
    const [food,setFood]=useState([])
    const [categories,setCategory]=useState([])
    const [input,setInput] = useState("")
    const [showCart,setShowCart]=useState(false) 
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
       async function fetchFoods() {
        try {
                const data = await getAllFoods();
                setFood(data);
                setCategory(data);
            } catch (error) {
                console.error("Error fetching food:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchFoods();
    }, []);

     // ADD FOOD
    async function handleAddFood(newFood) {
        const addedFood = await addFood(newFood);
        setFood(prev => [...prev, addedFood]);
        setCategory(prev => [...prev, addedFood]);
        return addedFood;
    }
    // UPDATE FOOD
    async function handleUpdateFood(id, updatedFood) {
        const updated = await updateFood(id, updatedFood);
        setFood(prev =>prev.map(item =>item.id === id ? updated : item ));
        setCategory(prev =>prev.map(item => item.id === id ? updated : item));
        return updated;
    }
    // DELETE FOOD
    async function handleDeleteFood(id) {
        await deleteFood(id);
        setFood(prev =>prev.filter(item => item.id !== id) );
        setCategory(prev =>prev.filter(item => item.id !== id));
    }

    let data={food,setFood,input,setInput,categories,setCategory,showCart,setShowCart, loading,handleAddFood,handleUpdateFood,handleDeleteFood}
    return (
        <div>
            <dataContext.Provider value={data}>
            {children}
            </dataContext.Provider>
        </div>
  )
}

export default UserContext