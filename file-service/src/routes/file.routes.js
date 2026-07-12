const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const { authenticate } = require("../middleware/auth.middleware")

const fileController = require("../controllers/file.controller");

router.post("/upload", authenticate, upload.single("file"), fileController.upload);
router.get("/", fileController.getAllFiles);
router.get("/:id", fileController.getFile);
router.delete("/:id", fileController.deleteFile);

module.exports = router;