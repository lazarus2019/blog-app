const multer = require("multer");
const sharp = require("sharp"); // Resizing image package
const path = require("path");
const fs = require("fs");
// Docs: https://nodejs.org/api/fs.html#fs_fs_unlink_path_callback

// Storage
const multerStorage = multer.memoryStorage();

// File type checking
const multerFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    // Rejected files
    cb(
      {
        message: "Unsupported file format",
      },
      false
    );
  }
};

const photoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 }, // 1MB
});

// Image Resizing and save file to storage
const profilePhotoResize = async (req, res, next) => {
  // Check if there is no file
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/profile/${req.file.filename}`));

  next();
};

// Only use this if save profile photo to storage path: '/public/images/profile'
const removeFileByPath = async (path) => {
  try {
    await fs.unlinkSync(path);
    console.log("Delete old file successfully");
  } catch (error) {
    throw new Error("Can not delete the old file uploaded");
  }
};

//// Other ways: resizing image without save and return buffer
const profilePhotoResizeWithoutSaveToStorage = async (req, res, next) => {
  // Check if there is no file
  if (!req.file) return next();
  const buffer = await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toBuffer();

  req.file.bufferResizing = buffer;

  next();
};

// Image Resizing and save file to storage
const postImgResize = async (req, res, next) => {
  // Check if there is no file
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/posts/${req.file.filename}`));

  next();
};

module.exports = {
  photoUpload,
  profilePhotoResize,
  removeFileByPath,
  profilePhotoResizeWithoutSaveToStorage,
  postImgResize,
};
