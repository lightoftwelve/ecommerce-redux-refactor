import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";

// Apollo Imports for making GraphQL queries
import { useLazyQuery } from "@apollo/client";
import { QUERY_CHECKOUT } from "../../utils/queries";
import { idbPromise } from "../../utils/helpers";

// Importing the CartItem component
import CartItem from "../CartItem";
// Importing Auth utilities for user authentication
import Auth from "../../utils/auth";

// Importing Redux actions from cartSlice
import {
  toggleCart,
  addMultipleToCart,
  clearCart,
} from "../../redux/slices/cartSlice";

// Importing CSS for styling
import "./style.css";

// Initializing Stripe for payment processing
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

const Cart = () => {
  // Using useDispatch to dispatch Redux actions
  const dispatch = useDispatch();
  // Using useSelector to access the Redux store's state
  const { cart, cartOpen } = useSelector((state) => state.cart);
  // Using useLazyQuery hook from Apollo for making GraphQL queries
  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

  // useEffect hook to handle the checkout process when the data is available
  useEffect(() => {
    if (data) {
      stripePromise
        .then((res) => {
          // Redirecting to Stripe's checkout page
          return res.redirectToCheckout({ sessionId: data.checkout.session });
        })
        .then(() => {
          // Clearing the cart in the Redux store after a successful checkout
          dispatch(clearCart());
          // Clearing the IndexedDB cart as well
          idbPromise("cart", "clear");
        })
        .catch((err) => {
          // Logging any errors that occur during the checkout process
          console.error("Checkout Error: ", err);
        });
    }
  }, [data, dispatch]);

  // useEffect hook to populate the cart from IndexedDB on component mount
  useEffect(() => {
    async function getCart() {
      // Fetching the cart data from IndexedDB
      const cart = await idbPromise("cart", "get");
      // Dispatching action to add multiple items to the cart in the Redux store
      dispatch(addMultipleToCart(cart));
    }

    // Checking if the cart is empty before fetching from IndexedDB
    if (!cart.length) {
      getCart();
    }
  }, [cart.length, dispatch]);

  // Function to calculate the total price of items in the cart
  function calculateTotal() {
    let sum = 0;
    cart.forEach((item) => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2);
  }

  // Function to initiate the checkout process
  function submitCheckout() {
    const productIds = [];

    // Populating productIds array with the ids of products to be checked out
    cart.forEach((item) => {
      for (let i = 0; i < item.purchaseQuantity; i++) {
        productIds.push(item._id);
      }
    });

    // Making a lazy query to the GraphQL server for checkout
    getCheckout({
      variables: { products: productIds },
    });
  }

  // Rendering the cart when it is closed
  if (!cartOpen) {
    return (
      <div className="cart-closed" onClick={() => dispatch(toggleCart())}>
        <span role="img" aria-label="cart">
          🛒
        </span>
      </div>
    );
  }

  // Rendering the cart when it is open
  return (
    <div className="cart">
      <div className="close" onClick={() => dispatch(toggleCart())}>
        [close]
      </div>
      <h2>Shopping Cart</h2>
      {cart.length ? (
        <div>
          {cart.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}

          <div className="flex-row space-between">
            <strong>Total: ${calculateTotal()}</strong>

            {Auth.loggedIn() ? (
              <button onClick={submitCheckout}>Checkout</button>
            ) : (
              <span>(log in to check out)</span>
            )}
          </div>
        </div>
      ) : (
        <h3>
          <span role="img" aria-label="shocked">
            😱
          </span>
          You havent added anything to your cart yet!
        </h3>
      )}
    </div>
  );
};

export default Cart;
