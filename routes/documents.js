const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");
const { db, storage } = require("../services");
const multer = require("multer");
const { FieldValue } = require("@google-cloud/firestore");
const { doc } = require("prettier");

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype != "application/pdf") {
      cb(null, false);
      return cb(new Error('Only .pdf format allowed!'));
    } else if (file.size <= 1024) {
      cb(null, false);
      return cb(new Error('File is empty!'));
    } else {
      cb(null, true);
    }
  }
});

// Upload file to gcs async
const uploadFile = async (bucketFile, buffer, mimetype) => new Promise((resolve, reject) => {
  const stream = bucketFile.createWriteStream({
    resumable: false,
    metadata: { contentType: mimetype }
  })

  stream.on('error', (err) => reject(err))
  stream.on('finish', (res) => resolve(res))
  stream.end(buffer)
})

/* GET users listing. */
router.get("/", async function (req, res) {
  // Get documents
  const documentsRef = db.collection(`users/${req.user.email}/documents`);
  const documentsSnapshot = await documentsRef.orderBy('createdAt').get();
  const documents = [];

  // Retrieve documents
  documentsSnapshot.forEach(doc => {
    // Formatting data
    const data = doc.data();
    data.id = doc.id;
    data.createdAt = data.createdAt.toDate();
    data.updatedAt = data.updatedAt.toDate();
    data.result = undefined;

    // Push document
    documents.push(data);
  });

  // Return documents
  res.json(documents);
});

/* Create documents */
router.post("/", upload.single('file'), async function (req, res) {
  try {
    // Find the user in the database
    const userRef = db.collection('users').doc(req.user.email);
    const userSnapshot = await userRef.get();
    const user = userSnapshot.data();

    // If user not idle, send error
    if (!user.idle) {
      return res.status(400).json({
        status: "error",
        message: "Tidak bisa membuat dokumen baru saat tidak idle",
      });
    }

    // Upload file to gcs
    const filename = randomUUID() + ".pdf";
    const bucketFile = storage.bucket(process.env.BUCKET_NAME).file(`${user.email}/${filename}`)
    await uploadFile(bucketFile, req.file.buffer, req.file.mimetype)

    // Save document to database
    const document = {
      filename: filename,
      originalFilename: req.file.originalname,
      status: "processing",
      result: {},
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    const doc = await db.collection(`users/${req.user.email}/documents`).add(document);

    // Set user to not idle
    // await userRef.update({
    //   idle: false,
    //   jobCreatedAt: FieldValue.serverTimestamp(),
    // });

    // Publish to pubsub
    // req.app.locals.redis.publish("documents", filename);

    // Send response
    document.id = doc.id;
    document.createdAt = new Date();
    document.updatedAt = new Date();
    res.json(document);
  } catch (err) {
    console.error(err);
    // If there is an error, send it to the client
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
});

// Get document
router.get("/:id", async function (req, res) {
  // Get document
  const documentRef = db.collection(`users/${req.user.email}/documents`).doc(req.params.id);
  const documentSnapshot = await documentRef.get();

  if (documentSnapshot.exists) {
    const document = documentSnapshot.data();
    document.id = documentSnapshot.id;
    document.createdAt = new Date();
    document.updatedAt = new Date();

    // Generate public link
    const [url] = await storage.bucket(process.env.BUCKET_NAME)
      .file(`${req.user.email}/${document.filename}`)
      .getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      });
    document.url = url;

    return res.json(document);
  } else {
    return res.status(404).json({
      status: "error",
      message: "Dokumen tidak ditemukan",
    });
  }
});

module.exports = router;
