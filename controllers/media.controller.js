const { imagekit } = require("../helpers");

module.exports = {
  singleUpload: async (req, res) => {
    try {
      return res.status(200).json({
        message: "File uploaded successfully",
        file: req.file,
        file_url: `http://localhost:3000/image/${req.file.filename}`,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Error uploading file",
        error: err,
      });
    }
  },

  multipleUpload: async (req, res) => {
    try {
      return res.status(200).json({
        message: "Files uploaded successfully",
        files: req.files,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Error uploading files",
        error: err,
      });
    }
  },

  imageKit: async (req, res) => {
    try {
      const file = req.file.buffer.toString("base64");
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = uniqueSuffix + req.file.originalname;

      const upload = await imagekit.upload({
        fileName: fileName,
        file: file,
      });

      return res.status(200).json({
        status: 200,
        message: "File uploaded successfully",
        data: upload,
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: err.message,
      });
    }
  },
};
