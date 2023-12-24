const Post = require("../app/db/models/post.model");
const router = require("express").Router();
const auth = require("../app/middleware/auth");
const upload = require("../app/middleware/upload-file");
// const auth = require("./middleware/auth");

// create posts
router.post("/myTest", auth, upload.single("file"), async (req, res) => {
  try {
    const data = new Post({
      ...req.body,
      userId: req.user._id,
    });
    if (req.file) data.file = req.file.path;
    await data.save();
    res.send(data);
  } catch (e) {
    res.send(e);
  }
});

router.get("/myPosts", auth, async (req, res) => {
  try {
    let posts = Post.find({ userId: req.user._id });
    res.send(posts);
  } catch (e) {
    res.send(e);
  }
});

// same last endpoint but faster in req
// app.get("/myPosts1", auth, async (req, res) => {
//   try {
//     await req.user
//       .populate({
//         path: "userPosts",
//         // options: {
//         //   limit: 1,
//         // },
//       })
//       .execPopulate();
//   } catch (e) {
//     res.send(e);
//   }
// });
