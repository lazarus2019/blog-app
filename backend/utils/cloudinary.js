const cloudinary = require("cloudinary").v2; // Must using v2
const streamifier = require("streamifier");

const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

const cloudinaryUploadImg = async (fileToUpload) => {
  cloudinaryConfig();

  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto",
    });
    return {
      url: data?.secure_url,
    };
  } catch (error) {
    throw new Error(error.toString());
  }
};

// Other way: Upload file to cloudinary without save it on storage by sharp
const uploadFromBuffer = (fileBuffer) => {
  cloudinaryConfig();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({}, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

const cloudinaryUploadWithoutSaveToStorage = async (fileUpload) => {
  try {
    // Convert Buffer to IMAGE and upload
    const result = await uploadFromBuffer(fileUpload.bufferResizing);
    return { url: result?.secure_url };
  } catch (error) {
    throw new Error(error.toString());
  }
};

module.exports = { cloudinaryUploadImg, cloudinaryUploadWithoutSaveToStorage };
