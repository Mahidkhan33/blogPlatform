import mongoose, { Schema, Document } from "mongoose";
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  bio?: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}
const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
    bio: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
