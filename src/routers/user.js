const express = require("express"); //  require express
const User = require("../models/user"); // for using user model
const { isValidObjectId } = require("mongoose");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const { sendWelcomeEmail, sendDeleteEmail } = require("../email/account");

const router = new express.Router();

// Create new user
router.post("/users", async (req, res) => {
  // create new user with the provided data from the request
  const user = new User(req.body);
  // send welcome email msg
  sendWelcomeEmail(user.email, user.name);

  try {
    await user.save();
    const token = await user.generateToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// login user
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// Read my profile
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

// logout a user
router.post("/users/logout", auth, async (req, res) => {
  try {
    const user = req.user;

    user.tokens = user.tokens.filter(
      (tokenObj) => tokenObj.token !== req.tokenUsedForAuthorization
    );
    await user.save();

    res.send("Logged out correctly!");
  } catch (e) {
    res.status(500).send();
  }
});

// logout all
router.post("/users/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send("Logged out from all");
  } catch (e) {
    res.status(500).send();
  }
});

/* for learning experiment
// find one user by its id
router.get('/users/:id', async (req, res) => {
  // recieve the id from the request
  const _id = req.params.id;

  if(!isValidObjectId(_id)) {
      // not valid objectId
      return res.status(400).send("not valid id was sent");
  }

  try {
      const user = await User.findById(_id);
          
      if(!user) {
          // no user with this id in the database
          return res.status(404).send("No User with this id in our database");
      }

      res.send(user);

  } catch(e) {
      res.status(500).send()
  }
  
})
*/

// route handler for updating user
router.patch("/users/me", auth, async (req, res) => {
  // validate updates
  const validUpdates = ["name", "age", "email", "password"];
  const updates = Object.keys(req.body);

  const isValidOperation = updates.every((update) => {
    return validUpdates.includes(update);
  });

  if (!isValidOperation) {
    res.status(400).send({ errors: "invalid updates" });
  }

  try {
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

    // updating the user
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });

    // save the user
    await req.user.save();

    // return the user modified
    res.send(req.user);
  } catch (e) {
    // may be validation errors
    res.status(400).send();
  }
});

// Delete user route handler
router.delete("/users/me", auth, async (req, res) => {
  try {
    // delete the user
    await req.user.remove();

    sendDeleteEmail(req.user.email, req.user.name);

    // sending the user that is deleted
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

let upload = new multer({
  limits: {
    fileSize: 2e6,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please use image with extensions jpg, jpeg or png"));
    }

    cb(undefined, true);
  },
});

// upload image
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    let buffer = await sharp(req.file.buffer)
      .resize({
        width: 250,
        height: 250,
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .png()
      .toBuffer();

    // save the avatar for the user
    req.user.avatar = buffer;
    await req.user.save();

    // send 200
    res.send();
  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message });
  }
);

// delete user profile image
router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

// serve user profile image
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
