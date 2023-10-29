import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartQuantity,
} from "../../redux/slices/cartSlice";
import { idbPromise } from "../../utils/helpers";

const CartItem = ({ item }) => {
  const dispatch = useDispatch(); // Using useDispatch to create dispatch function for Redux

  // Function to handle the removal of an item from the cart
  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(item)); // Dispatching the removeFromCart action to update the Redux store
    idbPromise("cart", "delete", { ...item }); // Updating the IndexedDB to reflect the removal of the item
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value); // Parsing the input value to an integer
    dispatch(updateCartQuantity({ _id: item._id, purchaseQuantity: value })); // Dispatching the updateCartQuantity action to update the Redux store
    idbPromise("cart", "put", { ...item, purchaseQuantity: value }); // Updating the IndexedDB to reflect the change in quantity
    if (value === 0) handleRemoveFromCart(); // If the quantity is changed to 0, remove the item from the cart
  };

  // Rendering the CartItem component
  return (
    <div className="flex-row">
      <div>
        <img src={`/images/${item.image}`} alt={item.name} />
      </div>
      <div>
        <div>
          {item.name}, ${item.price}
        </div>
        <div>
          <span>Qty:</span>
          <input
            type="number"
            placeholder="1"
            value={item.purchaseQuantity}
            onChange={handleChange}
          />
          <span role="img" aria-label="trash" onClick={handleRemoveFromCart}>
            🗑️
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
