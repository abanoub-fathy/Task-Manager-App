const mongoose = require("mongoose");
const validator = require("validator");
const bcrybt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("The Age should be positive!!");
        }
      },
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("The email address you entered is not valid!!!");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error(`password shouldnot have the word password ${value}`);
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

// virtual task property on user
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;
  delete user.tokens;
  delete user.avatar;

  return user;
};

// generate Auth Token and save it to the database
// methods are accessible on the instance of the model
userSchema.methods.generateToken = async function () {
  // this here is the document[record] of that user
  const user = this;

  // generate token
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  // add token to the others and save changes
  user.tokens.push({ token });
  await user.save();

  return token;
};

// find user by credentials method
// statics methods are accessible on models
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Email not found!");
  }

  const isMatch = await bcrybt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Wrong password!");
  }

  return user;
};

// middleware for hashing password before saving to the databse
userSchema.pre("save", async function (next) {
  const user = this;

  // in the case of modifying the passoword field
  if (user.isModified("password")) {
    user.password = await bcrybt.hash(user.password, 8);
  }

  next();
});

// delete user tasks when deleting the user
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
