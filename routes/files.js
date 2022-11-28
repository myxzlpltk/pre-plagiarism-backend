const Document = require("../models/document");
const express = require("express");
const router = express.Router();
const services = require("../middleware/services");

// Get document pdf
router.get("/:id/:filename", services.minio, async function (req, res) {
  // Get document
  const document = await Document.findOne({
    _id: req.params.id,
    filename: req.params.filename,
  });

  if (document) {
    // Get pdf from minio
    const pdf = await req.app.locals.minio.getObject(
      process.env.MINIO_BUCKET,
      document.filename
    );
    // Set content type
    res.set("Content-Type", "application/pdf");
    // Send pdf
    return pdf.pipe(res);
  } else {
    return res.status(404).json({
      status: "error",
      message: "Dokumen tidak ditemukan",
    });
  }
});

module.exports = router;
