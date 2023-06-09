const request = require("supertest");
const app = require("../app");
const Category = require("../models/Category");
const ProductImg = require("../models/ProductImg");
require("../models");

let token;
let productId;

beforeAll(async () => {
  const credentials = {
    email: "testuser@gmail.com",
    password: "testuser1234",
  };
  const res = await request(app).post("/users/login").send(credentials);
  token = res.body.token;
});

test("POST /products should create a product", async () => {
  const category = await Category.create({ name: "tech" });
  const product = {
    title: "iPhone 13 mini",
    description: "Lorem ipsum",
    brand: "apple",
    price: 1000,
    categoryId: category.id,
  };

  const res = await request(app)
    .post("/products")
    .send(product)
    .set("Authorization", `Bearer ${token}`);
  productId = res.body.id;
  await category.destroy();

  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
});

test("GET /products should return all products", async () => {
  const res = await request(app)
    .get("/products")
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("PUT /product/:id should update a specific product", async () => {
  const productUpdated = {
    title: "iPhone 13 actualizado",
  };
  const res = await request(app)
    .put(`/products/${productId}`)
    .send(productUpdated)
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(200);
  expect(res.body.title).toBe(productUpdated.title);
});

test("POST /products/:id/images should set product images", async () => {
  const image = await ProductImg.create({
    url: "http://falseurl.com",
    publicId: "false id",
  });
  const res = await request(app)
    .post(`/products/${productId}/images`)
    .send([image.id])
    .set("Authorization", `Bearer ${token}`);
  await image.destroy();

  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("DELETE /products/:id should delete a specific product", async () => {
  const res = await request(app)
    .delete(`/products/${productId}`)
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(204);
});
