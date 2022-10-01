import { fetchAllCategoryAction } from "@/redux/slices/categorySlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

function CategoryDropDown(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllCategoryAction());
  }, [dispatch]);

  const categoryStore = useSelector((store) => store?.category);
  const { categoryList, loading } = categoryStore;

  const allCategory = categoryList?.map((category) => ({
    label: category?.title,
    value: category?._id,
  }));

  const handleChange = (value) => {
    props.onChange("category", value);
  };

  const handleBlur = (value) => {
    props.onBlur("category", value);
  };

  return (
    <div style={{ margin: "1rem 0" }}>
      {loading ? (
        <h3 className="text-base text-green-500">
          Product categories list are loading...
        </h3>
      ) : (
        <Select
          options={allCategory}
          onChange={handleChange}
          onBlur={handleBlur}
          id="category"
          value={props?.value?.label}
        />
      )}
      {/* Display error */}
      {props?.error && (
        <div style={{ color: "red", marginTop: "0.5rem" }}>{props?.error}</div>
      )}
    </div>
  );
}

CategoryDropDown.propTypes = {};

export default CategoryDropDown;
