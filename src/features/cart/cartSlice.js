import { createSlice } from "@reduxjs/toolkit";
const initialstate={cart:[]};
const cartslice=createSlice({
    name:"cart",
    initialState:initialstate,
    reducers:{
        additem(state,action){state.cart.push(action.payload)},
        removeitem(state,action){state.cart=state.cart.filter((item)=>item.pizzaId!==action.payload)},
        clearcart(state,action){state.cart=[]},
        increaseitemquantity(state,action){const item=state.cart.find((item)=>item.pizzaId===action.payload);item.quantity++;item.totalPrice=item.quantity*item.unitPrice},
        decreaseitemquantity(state,action){const item=state.cart.find((item)=>item.pizzaId===action.payload);item.quantity--;item.totalPrice=item.quantity*item.unitPrice;if(item.quantity===0)cartslice.caseReducers.removeitem(state,action)},
    }
});
export const {additem,removeitem,clearcart,increaseitemquantity,decreaseitemquantity}=cartslice.actions;
export default cartslice.reducer;
export const gettotalcartquantity=(state)=>state.cart.cart.reduce((sum,item)=>sum+item.quantity,0);
export const gettotalcartprice=(state)=>state.cart.cart.reduce((sum,item)=>sum+item.totalPrice,0);
export const getcount=id=>state=>state.cart.cart.find(item=>item.pizzaId===id)?.quantity??0;