import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { pluralize } from "../../utils/helpers";
import { addToCart, updateCartQuantity } from "../../redux/slices/cartSlice";
import { idbPromise } from "../../utils/helpers";

function ProductItem(item) {
  const { image, name, _id, price, quantity } = item;

  const dispatch = useDispatch(); // Create a dispatch function from Redux to dispatch actions

  const cart = useSelector((state) => state.cart.cart); // Get the current state of the cart from Redux store

  const handleAddToCart = () => {
    // Check if the item is already in the cart
    const itemInCart = cart.find((cartItem) => cartItem._id === _id);
    if (itemInCart) {
      // If the item is in the cart, update its quantity
      dispatch(
        updateCartQuantity({
          _id: _id,
          purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
        })
      );
      // Update the item's quantity in IndexedDB
      idbPromise("cart", "put", {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
    } else {
      dispatch(addToCart({ ...item, purchaseQuantity: 1 })); // If the item is not in the cart, add it to the cart
      idbPromise("cart", "put", { ...item, purchaseQuantity: 1 }); // Add the item to IndexedDB
    }
  };

  return (
    <div className="card px-1 py-1">
      {/* Link to the product's detail page */}
      <Link to={`/products/${_id}`}>
        <img alt={name} src={`/images/${image}`} />
        <p>{name}</p>
      </Link>
      <div>
        <div>
          {quantity} {pluralize("item", quantity)} in stock
        </div>
        <span>${price}</span>
      </div>
      <button onClick={handleAddToCart}>Add to cart</button>
    </div>
  );
}

export default ProductItem;
