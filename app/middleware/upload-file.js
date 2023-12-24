const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storge = multer.diskStorage({
  destination: function (req, file, cb) {
    // create nested folders depend on user id
    const location = path.join("uploads", req.user._id.toString());
    fs.mkdir(location, (err) => {});
    cb(null, location);
  },
  filename: function (req, file, cb) {
    let myName =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    cb(null, myName);
  },
});

const upload = multer({
  storage: storge,
  //   add limitation
  limits: {
    fileSize: 150000,
  },
  fileFilter: function (req, file, callback) {
    ext = path.extname(file.originalname);
    // if (ext != ".png"&& ext != ".jpg") return callback(new Error("invalid Extention"));

    // $ to uplaud file changepol
    if (ext == req.body.fileType)
      return callback(new Error("invalid Extention"));
    callback(null, true);
  },
});

module.exports = upload;
