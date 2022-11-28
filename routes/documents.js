const Document = require("../models/document");
const User = require("../models/user");
const express = require("express");
const formidable = require("formidable");
const uuid = require("uuid");
const services = require("../middleware/services");
const router = express.Router();

/* GET users listing. */
router.get("/", async function (req, res) {
  // Get user data
  const user = await User.findOne({ email: req.user.email });
  // Get documents
  const documents = await Document.find({ user: user._id })
    .select({ result: false })
    .sort({ createdAt: -1 });

  // Return documents
  res.json(documents);
});

/* Create documents */
router.post("/", services.redis, services.minio, async function (req, res) {
  // Get user data
  const user = await User.findOne({ email: req.user.email });

  // If user not idle, send error
  if (!user.idle) {
    res.status(400).json({
      status: "error",
      message: "Tidak bisa membuat dokumen baru saat tidak idle",
    });
  } else {
    // Create formidable instance
    const form = formidable();

    // Parse form data
    form.parse(req, async (err, fields, files) => {
      // Validate file
      if (
        !err &&
        files.file &&
        files.file.size > 1024 &&
        files.file.mimetype === "application/pdf"
      ) {
        // Upload file to minio
        const filename = uuid.v4() + ".pdf";
        await req.app.locals.minio.fPutObject(
          process.env.MINIO_BUCKET,
          filename,
          files.file.filepath,
          { "Content-Type": "application/pdf" }
        );

        // Save document to database
        const document = new Document({
          user: user._id,
          filename: filename,
          originalFilename: files.file.originalFilename,
        });
        document.save().then(() => {});

        // Set user to not idle
        user.idle = false;
        user.jobCreatedAt = new Date();
        user.save().then(() => {});

        // Publish to redis
        req.app.locals.redis.publish("documents", filename);

        // Send response
        res.json(document);
      } else {
        res.status(400).json({
          status: "error",
          message: "Tidak ada file yang diupload",
        });
      }
    });
  }
});

// Get document
router.get("/:id", async function (req, res) {
  // Get user data
  const user = await User.findOne({ email: req.user.email });
  // Get document
  const document = await Document.findOne({
    _id: req.params.id,
    user: user._id,
  });

  if (document) {
    return res.json(document);
  } else {
    return res.status(404).json({
      status: "error",
      message: "Dokumen tidak ditemukan",
    });
  }
});

module.exports = router;
