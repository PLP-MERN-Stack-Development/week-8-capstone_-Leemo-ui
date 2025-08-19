import mongoose from "mongoose";
import Course from "../Course.js";

describe("Course Model", () => {
  it("should require title and description", async () => {
    const course = new Course({});
    let err;
    try {
      await course.validate();
    } catch (e) {
      err = e;
    }
    expect(err.errors.title).toBeDefined();
    expect(err.errors.description).toBeDefined();
  });

  it("should not allow short titles", async () => {
    const course = new Course({ title: "Hi", description: "A valid description", instructor: new mongoose.Types.ObjectId() });
    let err;
    try {
      await course.validate();
    } catch (e) {
      err = e;
    }
    expect(err.errors.title).toBeDefined();
  });
});
