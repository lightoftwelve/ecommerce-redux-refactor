import Auth from "../../utils/auth";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../../redux/slices/userSlice";

function Nav() {
  const dispatch = useDispatch(); // Creating a dispatch function from Redux to dispatch actions

  // Function to handle user logout
  function handleLogout() {
    dispatch(logoutUser()); // Dispatching an action to update the state upon user logout
  }

  // Function to conditionally render navigation links based on user's authentication status
  function showNavigation() {
    if (Auth.loggedIn()) {
      // If user is logged in, show 'Order History' and 'Logout' links
      return (
        <ul className="flex-row">
          <li className="mx-1">
            <Link to="/orderHistory">Order History</Link>
          </li>
          <li className="mx-1">
            <a href="#!" onClick={handleLogout}>
              Logout
            </a>
          </li>
        </ul>
      );
    } else {
      // If user is not logged in, show 'Signup' and 'Login' links
      return (
        <ul className="flex-row">
          <li className="mx-1">
            <Link to="/signup">Signup</Link>
          </li>
          <li className="mx-1">
            <Link to="/login">Login</Link>
          </li>
        </ul>
      );
    }
  }

  // Rendering the main navigation bar
  return (
    <header className="flex-row px-1">
      <h1>
        <Link to="/">
          <span role="img" aria-label="shopping bag">
            🛍️
          </span>
          -Shop-Shop
        </Link>
      </h1>
      <nav>{showNavigation()}</nav>
    </header>
  );
}

export default Nav;
