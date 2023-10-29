import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Importing the fetchUser thunk for asynchronous actions
import { fetchUser } from "../redux/slices/userSlice";

function OrderHistory() {
  const dispatch = useDispatch(); // Hook to access the Redux dispatch function

  // Selecting user, status, and error from the user state in the Redux store
  const user = useSelector((state) => state.user.user);
  const status = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);

  // Using useEffect to dispatch fetchUser action when the component mounts
  useEffect(() => {
    // Only fetch user if the status is 'idle'
    if (status === "idle") {
      dispatch(fetchUser());
    }
  }, [status, dispatch]);

  // If there is no user, inform the user to log in
  if (!user) {
    return (
      <div className="container my-1">
        <Link to="/">← Back to Products</Link>
        <h2>You need to be logged in to view this page.</h2>
      </div>
    );
  }

  // Loading and error states
  if (status === "loading") {
    return <div>Loading...</div>;
  } else if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  // If user is logged in, display their order history
  return (
    <>
      <div className="container my-1">
        <Link to="/">← Back to Products</Link>

        {user ? (
          <>
            <h2>
              Order History for {user.firstName} {user.lastName}
            </h2>
            {user.orders.map((order) => (
              <div key={order._id} className="my-2">
                <h3>
                  {new Date(parseInt(order.purchaseDate)).toLocaleDateString()}
                </h3>
                <div className="flex-row">
                  {order.products.map(({ _id, image, name, price }, index) => (
                    <div key={index} className="card px-1 py-1">
                      <Link to={`/products/${_id}`}>
                        <img alt={name} src={`/images/${image}`} />
                        <p>{name}</p>
                      </Link>
                      <div>
                        <span>${price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : null}
      </div>
    </>
  );
}

export default OrderHistory;
