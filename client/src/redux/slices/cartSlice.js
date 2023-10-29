import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartOpen: false,
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.cart.push(action.payload);
      state.cartOpen = true;
    },
    toggleCart: (state) => {
      state.cartOpen = !state.cartOpen;
    },
    addMultipleToCart: (state, action) => {
      state.cart = [...state.cart, ...action.payload];
    },
    removeFromCart: (state, action) => {
      const index = state.cart.findIndex(
        (product) => product._id === action.payload._id
      );

      if (index !== -1) {
        let newState = [...state.cart];
        newState.splice(index, 1);
        state.cart = newState;

        if (newState.length === 0) {
          state.cartOpen = false;
        }
      }
    },
    updateCartQuantity: (state, action) => {
      const index = state.cart.findIndex(
        (product) => product._id === action.payload._id
      );

      if (index !== -1) {
        let newState = [...state.cart];
        newState[index].purchaseQuantity = action.payload.purchaseQuantity;
        state.cart = newState;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.cartOpen = false;
    },
  },
});

export const {
  addToCart,
  toggleCart,
  addMultipleToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
