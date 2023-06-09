const request = require("supertest");
const app = require("../app");
const Product = require("../models/Product");
require("../models");

let token;
let cartId;

beforeAll(async () => {
  const credentials = {
    email: "testuser@gmail.com",
    password: "testuser1234",
  };
  const res = await request(app).post("/users/login").send(credentials);
  token = res.body.token;
});

test("POST /cart should create a cart", async () => {
  const product = await Product.create({
    title: "iPhone 13 mini",
    description: "Loren Ipsum",
    brand: "Apple",
    price: 150000,
  });
  const cart = {
    productId: product.id,
    quantity: 1,
  };
  const res = await request(app)
    .post("/cart")
    .send(cart)
    .set("Authorization", `Bearer ${token}`);
  cartId = res.body.id;
  await product.destroy();
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
});

test("GET /cart", async () => {
  const res = await request(app)
    .get("/cart")
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(200);
});

test("PUT /cart/:id should update an specific category", async () => {
  const cartUpdated = {
    quantity: 2,
  };

  const res = await request(app)
    .put(`/cart/${cartId}`)
    .send(cartUpdated)
    .set("Authorization", `Bearer ${token}`);
  console.log(res.body);

  expect(res.status).toBe(200);
  expect(res.body.quantity).toBe(cartUpdated.quantity);
});

test("DELETE /cart/:id", async () => {
  const res = await request(app)
    .delete(`/cart/${cartId}`)
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(204);
});
