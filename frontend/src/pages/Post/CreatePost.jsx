import CategoryDropDown from "@/components/Category/CategoryDropDown";
import { createPostAction } from "@/redux/slices/postSlice";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import * as yup from "yup";
import Dropzone from "react-dropzone"; // Docs: https://react-dropzone.js.org/#section-basic-example
import styled from "styled-components";

const formSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(2, "Title must at least 2 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(6, "Description must at least 6 characters"),
  category: yup.string().required("Category is required"),
  image: yup.string().required("Thumbnail is required"),
});

//css for dropzone
const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
border-color:'red'
  transition: border 0.24s ease-in-out;
`;

function CreatePost(props) {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      category: "",
      image: "",
    },
    onSubmit: (values) => {
      dispatch(createPostAction(values));
    },
    validationSchema: formSchema,
  });

  const postStore = useSelector((store) => store.post);
  const { isCreated, appErr, serverErr, loading } = postStore;

  // Redirect
  if (isCreated) return <Navigate to="/posts" />;

  return (
    <>
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
            Create Post
          </h2>

          <p className="mt-2 text-center text-sm text-gray-600 font-medium text-green-600 hover:text-indigo-500">
            Share your ideas to the word. Your post must be free from profanity
          </p>
          {/* Display err */}
          {appErr || serverErr ? (
            <div className="text-red-400 text-center text-lg">
              {serverErr} - {appErr}
            </div>
          ) : null}
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
                  {/* Title */}
                  <input
                    value={formik.values.title}
                    onChange={formik.handleChange("title")}
                    onBlur={formik.handleBlur("title")}
                    id="title"
                    name="title"
                    type="title"
                    autoComplete="title"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                {/* Err msg */}
                <div className="text-red-500">
                  {formik.touched.title && formik.errors.title}
                </div>
              </div>
              {/* Category input goes here */}
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Select Category
              </label>
              <CategoryDropDown
                value={formik.values.category}
                onChange={formik.setFieldValue}
                onBlur={formik.setFieldTouched}
                error={formik.errors.category}
                touched={formik.touched.category}
              />
              {/* Thumbnail component */}
              <label
                htmlFor="image"
                className="block text-sm font-medium mt-3 mb-2 text-gray-700"
              >
                Select image to upload
              </label>

              <Container className="container bg-gray-700">
                <Dropzone
                  onBlur={formik.handleBlur("image")}
                  accept={{ "image/*": [".png", ".gif", ".jpeg", ".jpg"] }}
                  onDrop={(acceptedFiles) => {
                    formik.setFieldValue("image", acceptedFiles[0]);
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div className="container">
                      <div
                        {...getRootProps({
                          className: "dropzone",
                          onDrop: (event) => event.stopPropagation(),
                        })}
                      >
                        <input {...getInputProps()} />
                        <p className="text-gray-300 text-lg cursor-pointer hover:text-gray-500">
                          Click here to select image
                        </p>
                      </div>
                    </div>
                  )}
                </Dropzone>
              </Container>
              {/* Err msg */}
              <div className="text-red-500">
                {" "}
                {formik.touched.image && formik.errors.image}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                {/* Description */}
                <textarea
                  value={formik.values.description}
                  onChange={formik.handleChange("description")}
                  onBlur={formik.handleBlur("description")}
                  rows="5"
                  cols="10"
                  className="rounded-lg appearance-none block w-full py-3 px-3 text-base text-center leading-tight text-gray-600 bg-transparent focus:bg-transparent  border border-gray-200 focus:border-gray-500  focus:outline-none"
                  type="text"
                ></textarea>
                {/* Err msg */}
                <div className="text-red-500">
                  {" "}
                  {formik.touched.description && formik.errors.description}
                </div>
              </div>
              <div>
                {/* Submit btn */}
                {loading ? (
                  <button
                    disabled
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 "
                  >
                    Loading...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create
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

export default CreatePost;
