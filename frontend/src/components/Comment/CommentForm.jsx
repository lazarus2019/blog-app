import PropTypes from "prop-types";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { createCommentAction } from "@/redux/slices/commentSlice";

const formSchema = yup.object({
  description: yup.string().required("Description is required"),
});

function CommentForm({ postId, userAuth }) {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      description: "",
    },
    onSubmit: (values) => {
      dispatch(createCommentAction({ postId, ...values }));
    },
    validationSchema: formSchema,
  });

  return (
    <div className="flex flex-col justify-center items-center">
      <form
        onSubmit={formik.handleSubmit}
        className="mt-1 flex max-w-sm m-auto"
      >
        <input
          onBlur={formik.handleBlur("description")}
          value={formik.values.description}
          onChange={formik.handleChange("description")}
          type="text"
          name="text"
          id="text"
          className="shadow-sm focus:ring-indigo-500  mr-2 focus:border-indigo-500 block w-full p-2 border-1 sm:text-sm border-gray-300 rounded-md"
          placeholder="Add New comment"
        />

        <button
          type="submit"
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
      <div className="text-red-400 mb-2 mt-2">
        {formik.touched.description && formik.errors.description}
      </div>
    </div>
  );
}

CommentForm.propTypes = {
  postId: PropTypes.string.isRequired,
};

export default CommentForm;
