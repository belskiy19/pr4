import { model, Schema } from "mongoose";

const commentSchema = new Schema({
	video: { type: Schema.Types.ObjectId, ref: "Video", required: true },
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	content: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

export default model("Comment", commentSchema);
