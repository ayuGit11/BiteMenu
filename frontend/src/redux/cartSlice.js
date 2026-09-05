import { createSlice } from "@reduxjs/toolkit";

const cartSlice=createSlice({
    name:"cart",
    initialState:[],
    reducers:{
        AddItem:(state,action)=>{
            let existItem = state.find((item)=>item.id===action.payload.id)
            if (existItem){
                return state.map((item)=>(item.id===action.payload.id?{...item,foodQuantity:item.foodQuantity+1}:item))}
            else{
                state.push(action.payload)
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

export const {AddItem,RemoveItem,IncrementQty,DecrementQty,ClearCart} = cartSlice.actions
export default cartSlice.reducer