const express = require("express");

const router = express.Router();

const Schema = require("../Models/Auth");

const db = require("../DB/Connection");

const User = db.get("users");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const fetchuser = require("../Middlewares/fetchuser");

// ROTUE 1 : CREATE a user using POST "/api/v1/auth/createUser"
router.post("/createUser", async (req, res) => {
  try {
    // validate the body
    const user = await Schema.validateAsync(req.body);
    if (user) {
      // check if user email already exist or not
      const isExist = await User.findOne({ email: req.body.email });
      //   if email already exist throw error
      if (isExist) {
        return res.status(422).json({
          message: " Try to register with correct credentials invalid email❎",
        });
      }
      // else hash the password
      const secPass = await bcrypt.hash(req.body.password, 10);
      user.password = secPass;
      //   insert to DB
      user.created_on = new Date().toLocaleString();
      const created = await User.insert(user);

      //   Sing tht JWT
      const data = {
        _id: user._id,
        name: user.name,
        email: user.email,
        created_on: user.created_on,
      };

      const authToken = jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(201).json({
        message: "User Created",
        // value: created,
        token: authToken,
      });
    }
    return res.status(422).json({
      message: " Try to Register with correct credentials ❎",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Some Internal Server Error ❎",
      errorMessage: error.message,
    });
  }
});

// ROTUE 2 : User Login using POST "/api/v1/auth/userLogin"
router.post("/userLogin", async (req, res) => {
  try {
    // find the user
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // compare the password
      const isValidKey = await bcrypt.compare(req.body.password, user.password);
      if (!isValidKey) {
        return res.status(422).json({
          message: " Try to login with correct credentials invalid password❎",
        });
      }
      //   Sing tht JWT
      const data = {
        _id: user._id,
        name: user.name,
        email: user.email,
        created_on: user.created_on,
      };

      const authToken = jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(201).json({
        message: " User Logeed in Success 🌱",
        // value: user,
        token: authToken,
      });
    }
    // it not found throw error
    return res.status(422).json({
      message: " Try to login with correct credentials❎",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Some Internal Server Error ❎",
      errorMessage: error.message,
    });
  }
});

// ROTUE 3 : Fetch User Deatils using  GET "/api/v1/auth/userProfile"
router.get("/userProfile", fetchuser, async (req, res) => {
  try {
    const value = await User.findOne({
      _id: req.user._id,
    });
    return res.status(201).json({
      message: value,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Some Internal Server Error ❎",
      errorMessage: error.message,
    });
  }
});

module.exports = router;
