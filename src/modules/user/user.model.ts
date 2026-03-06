import mongoose, { Schema, Document } from "mongoose";

/*
This interface represents the structure of a User document in MongoDB
TypeScript uses this for type checking
*/
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  accountStatus: "active" | "suspended";
  createdAt: Date;
  updatedAt: Date;
}

/*
Mongoose schema defines how the data is stored in MongoDB
*/
const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    passwordHash: {
      type: String,
      required: true
    },

    accountStatus: {
      type: String,
      enum: ["active", "suspended"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model<IUser>("User", userSchema);

