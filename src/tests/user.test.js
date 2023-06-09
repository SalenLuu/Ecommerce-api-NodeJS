const request = require("supertest");
const app = require("../app");

let userId;
let token;

test("POST /users should create an user", async () => {
  const user = {
    firstName: "Salomé",
    lastName: "Restrepo",
    email: "salome@gmail.com",
    password: "salome123new",
    phone: "3057689201",
  };
  const res = await request(app).post("/users").send(user);
  userId = res.body.id;

  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
});

test("POST /users/login should do login", async () => {
  const credentials = {
    email: "salome@gmail.com",
    password: "salome123new",
  };
  const res = await request(app).post("/users/login").send(credentials);
  token = res.body.token;

  expect(res.status).toBe(200);
  expect(res.body.token).toBeDefined();
});

test("GET /users should return the users", async () => {
  const res = await request(app)
    .get("/users")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(2);
});

test("PUT /users/:id", async () => {
  const userUpdated = {
    firstName: "salome new",
  };
  const res = await request(app)
    .put(`/users/${userId}`)
    .send(userUpdated)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.firstName).toBe(userUpdated.firstName);
});

test("DELETE /users/:id should remove a specific user", async () => {
  const res = await request(app)
    .delete(`/users/${userId}`)
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(204);
});
