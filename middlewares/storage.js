const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // saving into each folder by extension jpeg, jpg, png, mp4, xlsx, xls, docx, doc, pdf
    // if folder not exist, create it
    const extension = path.extname(file.originalname);
    const folderImage = path.join(__dirname, "../public/uploads/image/");
    const folderFile = path.join(__dirname, "../public/uploads/file/");
    const folderVideo = path.join(__dirname, "../public/uploads/video/");

    if (file.mimetype.includes("image")) {
      fs.mkdirSync(folderImage, { recursive: true }, (err) => {
        if (err) {
          console.log(err);
        }
      });
      cb(null, folderImage);
    } else if (file.mimetype.includes("video")) {
      fs.mkdirSync(folderVideo, { recursive: true }, (err) => {
        if (err) {
          console.log(err);
        }
      });
      cb(null, folderVideo);
    } else {
      fs.mkdirSync(folderFile, { recursive: true }, (err) => {
        if (err) {
          console.log(err);
        }
      });
      cb(null, folderFile);
    }
  },

  filename: function (req, file, cb) {
    const namaFile = Date.now() + "-" + path.extname(file.originalname);
    cb(null, namaFile);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "video/mp4" ||
      file.mimetype ==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype ==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype == "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      cb(new Error("Your file cant be uploaded!"));
    }
  },
  onError: function (err, next) {
    console.log("error", err);
    next(err);
  },
});

module.exports = upload;
