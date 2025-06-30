const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ✅ Configuring cloudinary from environment variables
cloudinary.config({
  cloud_name: "dpcy3d46l",
  api_key: "559299431159228",
  api_secret: "UuUIrR9Jj90-2xx8X4LzntasM6Y",
});

// ✅ Define Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wanderlust_DEV", // ✅ Typo fixed: "wanderlast" → "wanderlust"
    allowed_formats: ["png", "jpg", "jpeg"], // ✅ Typo fixed: "allowerdFormats" → "allowed_formats"
  },
});

module.exports = {
  storage,
  cloudinary,
};
