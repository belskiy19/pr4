import { model, Schema } from "mongoose";

const subscriptionSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	subscribedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
	createdAt: { type: Date, default: Date.now },
});

export default model("Subscription", subscriptionSchema);
