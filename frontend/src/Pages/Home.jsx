import React, { useState } from 'react'
import Nav from '../Component/Nav'
import Categories from '../Component/Categories'
import Card from '../Component/Card'
//import { food_items } from '../food'
import { useContext } from 'react'
import { dataContext } from '../context/UserContext'
import { ImCross } from "react-icons/im";
import Card2 from '../Component/Card2'
import { useSelector,useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { ClearCart } from '../redux/cartSlice'
import { clearCart } from "../services/cartService";


function Home() {
  const dispatch = useDispatch();
  let {categories,setCategory,food,input,showCart,setShowCart}=useContext(dataContext)
  

  async function handlePlaceOrder() {
    try{
      await clearCart();
      dispatch(ClearCart());
      setShowCart(false);
      toast.success("Woohoo🥳 Your Order is placed✅");
    }catch(error){
      toast.error("Failed to place order. Please try again.");
    }
  }
  function filter(category){
    
    if(category==="All"){
       setCategory(food)
       
    }else{
       // let list=food_items.filter((item)=>(item.food_category?.toLowerCase() === category?.toLowerCase()))
        const selectedCategory = category.trim().toLowerCase();
        let list = food.filter((item)=>item.foodCategory?.trim().toLowerCase() ===selectedCategory)
        setCategory(list)
    }
  }
  let items=useSelector(state=>state.cart)
  let subTotal = items.reduce((total,item)=>total+item.foodQuantity*item.price,0)
  let delivery=20
  let taxes=subTotal*0.5/100
  let total = subTotal+delivery+taxes
 
  return (
    <div className='bg-pink-200 w-full min-h-screen'>
        <Nav/>
        <div className='flex flex-wrap justify-center items-center gap-15 w-full'>
            {Categories.map((item)=>{
                return <div key={item.id} className='w-40 h-30 bg-white flex flex-col items-center 
                          justify-center rounded-md shadow-xl gap-5 p-5 text-bold hover:bg-red-300 cursor-pointer' onClick={()=>filter(item.name)}>
                         {item.image}
                         {item.name}
                       </div>
            })}
        </div>
        <div className='flex flex-wrap justify-center'>
          { categories.length>0 ?categories.map((item)=>(
                <Card key={item.id} foodName={item.foodName} foodImage={item.foodImage} id={item.id} price={item.price} foodType={item.foodType}/>
            ))
            : <div className='text-gray-500 text-2xl p-10 font-bold'>No Searched Dish Found 🙁</div>
          }
        </div>
        <div className={`w-[40%] h-full bg-white fixed top-0 right-0 shadow-2xl p-5 transition-all duration-500 ${showCart?"translate-x-0":"translate-x-full"} overflow-auto`}>
           <header className='flex justify-between text-pink-400 font-bold'>
               <span className='text-xl'>Order Items</span>
               <ImCross className='text-2xl hover:text-red-500 cursor-pointer' onClick={()=>setShowCart(false)}/>
           </header>
           <div className='flex flex-col gap-2'>
            {items.map((item)=>
              <Card2  key={item.id} foodName={item.foodName} price={item.price} foodImage={item.foodImage} id={item.id} foodQuantity={item.foodQuantity}/>
            )}
           </div>
           {items.length>0?
           <>
             <div className='w-full border-t-2border-b-2 mt-6 border-gray-300 flex flex-col p-3 gap-2'>
                <div className='w-full flex justify-between items-center'>
                    <span className='text-md text-gray-500 font-semibold'>Subtotal</span>
                    <span className='text-pink-500 font-semibold text-md'>Rs.  {Number(subTotal).toFixed(2)}/-</span>
                </div>
                <div className='w-full flex justify-between items-center '>
                    <span className='text-md text-gray-500 font-semibold'>Delivery Fee</span>
                    <span className='text-pink-500 font-semibold text-md'>Rs. {Number(delivery).toFixed(2)}/-</span>
                </div>
                <div className='w-full flex justify-between items-center'>
                    <span className='text-md text-gray-500 font-semibold'>Taxes</span>
                    <span className='text-pink-500 font-semibold text-md'>Rs. {Number(taxes).toFixed(2)}/-</span>
                </div>
              </div>
              <div className='w-full flex justify-between items-center p-3'>
                    <span className='text-lg text-gray-500 font-semibold'>Total</span>
                    <span className='text-pink-500 font-semibold text-lg'>Rs. {Number(total).toFixed(2)}/-</span>
                
              </div>
              <button className='w-full bg-red-300 rounded p-3 font-bold hover:bg-red-500 cursor-pointer'onClick={handlePlaceOrder}>Place Order</button>
            </>:
            <div className='font-semibold text-2xl text-red-500 text-center pt-5'>Empty Cart 🛒</div>
          }
        </div>
    </div>
  )
}

export default Home