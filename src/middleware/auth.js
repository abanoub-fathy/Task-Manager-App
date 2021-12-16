const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    // get the token from the request header
    const token = req.header("Authorization").replace("Bearer ", "");

    // decode the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // find the user with the id and token provided from database
    const user = await User.findOne({
      _id: decodedToken._id,
      "tokens.token": token,
    });

    // if no user throw error
    if (!user) {
      throw new Error();
    }

    // add property of user to the req the value of it is the user we found by the token
    req.user = user;
    req.tokenUsedForAuthorization = token;

    next();
  } catch (e) {
    res.status(401).send({ Error: "Please Authinticate first" });
  }
};

module.exports = auth;
