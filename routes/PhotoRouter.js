const express = require("express");
const router = express.Router();
const Photo = require("../db/photoModel");
const User = require("../db/userModel");

// GET /photosOfUser/:id
router.get("/photosOfUser/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // kiểm tra user tồn tại
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const photos = await Photo.find({ user_id: userId });

    const result = await Promise.all(
      photos.map(async (photo) => {
        const comments = await Promise.all(
          photo.comments.map(async (c) => {
            const commentUser = await User.findById(c.user_id).select(
              "_id first_name last_name"
            );

            return {
              _id: c._id,
              comment: c.comment,
              date_time: c.date_time,
              user: commentUser,
            };
          })
        );

        return {
          _id: photo._id,
          user_id: photo.user_id,
          file_name: photo.file_name,
          date_time: photo.date_time,
          comments: comments,
        };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: "Invalid user ID" });
  }
});

router.get("/", async (request, response) => {});

module.exports = router;
