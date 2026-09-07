import React from 'react'
import { IoIosRadioButtonOn } from "react-icons/io";
import { useDispatch } from 'react-redux';
import { AddItem } from '../redux/cartSlice';
import { addToCart } from '../services/cartService';
import { toast } from 'react-toastify';

export default function Card({ foodName, foodImage, id, price, foodType }) {
    const dispatch = useDispatch();
    const handleAddToCart = async () => {
        try {
            // Save/update cart in backend
            const cartItem = await addToCart(id);
            // Update Redux for UI
            dispatch(
                AddItem({
                    id: id,
                    foodName: foodName,
                    foodImage: foodImage,
                    price: price,
                    foodType: foodType,
                    foodQuantity: cartItem.quantity
                })
            );
            toast.success(`${foodName} Added`);
        } catch (error) {
            console.error("Add to cart failed:", error);
            toast.error("Please login to add items to cart");
        }
    };

    return (
        <div className='w-70 h-95 bg-white p-5 m-7 rounded-md shadow-xl flex flex-col gap-3 hover:border-2 border-pink-600'>
            <div className='w-full h-[60%] overflow-hidden rounded-md'>
                <img
                    src={`http://localhost:8080/images/${foodImage}`}
                    alt={`${foodName} not loaded`}
                    className='object-cover'
                />
            </div>
            <div className='text-2xl font-semibold'>{foodName}</div>
            <div className='w-full flex justify-between items-center'>
                <div className='font-bold text-blue-500'>Rs. {Number(price).toFixed(2)}</div>
                <div className={`flex font-semibold gap-1 ${foodType === "veg"? "text-green-500": "text-red-500"}`}>
                    <IoIosRadioButtonOn />
                    <span>{foodType}</span>
                </div>
            </div>
            <button className='w-full bg-red-300 rounded p-3 font-bold hover:bg-red-500 cursor-pointer'onClick={handleAddToCart}>
                Add to Cart
            </button>

        </div>
    )
}