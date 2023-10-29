import { createSlice } from "@reduxjs/toolkit";

export const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    currentCategory: "",
    currentProduct: null,
  },
  reducers: {
    updateProducts: (state, action) => {
      console.log("Updating products:", action.payload);
      state.products = action.payload;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
  },
});

export const { updateProducts, setCurrentProduct } = productsSlice.actions;

export default productsSlice.reducer;
