import React from 'react'
import image1 from '../assets/image1.avif'
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import { DecrementQty, IncrementQty, RemoveItem } from '../redux/cartSlice';
import { toast } from 'react-toastify';
function Card2({foodName,price,id,foodImage,foodQuantity}) {
    let dispatch = useDispatch()
  return (
    <div className='w-full h-35 shadow-lg mt-5 flex justify-between p-5'>
       <div className='w-[70%] h-full flex gap-6'>
            <div className='w-[40%] h-full overflow-hidden rounded-lg'>
                <img src={`http://localhost:8080/images/${foodImage}`} alt="image not loaded..." className='object-cover'/>
            </div>
            <div className='w-[60%] h-full flex flex-col gap-4 p-2'>
                <div className='text-md font-semibold text-pink-500'>
                    {foodName}
                </div>
                <div className='w-27.5 h-9 flex rounded-xl  bg-slate-400 shadow-lg border-2 border-pink-300 overflow-hidden '>
                    <button className='w-[30%] h-full bg-white flex justify-center items-center text-pink-500 cursor-pointer' onClick={()=>foodQuantity>1?dispatch(DecrementQty(id)):1}>-</button>
                    <span className='w-[40%] h-full bg-slate-200 flex justify-center items-center text-pink-500 ' >{foodQuantity}</span>
                    <button className='w-[30%] h-full bg-white flex justify-center items-center text-pink-500 cursor-pointer' onClick={()=>dispatch(IncrementQty(id))}>+</button>
                </div>
            </div>
        </div>
        <div className='flex flex-col gap-6'>
            <span className='text-xl font-semibold text-pink-400'>Rs. {price}/-</span>
                    <RiDeleteBin6Fill className='text-red-500 text-2xl cursor-pointer' onClick={()=>{dispatch(RemoveItem({id:id}));toast.success(()=>`${foodName} Removed`)}}/>
        </div>
      
    </div>
  )
}

export default Card2