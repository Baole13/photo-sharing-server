const express = require("express");
const router = express.Router();
const User = require("../db/userModel");

// GET /user/list
router.get("/user/list", async (req, res) => {
  try {
    const users = await User.find({}, "_id first_name last_name");

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /user/:id
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "_id first_name last_name location description occupation"
    );

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "Invalid user ID" });
  }
});

module.exports = router;
