  
  const multer = require('multer')
  const cloudinary = require("cloudinary").v2;
  const {CloudinaryStorage}  = require('multer-storage-cloudinary')
  require("dotenv").config();


  
 // Debugging Cloudinary configuration
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARYNAME,
    api_key: process.env.CLOUDINARYAPIKEY,
    api_secret: process.env.CLOUDINARYAPISECRET,
  });

  console.log("Cloudinary configured successfully");
} catch (err) {
  console.error("Cloudinary configuration error:", err);
}

// Configure Multer storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'uploads', // Folder name in Cloudinary
      allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed file types
      public_id:(req,file)=>file.originalname.split(".")[0]+""
    },
  });
  
  const cloudinaryFileUploader = multer({ storage });
  
  module.exports = cloudinaryFileUploader;