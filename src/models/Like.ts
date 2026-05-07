import mongoose, { Schema, Document } from "mongoose";
export interface ILike extends Document {
  user: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
}
const LikeSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
});
LikeSchema.index({ user: 1, post: 1 }, { unique: true });
const Like = mongoose.models.Like || mongoose.model<ILike>("Like", LikeSchema);
export default Like;
