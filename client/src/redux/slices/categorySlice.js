import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    currentCategory: "",
  },
  reducers: {
    updateCategories: (state, action) => {
      state.categories = action.payload;
    },
    updateCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
  },
});

export const { updateCategories, updateCurrentCategory } =
  categorySlice.actions;
export default categorySlice.reducer;
