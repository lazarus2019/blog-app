import { useState } from "react";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone"; // Docs: https://react-dropzone.js.org/#section-basic-example
import styled from "styled-components";

import { Modal } from "react-responsive-modal";

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

function UploadProfilePhoto({ open = false, onClose, onUpdate }) {
  const [file, setFile] = useState(null);

  const handleUpdate = () => {
    if (onUpdate) onUpdate(file);
  };

  return (
    <Modal open={open} center onClose={onClose}>
      <div className="relative p-1 w-full max-w-md h-full md:h-auto">
        <div className="relative bg-white ">
          <div className="py-2 px-2 lg:px-4">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              Update your profile photo
            </h3>
            <form className="space-y-6" action="#">
              <Container className="container bg-gray-700">
                <Dropzone
                  accept={{ "image/*": [".png", ".gif", ".jpeg", ".jpg"] }}
                  onDrop={(acceptedFiles) => {
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
              <aside style={thumbsContainer}>
                {file && (
                  <img
                    src={file.preview}
                    style={img}
                    // Revoke data uri after image is loaded
                    onLoad={() => {
                      URL.revokeObjectURL(file.preview);
                    }}
                  />
                )}
              </aside>

              <button
                onClick={handleUpdate}
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}

UploadProfilePhoto.propTypes = {};

export default UploadProfilePhoto;
