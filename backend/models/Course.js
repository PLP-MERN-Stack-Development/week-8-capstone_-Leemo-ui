import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
    trim: true
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000,
    trim: true
  },
  instructor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
  },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }]
});

export default mongoose.model("Course", courseSchema);
