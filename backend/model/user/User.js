const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const schemaOptions = require("../../config/model/schemaOptions");
const crypto = require("crypto");

// create Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      required: [true, "First name is required"],
      type: String,
    },
    lastName: {
      required: [true, "Last name is required"],
      type: String,
    },
    profilePhoto: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236_960_720.png",
    },
    email: {
      required: [true, "Email is required"],
      type: String,
      unique: true,
    },
    bio: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    postCount: {
      type: Number,
      default: 0,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockUsers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["Admin", "Guest", "Blogger"],
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,

    viewedBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },

    followers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },

    following: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },

    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    active: {
      type: Boolean,
      default: false,
    },
  },
  schemaOptions
);

// Create virtual for join posts by populate
userSchema.virtual("posts", {
  ref: "Post",
  foreignField: "user", // reference field in Post
  localField: "_id",
});

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hashSync(this.password, salt);
  next();
});

// Match password
// Docs: https://mongoosejs.com/docs/guide.html#methods
// Note: MUST USE Expression function [function(){}], can not use arrow func
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Verify account
userSchema.methods.createAccountVerificationToken = async function () {
  // create a token: crypto.createHash("sha256").update();
  const verificationToken = crypto.randomBytes(32).toString("hex");
  this.accountVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  this.accountVerificationTokenExpires = Date.now() + 30 * 60 * 1000; // 10 mins

  return verificationToken;
};

// Password reset/forget
userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 mins
  return resetToken;
};

// Compile schema into model
const User = mongoose.model("User", userSchema);

module.exports = User;
