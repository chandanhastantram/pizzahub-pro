import { configureStore } from "@reduxjs/toolkit";
import userslice from "./features/user/userSlice";
import cartslice from "./features/cart/cartSlice";
const store=configureStore({
    reducer:{
        user:userslice,
        cart:cartslice,
    }
});
export default store;