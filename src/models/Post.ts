import mongoose, { Schema, Document } from "mongoose";
import "./User";
export interface IPost extends Document {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  tags: string[];
  author: mongoose.Types.ObjectId;
  status: "draft" | "published";
  likesCount: number;
  views: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
const PostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String },
    content: { type: String, required: true },
    coverImage: { type: String },
    tags: [{ type: String }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    likesCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);
PostSchema.index({
  title: "text",
  content: "text",
  excerpt: "text",
  tags: "text",
});
const Post = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
export default Post;
