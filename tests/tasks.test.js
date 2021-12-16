const app = require("../src/app");
const Task = require("../src/models/task");
const request = require("supertest");
const { userId, userOne, confidDataBase, taskThree } = require("./fixtures/db");

// before each test suite
beforeEach(confidDataBase);

test("Should create new Task", async () => {
  const res = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "From test",
    })
    .expect(201);

  // Assertion if the task is created successfully
  // get the task from the database from the id we get from res
  const task = await Task.findById(res.body._id);
  expect(task).not.toBeNull();

  expect(task).toMatchObject({
    description: "From test",
    completed: false,
  });
});

test("Should get user tasks", async () => {
  const res = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  // Assertion about the number of tasks
  expect(res.body.length).toBe(2);
});

test("Shouldnot delete tasks for not the owner", async () => {
  const res = await request(app)
    .delete(`/tasks/${taskThree._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(404);

  // Assertion if the taks is still exist in the database
  const task = await Task.findById(taskThree._id);
  expect(task).not.toBeNull();
});
