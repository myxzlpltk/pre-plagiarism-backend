const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res) {
  res.json({
    message: "Selamat datang!",
    app: process.env.APP_NAME,
    version: process.env.APP_VERSION,
  });
});

module.exports = router;
