import { model, Schema } from "mongoose";

export enum VideoCategory {
	CarsAndTransportation = "Cars and Transportation",
	CommunityAndActivism = "Community and Activism",
	Humor = "Humor",
	PetsAndWildlife = "Pets and Wildlife",
	Games = "Games",
	TutorialsAndStyle = "Tutorials and Style",
	PeopleAndBlogs = "People and Blogs",
	Music = "Music",
	ScienceAndTechnology = "Science and Technology",
	NewsAndPolitics = "News and Politics",
	Education = "Education",
	TravelAndEvents = "Travel and Events",
	Entertainment = "Entertainment",
	Sports = "Sports",
	MoviesAndAnimation = "Movies and Animation",
}

const videoSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		url: { type: String, required: true },
		duration: { type: Number, required: true },
		thumbnailUrl: { type: String, required: true },
		category: { type: String, enum: VideoCategory },
		author: { type: Schema.Types.ObjectId, ref: "User", required: true },
		createdAt: { type: Date, default: Date.now },
	},
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

videoSchema.virtual("comments", {
	ref: "Comment",
	localField: "_id",
	foreignField: "video",
});

videoSchema.virtual("likes", {
	ref: "Like",
	localField: "_id",
	foreignField: "video",
});

videoSchema.virtual("likeCount", {
	ref: "Like",
	localField: "_id",
	foreignField: "video",
	count: true,
});

export default model("Video", videoSchema);
