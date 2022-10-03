import { uploadProfilePhotoAction } from "@/redux/slices/userSlice";
import { UploadIcon } from "@heroicons/react/outline";
import { useFormik } from "formik";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router";
import styled from "styled-components";
import * as yup from "yup";
//Css for dropzone

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
  outline: none;
  transition: border 0.24s ease-in-out;
`;

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
  maxWidth: "400px",
  maxHeight: "400px",
  overflow: "hidden",
};

const img = {
  display: "block",
  width: "100%",
  height: "auto",
  objectFit: "cover",
};

const formSchema = yup.object({
  image: yup.string().required("Image is required"),
});

function UploadProfilePhoto() {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  //formik

  const formik = useFormik({
    initialValues: {
      image: "",
    },
    onSubmit: (values) => {
      dispatch(uploadProfilePhotoAction(values));
    },
    validationSchema: formSchema,
  });

  // store data
  const userStore = useSelector((store) => store?.user);
  const { loading, appErr, serverErr, photoUploaded, userAuth } = userStore;

  if (photoUploaded) return <Navigate to={`/profile/${userAuth?.id}`} />;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
          Upload profile photo
        </h2>
        {/* Displya err here */}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            {/* Image container here thus Dropzone */}
            {appErr || serverErr ? (
              <h2 className="text-center text-red-500">
                {serverErr} {appErr}
              </h2>
            ) : null}
            <Container className="">
              <Dropzone
                onBlur={formik.handleBlur("image")}
                accept="image/jpeg, image/png"
                onDrop={(acceptedFiles) => {
                  formik.setFieldValue("image", acceptedFiles[0]);
                  setFile(
                    Object.assign(acceptedFiles[0], {
                      preview: URL.createObjectURL(acceptedFiles[0]),
                    })
                  );
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

            {file ? (
              <aside style={thumbsContainer}>
                <img
                  src={file.preview}
                  style={img}
                  // Revoke data uri after image is loaded
                  onLoad={() => {
                    URL.revokeObjectURL(file.preview);
                  }}
                />
              </aside>
            ) : (
              <>
                <div className="text-red-500">
                  {formik.touched.image && formik.errors.image}
                </div>
                <p className="text-sm text-gray-500">
                  PNG, JPG, GIF minimum size 400kb uploaded only 1 image
                </p>
              </>
            )}

            <div>
              {loading ? (
                <button
                  disabled
                  type="submit"
                  className="inline-flex justify-center w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-gray hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  <UploadIcon
                    className="-ml-1 mr-2 h-5  text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Loading...</span>
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex justify-center w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  <UploadIcon
                    className="-ml-1 mr-2 h-5  text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Upload Photo</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadProfilePhoto;
