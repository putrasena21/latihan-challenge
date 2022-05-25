const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");
const storage = require("../middlewares/storage");

const media = require("../controllers/media.controller");

router.post("/upload/single", storage.single("upload"), media.singleUpload);
router.post(
  "/upload/multiple",
  storage.array("upload", 5),
  media.multipleUpload
);
router.post("/upload/imagekit", upload, media.imageKit);

module.exports = router;
