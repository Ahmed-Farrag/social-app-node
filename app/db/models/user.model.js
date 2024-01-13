const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// make schema for securty or write function
const userSchema = new mongoose.Schema(
  {
    qr: {
      type: String,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("invalid email formt");
      },
    },
    password: {
      type: String,
      lowerCase: true,
      required: true,
      match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
      min: 6,
      trim: true,
      validate(value) {
        if (
          value.toLowerCase().includes("pass") ||
          value.toLowerCase().includes("password") ||
          value.toLowerCase().includes("123") ||
          value.toLowerCase().includes(this.name)
        )
          throw new Error("week password");
      },
    },
    phone: {
      type: String,
      trim: true,
      validate(value) {
        if (!validator.isMobilePhone(value, ["ar-EG"]))
          throw new Error("Invalid mobile number");
      },
    },
    gender: {
      type: Boolean,
      require: true,
    },
    address: [
      {
        address1: {
          addrType: {
            type: String,
            trim: true,
          },
          addrDetails: {
            type: String,
            trim: true,
          },
        },
        address2: {
          addrType: {
            type: String,
            trim: true,
          },
          addrDetails: {
            type: String,
            trim: true,
          },
        },
      },
    ],
    image: {
      type: String,
      default: "",
    },
    status: {
      type: Boolean,
      default: false,
    },
    tokens: [{ token: { type: String } }],
  },
  { timestamps: true }
);

// virtual populate
userSchema.virtual("userPosts", {
  ref: "Post",
  localField: "_id",
  foreignField: "userId",
});

// handle response
// toJSON to work on all endpoint
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  let deleted = ["password", "address", "token", "__v"];
  deleted.forEach((item) => {
    delete user[item];
  });
  return user;
};

// encript password
userSchema.pre("save", async function (next) {
  const user = this;
  // when edit password
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// login User
userSchema.statics.findByCredintials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("invalid email");
  const inValidPass = await bcrypt.compare(password, user.password);
  if (!inValidPass) throw new Error("invalid password");
  if (user.tokens.length >= 5) throw new Error("exeded number of logins");
  return user;
};

// generate token
userSchema.methods.generatToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWTSECURITY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;


