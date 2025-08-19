import mongoose from "mongoose";
import request from "supertest";
import Course from "../models/Course.js";
import User from "../models/User.js";
import app from "../server.js"; // You may need to export your Express app from server.js

let adminToken;
let adminId;

beforeAll(async () => {
  // Connect to test DB
  await mongoose.connect(process.env.MONGO_URI_TEST);

  // Create admin user and get token
  const admin = new User({ name: "Admin", email: "admin@test.com", password: "password123", role: "admin" });
  await admin.save();
  adminId = admin._id;
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@test.com", password: "password123" });
  adminToken = res.body.token;
});

afterAll(async () => {
  await User.deleteMany({});
  await Course.deleteMany({});
  await mongoose.disconnect();
});

describe("Course API", () => {
  it("should create a course", async () => {
    const res = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "Test Course", description: "Test Desc", instructor: adminId });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Course");
  });

  it("should get all courses", async () => {
    const res = await request(app).get("/api/courses");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
