const { ObjectId, MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const dbName = "Task-Manager-App";

MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log("Unable to connect");
  }

  const db = client.db(dbName);

  // Read using promise
  db.collection("users")
    .find({
      $where: "this.age < 25",
    })
    .toArray()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });

  // delete using promise
  db.collection("users")
    .deleteMany({
      $where: "this.age > 25",
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
});
