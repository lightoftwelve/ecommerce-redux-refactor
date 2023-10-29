import { useEffect } from "react";
import { useQuery } from "@apollo/client";

// Import Redux
import { useDispatch, useSelector } from "react-redux";
import {
  updateCategories,
  updateCurrentCategory,
} from "../../redux/slices/categorySlice";

import { QUERY_CATEGORIES } from "../../utils/queries";
import { idbPromise } from "../../utils/helpers";

function CategoryMenu() {
  const dispatch = useDispatch(); // Using useDispatch to create dispatch function for Redux
  const categories = useSelector((state) => state.category.categories); // Using useSelector to access categories from the Redux store
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES); // Using Apollo Client's useQuery hook to fetch categories from the server

  // useEffect hook to handle side effects
  useEffect(() => {
    // If category data is available, update the categories in the Redux store and save them to IndexedDB
    if (categoryData) {
      dispatch(updateCategories(categoryData.categories));
      categoryData.categories.forEach((category) => {
        idbPromise("categories", "put", category);
      });
    }
    // If category data is not loading but not available, fetch categories from IndexedDB and update the Redux store
    else if (!loading) {
      idbPromise("categories", "get").then((categories) => {
        dispatch(updateCategories(categories));
      });
    }
  }, [categoryData, loading, dispatch]);

  // Function to handle category selection
  const handleClick = (id) => {
    dispatch(updateCurrentCategory(id));
  };

  // Rendering the CategoryMenu component
  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
