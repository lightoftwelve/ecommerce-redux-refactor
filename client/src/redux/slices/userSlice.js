import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "../../App";
import { ADD_USER } from "../../utils/mutations";
import Auth from "../../utils/auth";

import { QUERY_USER } from "../../utils/queries";

// Define an initial state for the user slice
const initialState = {
  user: null,
  error: null,
  status: "idle", // Add a status field to track the loading state
};

// Async thunk to fetch the user data
export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  console.log("Thunk: fetchUser");
  const response = await client.query({
    query: QUERY_USER,
  });
  return response.data.user;
});

// Async thunk for user signup
export const signUpUser = createAsyncThunk(
  "user/signUpUser",
  async (
    { email, password, firstName, lastName },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const { data } = await client.mutate({
        mutation: ADD_USER,
        variables: { email, password, firstName, lastName },
      });

      const { token, user } = data.addUser;
      Auth.login(token);
      dispatch(setUser(user));

      return user;
    } catch (error) {
      const errorMessage =
        error.networkError?.result?.errors?.[0]?.message ||
        "An unexpected error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { dispatch }) => {
    try {
      Auth.logout();
      dispatch(resetCart());
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  }
);

// Create the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log("Action: setUser", action.payload);
      state.user = action.payload;
      state.error = null;
    },
    setError: (state, action) => {
      console.log("Action: setError", action.payload);
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(signUpUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        resetCart();
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
      });
  },
});

export const { setUser, setError } = userSlice.actions;
export default userSlice.reducer;
