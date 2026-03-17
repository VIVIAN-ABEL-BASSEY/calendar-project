import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  dueDate?: Date;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  userId: mongoose.Types.ObjectId;
  taskGroupId?: mongoose.Types.ObjectId;
  groupId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String
    },

    dueDate: {
      type: Date
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending"
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    
    groupId: {
    type: Schema.Types.ObjectId,
     ref: "TaskGroup",
     default: null
},
     taskGroupId: {
      type: Schema.Types.ObjectId,
      ref: "TaskGroup"
    }
  },
  {
    timestamps: true
  }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);