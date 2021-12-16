const mongoose = require("mongoose");

// connect to the database
mongoose.connect(process.env.URL, {
  useNewUrlParser: true,
  autoIndex: true,
});
