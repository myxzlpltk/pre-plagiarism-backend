const express = require("express");
const router = express.Router();
const { db } = require("../services");
const { FieldValue } = require("@google-cloud/firestore");

router.post("/", async function (req, res) {
  try {
    // Find the user in the database
    const userRef = db.collection('users').doc(req.user.email);
    const userSnapshot = await userRef.get();
    let user = null;

    // If the user is found, create a new user
    if (!userSnapshot.exists) {
      // Create a new user
      user = {
        name: req.user.name,
        email: req.user.email,
        picture: req.user.picture,
        idle: true,
        jobCreatedAt: null,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };
      // Save the new user to the database
      await userRef.set(user);
      // Send the user data to the client
      res.json(user);
    } else {
      // Update the user's data
      await userRef.update({
        name: req.user.name,
        picture: req.user.picture,
        updatedAt: FieldValue.serverTimestamp(),
      })
      // Get user's data
      user = userSnapshot.data();
    }

    // Send the user data to the client
    res.json({
      email: req.user.email,
      name: req.user.name,
      picture: req.user.picture,
      idle: user.idle,
      jobCreatedAt: user.jobCreatedAt,
      createdAt: user.createdAt.toDate(),
      updatedAt: user.updatedAt.toDate(),
    });
  } catch (err) {
    console.error(err);
    // If there is an error, send it to the client
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
});

module.exports = router;
