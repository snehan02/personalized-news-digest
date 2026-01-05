import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  topics: {
    type: [String],
    default: []
  },
  subscribed: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model("User", userSchema);
