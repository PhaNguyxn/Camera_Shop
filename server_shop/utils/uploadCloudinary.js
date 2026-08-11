const cloudinary = require("../config/cloudinary");

const uploadCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "camera-shop/products",
      },

      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      },
    );

    stream.end(fileBuffer);
  });
};

module.exports = uploadCloudinary;
