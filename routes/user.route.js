const User = require("../app/db/models/user.model");
const router = require("express").Router();
const responseCreate = require("../app/helpers/respose.helper");
const sendActivationEmail = require("../app/helpers/sendEmail.helper");
const auth = require("../app/middleware/auth");
var QRCode = require("qrcode");
const upload = require("../app/middleware/upload-file");

router.post("/register", async (req, res) => {
  try {
    // throw new Error("test error");  => test helper function
    const userData = new User(req.body);
    // qrcode
    QRCode.toString("I am a pony!", function (err, url) {
      userData.qr = url;
      // console.log(url);
    });
    await userData.save();
    sendActivationEmail(
      userData.email,
      `activation link http://localhost:3000/activate/${userData._id}`
    );
    const response = responseCreate(true, userData, "data inserted");
    res.status(200).send(response);
  } catch (e) {
    response = responseCreate(false, e.message, "error inserting data");
    res.status(500).send(response);
  }
});

router.get("/activate/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user)
      res.status(404).send(responseCreate(false, null, "user not found"));
    if (user.status)
      res.status(404).send(responseCreate(false, null, "aleady activate"));
    user.status = true;
    await user.save();
    res.send(responseCreate(true, user, "activated"));
  } catch (e) {
    response = responseCreate(false, e.message, "error inserting data");
    res.status(500).send(response);
  }
});

router.post("/login", async (req, res) => {
  try {
    const userData = await User.findByCredintials(
      req.body.email,
      req.body.password
    );
    const token = await userData.generatToken();
    res
      .status(200)
      .send(responseCreate(true, { userData, token }, "loggind in"));
  } catch (e) {
    response = responseCreate(false, e.message, "error inserting data");
    res.status(500).send(response);
  }
});

router.get("/me", auth, async (req, res) => {
  // try {
  res
    .status(200)
    .send({ apiStatus: true, data: req.user, message: "data fetched" });
  // } catch (e) {
  //   response = responseCreate(false, e.message, "error inserting data");
  //   res.status(500).send(response);
  // }
});

router.post("/logout", auth, async (req, res) => {
  try {
    // catch token and remove it
    req.user.tokens = req.user.tokens.filter((ele) => {
      return ele.token != req.token;
    });
    await req.user.save();
    res.status(200).send(responseCreate(true, {}, "loggind out"));
  } catch (e) {
    response = responseCreate(false, e.message, "error inserting data");
    res.status(500).send(response);
  }
});

router.post("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send(responseCreate(true, {}, "loggind out   "));
  } catch (e) {
    response = responseCreate(false, e.message, "error inserting data");
    res.status(500).send(response);
  }
});

router.post("/allUsers", auth, async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).send(responseCreate(true, data, "loading out"));
  } catch (e) {
    response = responseCreate(false, e.message, "error loading data");
    res.status(500).send(response);
  }
});

router.post("/profile", auth, upload.single("avatar"), async (req, res) => {
  try {
    req.user.image = req.file.path;
    await req.user.save();
    // data = req.file;
    res.send("done");
  } catch (e) {
    response = responseCreate(false, e.message, "error loading data");
    res.status(500).send(response);
  }
});

module.exports = router;
