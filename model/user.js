const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { SALT_ROUNDS, JWT_EXPIRY, JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: (value) => validator.isEmail(value),
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    // isStudent: {
    //   type: Boolean,
    //   required: true,
    //   default: true,
    // },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  let user = this;
  if (!user.isModified("password")) {
    return;
  }

  bcrypt.genSalt(Number(SALT_ROUNDS), function (err, salt) {
    if (err) throw err;
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function (password) {
  const isValid = bcrypt.compare(password, this.password);
  return isValid;
};

userSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
  return token;
};

userSchema.statics.findByToken = function (token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return this.findOne({ _id: decoded._id });
  } catch (err) {
    throw new Error(`Error verifying token: ${err.message}`);
  }
};

module.exports = mongoose.model("Users", userSchema);
