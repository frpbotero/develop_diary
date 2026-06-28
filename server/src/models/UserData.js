import mongoose from "mongoose";

const userDataSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    key: { type: String, required: true },
    value: { type: String, default: "" },
  },
  { timestamps: true }
);

userDataSchema.index({ user: 1, key: 1 }, { unique: true });

export const UserData = mongoose.model("UserData", userDataSchema);
