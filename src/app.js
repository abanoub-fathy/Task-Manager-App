require("./db/mongoose"); // for connecting to the database
const express = require("express"); // importing express library
const userRouter = require("./routers/user"); // importing user router
const taskRouter = require("./routers/task"); // importing task router

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
