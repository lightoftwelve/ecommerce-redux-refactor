import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";

import { useQuery } from "@apollo/client"; // Apollo Imports

import Cart from "../components/Cart"; // Component Imports

// Importing actions from cartSlice and productsSlice for dispatching
import {
  addToCart,
  updateCartQuantity,
  removeFromCart,
} from "../redux/slices/cartSlice";
import { updateProducts } from "../redux/slices/productsSlice";

import { QUERY_PRODUCTS } from "../utils/queries"; // Importing GraphQL query to fetch product details
import { idbPromise } from "../utils/helpers"; // Helper function for interacting with IndexedDB
import spinner from "../assets/spinner.gif"; // Loading spinner image

function Detail() {
  const dispatch = useDispatch(); // Getting the dispatch function from the Redux hook to dispatch actions
  const { id } = useParams(); // Getting the product ID from the URL parameters

  // Selecting products and cart state from the Redux store
  const { products } = useSelector((state) => state.products);
  const { cart } = useSelector((state) => state.cart);

  const { loading, data } = useQuery(QUERY_PRODUCTS); // Making a query to fetch products using Apollo Client

  const [currentProduct, setCurrentProduct] = useState(null); // Local state to hold the current product's details

  // useEffect to handle setting the current product when the component mounts or when dependencies change
  useEffect(() => {
    // If products are already in Redux store, find and set the current product
    if (products.length) {
      setCurrentProduct(products.find((product) => product._id === id));
    }
    // If products are fetched from the server, update Redux store and IndexedDB
    else if (data) {
      dispatch(updateProducts(data.products));
      data.products.forEach((product) => {
        idbPromise("products", "put", product);
      });
    }
    // If products are not loaded yet, fetch them from IndexedDB and update Redux store
    else if (!loading) {
      idbPromise("products", "get").then((indexedProducts) => {
        dispatch(updateProducts(indexedProducts));
      });
    }
  }, [products, data, loading, dispatch, id]);

  // Function to handle adding a product to the cart
  const handleAddToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id); // Find if product is already in cart

    // If product is in cart, update quantity
    if (itemInCart) {
      dispatch(
        updateCartQuantity({
          _id: id,
          purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
        })
      );
      idbPromise("cart", "put", {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
    }
    // If product is not in cart, add it
    else {
      const product = products.find((product) => product._id === id);
      dispatch(addToCart({ ...product, purchaseQuantity: 1 }));
      idbPromise("cart", "put", { ...product, purchaseQuantity: 1 });
    }
  };

  // Function to handle removing a product from the cart
  const handleRemoveFromCart = () => {
    dispatch(removeFromCart({ _id: id }));
    idbPromise("cart", "delete", { _id: id });
  };

  return (
    <>
      {currentProduct && cart ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>
          <h2>{currentProduct.name}</h2>
          <p>{currentProduct.description}</p>
          <p>
            <strong>Price:</strong>${currentProduct.price}{" "}
            <button onClick={handleAddToCart}>Add to Cart</button>
            <button
              disabled={!cart.find((p) => p._id === currentProduct._id)}
              onClick={handleRemoveFromCart}
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;
