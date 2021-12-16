const app = require("./app");

// port we work at
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`app is launched up at port ${port}`);
});
