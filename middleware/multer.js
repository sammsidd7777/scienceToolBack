const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 70 * 1024 * 1024,
  },
});

module.exports = upload;