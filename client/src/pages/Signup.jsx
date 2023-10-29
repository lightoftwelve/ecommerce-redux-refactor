import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "../redux/slices/userSlice";

function Signup() {
  // Local component state for handling form inputs
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const dispatch = useDispatch(); // Hook to access the Redux dispatch function

  const { user, status, error } = useSelector((state) => state.user); // Fetch user state from Redux store

  // Function to handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    dispatch(signUpUser(formState)); // Dispatching signUpUser action with formState as payload
  };

  // Function to handle changes in form inputs
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <div className="container my-1">
      <Link to="/login">← Go to Login</Link>
      <h2>Signup</h2>

      {/* Show loading message when the status is loading */}
      {status === "loading" && <p>Loading...</p>}
      {/* Show error message if there is an error */}
      {error && <p>Error: {error}</p>}

      <form onSubmit={handleFormSubmit}>
        <div className="flex-row space-between my-2">
          <label htmlFor="firstName">First Name:</label>
          <input
            placeholder="First"
            name="firstName"
            type="text"
            id="firstName"
            onChange={handleChange}
          />
        </div>
        <div className="flex-row space-between my-2">
          <label htmlFor="lastName">Last Name:</label>
          <input
            placeholder="Last"
            name="lastName"
            type="text"
            id="lastName"
            onChange={handleChange}
          />
        </div>
        <div className="flex-row space-between my-2">
          <label htmlFor="email">Email:</label>
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
        <div className="flex-row flex-end">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
