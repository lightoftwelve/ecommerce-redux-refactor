import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { LOGIN } from "../utils/mutations"; // Importing GraphQL mutation for logging in
import Auth from "../utils/auth"; // Utility for handling authentication tokens
import { setUser, setError } from "../redux/slices/userSlice"; // Importing actions from userSlice for dispatching

function Login(props) {
  const [formState, setFormState] = useState({ email: "", password: "" }); // Local state to hold form input data
  const [login] = useMutation(LOGIN); // Apollo Client hook for executing the LOGIN mutation
  const dispatch = useDispatch(); // Getting the dispatch function from Redux hook to dispatch actions
  const error = useSelector((state) => state.user.error); // Selecting the error state from the Redux store

  // Function to handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault(); // Preventing the default form submission behavior
    try {
      // Executing the login mutation with the form data
      const mutationResponse = await login({
        variables: { email: formState.email, password: formState.password },
      });

      // If login is successful, store token and update user state in Redux store
      if (mutationResponse.data.login) {
        const token = mutationResponse.data.login.token;
        Auth.login(token);
        dispatch(setUser({ email: formState.email }));
      } else {
        throw new Error("Login failed");
      }
    } catch (e) {
      // If login fails, set error state in Redux store
      dispatch(setError("The provided credentials are incorrect"));
    }
  };

  // Function to handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <div className="container my-1">
      <Link to="/signup">← Go to Signup</Link>

      <h2>Login</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="flex-row space-between my-2">
          <label htmlFor="email">Email address:</label>
          <input
            placeholder="youremail@test.com"
            name="email"
            type="email"
            id="email"
            onChange={handleChange}
          />
        </div>
        <div className="flex-row space-between my-2">
          <label htmlFor="pwd">Password:</label>
          <input
            placeholder="******"
            name="password"
            type="password"
            id="pwd"
            onChange={handleChange}
          />
        </div>
        {error ? (
          <div>
            <p className="error-text">{error}</p>
          </div>
        ) : null}
        <div className="flex-row flex-end">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
