const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

const userImg = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "usuarios",
    allowedFormats: ["jpg", "png", "jpeg", "gif", "webp"],
    transformation: [{ width: 200, height: 200, crop: 'fill' }]
  }
});
const upUserImg = multer({ storage: userImg });

const residentialImg = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "parcelas",
    allowedFormats: ["jpg", "png", "jpeg", "gif", "webp"],
    transformation: [{ width: 600, height: 200, crop: 'fill' }]
  }
});
const upResidentialImg = multer({ storage: residentialImg });

module.exports = { upUserImg, upResidentialImg }