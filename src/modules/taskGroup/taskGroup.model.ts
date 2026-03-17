import mongoose, { Schema, Document } from "mongoose";

export interface ITaskGroup extends Document {
  name: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskGroupSchema = new Schema<ITaskGroup>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const TaskGroup = mongoose.model<ITaskGroup>(
  "TaskGroup",
  taskGroupSchema
);