require("../src/db/mongoose");
const User = require("../src/models/user");

User.findByIdAndDelete("6169f57f976ecef013c6a346")
  .then(() => {
    return User.countDocuments({ age: 0 });
  })
  .then((count) => {
    console.log(`You have ${count} documents left!`);
  })
  .catch((e) => {
    console.log(e);
  });
