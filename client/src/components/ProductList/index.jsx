import { useEffect } from "react";

// Redux Imports
import { useSelector, useDispatch } from "react-redux";
import { updateProducts } from "../../redux/slices/productsSlice";

// Apollo Imports
import { useQuery } from "@apollo/client";
import { QUERY_PRODUCTS } from "../../utils/queries";
import { idbPromise } from "../../utils/helpers";

// Component & Asset Imports
import ProductItem from "../ProductItem";
import spinner from "../../assets/spinner.gif";

function ProductList() {
  const dispatch = useDispatch(); // Setting up the dispatch function to send actions to the Redux store

  // Extracting the current category and products from the Redux store
  const { currentCategory } = useSelector((state) => state.category);
  const { products } = useSelector((state) => state.products);

  // Fetching product data based on the current category using Apollo Client
  const { loading, data } = useQuery(QUERY_PRODUCTS, {
    variables: { category: currentCategory },
  });

  useEffect(() => {
    // If data is available, update the products in the Redux store and save to IndexedDB
    if (data) {
      dispatch(updateProducts(data.products));
      data.products.forEach((product) => {
        idbPromise("products", "put", product);
      });
      // If loading is false and no data is available, retrieve products from IndexedDB
    } else if (!loading) {
      idbPromise("products", "get").then((products) => {
        dispatch(updateProducts(products));
      });
    }
  }, [data, loading, dispatch]);

  // Filter products based on the current category
  function filterProducts() {
    if (!currentCategory) {
      return products;
    }
    return products.filter(
      (product) => product.category._id === currentCategory
    );
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              {...product} // Simplified prop passing using the spread operator
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
