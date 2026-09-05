import React from 'react'
import { Link } from "react-router-dom";
import { MdFastfood } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { MdRestaurantMenu } from "react-icons/md";
import { useContext } from 'react';
import { dataContext } from '../context/UserContext';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from "../context/AuthContext";

function Nav() {
  let {input,setInput,food,categories,setCategory,showCart,setShowCart}=useContext(dataContext);
  let { user, logout } = useAuth();
  useEffect(()=>{
    let newList=food.filter((item)=>item.foodName?.toLowerCase().includes(input.toLowerCase()))
    setCategory(newList)
  },[input,food])

let items = useSelector(state=>state.cart)
return (
    <div className='w-full bg-red-300 px-6 py-4 mb-5 shadow-md'>
      <div className='flex items-center justify-between gap-6'>
        <div className='flex items-center gap-2 shrink-0'>
          <MdFastfood className='text-4xl text-amber-900' />
          <span className='text-2xl font-bold text-amber-900'>BiteMenu</span>
        </div>

       <form className='flex-1 max-w-2xl h-12 px-5 gap-3 bg-white items-center rounded-full shadow-md hidden md:flex' onSubmit={(e)=>e.preventDefault()} >
          <FaSearch className='text-gray-500'/>
          <input type='text' placeholder='search your food....' className='w-full outline-none text-lg' onChange={(e)=>setInput(e.target.value)} value={input}/>
       </form>

       <div className="flex items-center gap-6">
          <Link to="/menu" className="flex items-center gap-2 font-semibold hover:text-amber-900"> 
            <MdRestaurantMenu className="text-2xl" />
            <span>Menu</span>
          </Link>

          <button onClick={() => setShowCart(true)} className='relative flex items-center gap-2 font-semibold hover:text-amber-900'>
            <FaCartShopping className='text-2xl' />
            <span>Cart</span>
            {items.length > 0 && (
              <span className='absolute -top-3 -right-3 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center'>
                {items.length}
              </span>
            )}
          </button>

          {user ? (
            <div className='flex items-center gap-3'>
              <span className='font-bold'> Hi, {user.username} </span>
              <button onClick={logout} className='bg-amber-900 text-white px-4 py-2 rounded-md font-semibold hover:bg-amber-700'>
                Logout
              </button>
            </div>
            ) : (
            <>
              <Link to="/login" className="bg-amber-900 text-white px-5 py-2 rounded-md font-semibold hover:bg-amber-700">Sign in </Link>
            </>
            )}
        </div>
      </div>
    </div>
  )
}

export default Nav