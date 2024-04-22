const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

//-------Register Api------
router.post("/register", async (req, res) => {
  const { name, email, phone, password, cpassword } = req.body;
  try {
    if (!name || !email || !phone || !password || !cpassword) {
      return res.status(420).json({ error: "Some fields are Empty" });
    }
    //----checking for password and cpassword---
    if (password != cpassword) {
      return status(420).json({
        error: "password and confirmpassword should be the same",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    //---email or phone earlier registered------
    const existingUser = await User.find({ email: email, phone: phone });
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "user already exists" });
    }
    let user = new User({
      name,
      email,
      phone,
      password: hashPassword,
      cpassword: hashPassword,
    });
    user.save();
    if (user) {
      res.send("user got saved");
    }
  } catch (err) {
    console.log(err);
    return res.status(422).json({ error: "there was an error" });
  }
});

//-----Login Api------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(422).json({ error: "Please enter all details" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ _id: user._id }, "your_secret_key", {
      expiresIn: "7d",
    });

    res.status(200).json({ message: "Logged in successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
