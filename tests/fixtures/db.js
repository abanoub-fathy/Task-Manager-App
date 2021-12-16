const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const userId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userId,
  name: "nameOne",
  age: "99",
  email: "kokopoko@gmail.com",
  password: "pass12345",
  tokens: [
    {
      token: jwt.sign({ _id: userId }, process.env.JWT_SECRET),
    },
  ],
};

const userTwo = {
  _id: new mongoose.Types.ObjectId(),
  name: "usernameTwo",
  age: "99",
  email: "user2@gmail.com",
  password: "pass12345",
  tokens: [
    {
      token: jwt.sign({ _id: userId }, process.env.JWT_SECRET),
    },
  ],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "task 1",
  completed: false,
  owner: userOne._id,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "task 2",
  completed: true,
  owner: userOne._id,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "task 3",
  completed: false,
  owner: userTwo._id,
};

const confidDataBase = async () => {
  // remove all users and tasks
  await User.deleteMany();
  await Task.deleteMany();

  // create a user for testing
  await User(userOne).save();
  await User(userTwo).save();

  await Task(taskOne).save();
  await Task(taskTwo).save();
  await Task(taskThree).save();
};

module.exports = {
  userId,
  userOne,
  confidDataBase,
  taskThree,
};
