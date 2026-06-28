import mongoose from "mongoose";

const monthSchema = new mongoose.Schema(
  {
    month: Number,
    year: Number,
    shortName: String,
    name: String,
    icon: String,
    color: String,
    theme: String,
    objective: String,
    focus: [String],
    studies: [String],
    deliverable: String,
    technicalTask: String,
    englishGoal: String,
    phrases: [String],
    postIdea: String,
  },
  { _id: false }
);

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    durationMonths: { type: Number, default: 12, min: 1, max: 60 },
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ["active", "paused", "completed"],
      default: "active",
    },
    months: [monthSchema],
    routines: [mongoose.Schema.Types.Mixed],
    skills: [mongoose.Schema.Types.Mixed],
    artifacts: [mongoose.Schema.Types.Mixed],
    templates: [mongoose.Schema.Types.Mixed],
  },
  { timestamps: true }
);

export const Goal = mongoose.model("Goal", goalSchema);
