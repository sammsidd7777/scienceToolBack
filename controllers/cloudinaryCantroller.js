const cloudinary = require("../config/cloudinary");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "products",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    return res.status(200).json({
      success: true,
      image: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};

module.exports = { uploadImage };