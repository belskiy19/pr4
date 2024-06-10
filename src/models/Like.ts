import { model, Schema } from "mongoose";

const likeSchema = new Schema({
	video: { type: Schema.Types.ObjectId, ref: "Video", required: true },
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	createdAt: { type: Date, default: Date.now },
});

export default model("Like", likeSchema);
