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
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      });
      // Save the new user to the database
      await newUser.save();
      // Send the user data to the client
      res.json(newUser);
    } else {
      // Send the user data to the client
      res.json(user);
    }
  } catch (err) {
    // If the token is invalid, send an error
    res.status(401).json({
      status: "error",
      message: "Invalid token",
    });
  }
});

module.exports = router;
