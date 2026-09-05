import { createSlice } from "@reduxjs/toolkit";

const cartSlice=createSlice({
    name:"cart",
    initialState:[],
    reducers:{
        setCart: (state, action) => {
            return action.payload;
        },
        AddItem:(state,action)=>{
            const existItem = state.find(item => item.id === action.payload.id);
            if (existItem) {
               existItem.foodQuantity =action.payload.foodQuantity;
            }else{
              state.push(action.payload);
            }
        },
        RemoveItem:(state,action)=>{
            return state.filter((item)=>item.id!==action.payload.id)
        },
        IncrementQty:(state,action)=>{
            return state.map((item)=>(item.id===action.payload?{...item,foodQuantity:item.foodQuantity+1}:item))
        },
        DecrementQty:(state,action)=>{
            return state.map((item)=>(item.id===action.payload?{...item,foodQuantity:item.foodQuantity-1}:item))
        },
        ClearCart: () => {
            return [];
        }
    }
})

export const {setCart,AddItem,RemoveItem,IncrementQty,DecrementQty,ClearCart} = cartSlice.actions
export default cartSlice.reducer