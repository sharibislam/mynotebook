const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const router = express.Router();
var jwt = require("jsonwebtoken");
var fetchuser = require('../middleware/fetchuser')
const JWT_SECRET = "SharibIsla@godB&y";

//Route 1 :Create a user using POST request /api/auth/createuser : No login required
router.post(
  "/createuser",
  [
    body("name", "Please enter a valid Name").isLength({ min: 3 }),
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Please enter a valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false;
      return res.status(400).json({success, errors: errors.array() });
    }
    // CHeck wheather user with given email already exist
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Sorry a user with given email already exist" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET)
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      success = false;
      res.status(500).send("Some error occured while creating user");
    }
  }
);

//Route 2 : Login a user using POST request /api/auth/login : No login required
router.post(
  "/login",
  [
    body("email", "Please enter a valid email").isEmail(),
    body("password", `Password can't be blank`).notEmpty(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ success,error: "Please try to login with valid credentials" });
      }

      let passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Please try to login with valid credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured while creating user");
    }
  }
);

//Route 3 : Get logged in user details using :  POST request /api/auth/getuser : No login required

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userdId = req.user.id
    const user = await User.findById(userdId).select("-password");
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured while creating user");
  }
});

module.exports = router;
