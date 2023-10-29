import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/client";
import Jumbotron from "../components/Jumbotron";
import { ADD_ORDER } from "../utils/mutations";
import { idbPromise } from "../utils/helpers";
import { clearCart } from "../redux/slices/cartSlice";

function Success() {
  const dispatch = useDispatch();
  const [addOrder] = useMutation(ADD_ORDER); // Using Apollo Client’s useMutation hook to send a mutation to the server.

  // useEffect hook runs when the component mounts to the DOM.
  useEffect(() => {
    // Define an async function to save the order.
    async function saveOrder() {
      const cart = await idbPromise("cart", "get");
      const products = cart.map((item) => item._id);

      // Check if there are products to be ordered.
      if (products.length) {
        // Send the ADD_ORDER mutation to the server with the product IDs.
        const { data } = await addOrder({ variables: { products } });
        const productData = data.addOrder.products;

        // Iterate over the ordered products and delete them from the cart in IndexedDB.
        productData.forEach((item) => {
          idbPromise("cart", "delete", item);
        });

        dispatch(clearCart()); // Dispatch the clearCart action to update the global state
      }

      // Set a timeout to redirect the user to the home page after 3 seconds.
      setTimeout(() => {
        window.location.assign("/");
      }, 3000);
    }

    saveOrder();
  }, [addOrder, dispatch]);

  return (
    // Render a success message using the Jumbotron component.
    <div>
      <Jumbotron>
        <h1>Success!</h1>
        <h2>Thank you for your purchase!</h2>
        <h2>You will now be redirected to the home page</h2>
      </Jumbotron>
    </div>
  );
}

export default Success;
