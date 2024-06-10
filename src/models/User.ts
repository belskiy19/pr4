import { model, Schema } from "mongoose";

const userSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		avatar: { type: String },
		createdAt: { type: Date, default: Date.now },
	},
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.virtual("videos", {
	ref: "Video",
	localField: "_id",
	foreignField: "author",
});

export default model("User", userSchema);
