const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userId, userOne, confidDataBase } = require("./fixtures/db");

// before each test suite
beforeEach(confidDataBase);

test("Should signup new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Mena",
      email: "menamon@gmail.com",
      password: "mena123!!",
    })
    .expect(201);

  // Assert that the database changes correctly and the user is saved (not null)
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertion that the user name is correct
  expect(response.body.user.name).toBe("Mena");

  expect(response.body).toMatchObject({
    user: {
      name: "Mena",
      email: "menamon@gmail.com",
    },
    token: response.body.token,
  });
});

test("Should login existed user", async () => {
  const res = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  // Assertion about adding new token and returning it
  const user = await User.findById(userOne._id);
  expect(res.body.token).toBe(user.tokens[1].token);
});

test("Should not allow user to login with bad credentials", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: "Fakepass123",
    })
    .expect(400);
});

test("Should not read profile for un-auth users", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should read profile for auth user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not delete un-auth user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("Should delete auth user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  // Assertion that the user is already removed
  const user = await User.findById(userId);
  expect(user).toBeNull();
});

test("Should upload profile image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "./tests/fixtures/img.jpg")
    .expect(200);

  // Assertion that the avatar is saved correctly as Buffer
  const user = await User.findById(userId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update a user", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "bebo",
      age: 55,
    })
    .expect(200);

  // Assertion that the fields updated correctly
  const user = await User.findById(userId);
  expect(user.name).toBe("bebo");
  expect(user.age).toBe(55);
});

test("Should not update invalid props", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "bebo",
      age: 55,
      country: "America",
    })
    .expect(400);
});
