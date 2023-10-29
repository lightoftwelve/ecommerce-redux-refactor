import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import categoryReducer from "./slices/categorySlice";
import productsReducer from "./slices/productsSlice";
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    category: categoryReducer,
    products: productsReducer,
    user: userReducer,
  },
});

export default store;
