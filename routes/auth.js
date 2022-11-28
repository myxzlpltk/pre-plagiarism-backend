const User = require("../models/user");
const express = require("express");
const router = express.Router();

router.post("/", async function (req, res) {
  try {
    // Find the user in the database
    const user = await User.findOne({ email: req.user.email });
    // If the user is found, create a new user
    if (!user) {
      // Create a new user
      const newUser = new User({
        name: req.user.name,
        email: req.user.email,
        picture: req.user.picture,
      });
      // Save the new user to the database
      await newUser.save();
      // Send the user data to the client
      res.json(newUser);
    } else {
      // Update the user's data
      user.name = req.user.name;
      user.picture = req.user.picture;
      await user.save();
      // Send the user data to the client
      res.json(user);
    }
  } catch (err) {
    // If there is an error, send it to the client
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
});

module.exports = router;
