import CategoryDropDown from "@/components/Category/CategoryDropDown";
import usePostPermission from "@/hooks/usePostPermission";
import { fetchOnePostAction, updatePostAction } from "@/redux/slices/postSlice";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import * as yup from "yup";

const formSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  category: yup.object().required("Category is required"),
});

function EditPost(props) {
  const dispatch = useDispatch();
  const { id } = useParams();

  // Fetch post by id
  useEffect(() => {
    dispatch(fetchOnePostAction(id));
  }, [id, dispatch]);

  const postStore = useSelector((store) => store?.post);
  const { post, loading, appErr, serverErr, isEdited } = postStore;

  let isPermission = false;
  if (post) {
    isPermission = usePostPermission({ userId: post?.user?._id });
  }

  if (!isPermission) return <Navigate to="/posts" />;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: post?.title || "",
      description: post?.description || "",
      category: "",
    },
    onSubmit: (values) => {
      const data = {
        id,
        params: { ...values, category: values?.category?.label },
      };
      dispatch(updatePostAction(data));
    },
    validationSchema: formSchema,
  });

  if (isEdited) return <Navigate to="/posts" />;

  return (
    <>
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
            Are you sure you want to edit{" "}
            <span className="text-green-300">{post?.title}</span>
            {/* Display err */}
            {appErr || serverErr ? (
              <div className="text-red-400 text-center text-lg">
                {serverErr} - {appErr}
              </div>
            ) : null}
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <div className="mt-1">
                  <input
                    id="title"
                    name="title"
                    type="title"
                    autoComplete="title"
                    value={formik.values.title}
                    onBlur={formik.handleBlur("title")}
                    onChange={formik.handleChange("title")}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="text-red-500">
                  {formik.touched.title && formik.errors.title}
                </div>
              </div>

              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Select Category
              </label>
              <CategoryDropDown
                value={formik.values.category?.categoryTitle}
                onChange={formik.setFieldValue}
                onBlur={formik.setFieldTouched}
                error={formik.errors.category}
                touched={formik.touched.category}
              />
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  rows="5"
                  cols="10"
                  value={formik.values.description}
                  onBlur={formik.handleBlur("description")}
                  onChange={formik.handleChange("description")}
                  className="rounded-lg appearance-none block w-full py-3 px-3 text-base text-center leading-tight text-gray-600 bg-transparent focus:bg-transparent  border border-gray-200 focus:border-gray-500  focus:outline-none"
                  type="text"
                ></textarea>
                <div className="text-red-500">
                  {formik.touched.description && formik.errors.description}
                </div>
              </div>

              <div>
                {loading ? (
                  <button
                    disabled
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600"
                  >
                    Loading...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Update
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditPost;
