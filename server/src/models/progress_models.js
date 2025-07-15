import mongoose, { Schema } from "mongoose";

const progressSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "solved"],
      default: "todo",
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

progressSchema.index({ user: 1, question: 1 }, { unique: true });

export const Progress = mongoose.model("Progress", progressSchema);
