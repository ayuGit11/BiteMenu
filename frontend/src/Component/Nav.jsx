import React from 'react'
import { Link } from "react-router-dom";
import { MdFastfood } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { MdRestaurantMenu } from "react-icons/md";
import { useContext } from 'react';
import { dataContext } from '../context/UserContext';
import { useEffect } from 'react';
//import { food_items } from '../food';
import { useSelector } from 'react-redux';

function Nav() {
  let {input,setInput,food,categories,setCategory,showCart,setShowCart}=useContext(dataContext)
  useEffect(()=>{
    let newList=food.filter((item)=>item.foodName?.toLowerCase().includes(input.toLowerCase()))
    setCategory(newList)
  },[input,food])

let items = useSelector(state=>state.cart)
return (
    <div className='w-full h-25 bg-red-300 flex justify-between items-center px-5 mb-5 md:px-8'>
        <div className='w-15 h-15 bg-white flex justify-center items-center rounded-md shadow-xl'>
         <MdFastfood className='w-8 h-8 text-amber-900' />
        </div>
       <form className='w-[60%] h-15 px-5 gap-5 bg-white flex items-center rounded-md shadow-xl' onSubmit={(e)=>e.preventDefault()} >
          <FaSearch className='w-5 h-5'/>
          <input type='text' placeholder='search your food....' className='w-full outline-none text-2xl md:w-[70%]' onChange={(e)=>setInput(e.target.value)} value={input}/>
       </form>
       <div className="flex items-center gap-3">
          <Link to="/menu" className="flex flex-col items-center gap-2 cursor-pointer"> 
              <div className="w-15 h-15 bg-white flex justify-center items-center rounded-md shadow-xl transition">
                <MdRestaurantMenu className="w-8 h-8 text-black-900" />
              </div>
          </Link>
          <div className='w-15 h-15 bg-white flex justify-center items-center rounded-md shadow-xl relative cursor-pointer' onClick={()=>setShowCart(true)}>
            <span className='absolute top-0 right-1 font-bold'>{items.length}</span>
            <FaCartShopping className='w-8 h-8'/>
          </div>
      </div>
    </div>
  )
}

export default Nav