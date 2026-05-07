import mongoose, { Schema, Document } from "mongoose";

export interface IView extends Document {
  user: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
}

const ViewSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
});

ViewSchema.index({ user: 1, post: 1 }, { unique: true });

const View = mongoose.models.View || mongoose.model<IView>("View", ViewSchema);

export default View;
