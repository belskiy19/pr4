import { hash } from "@node-rs/argon2";
import { connect } from "mongoose";
import { faker } from "@faker-js/faker";
import User from "./models/User";
import Video, { VideoCategory } from "./models/Video";
import Comment from "./models/Comment";
import Like from "./models/Like";
import Subscription from "./models/Subscription";

const main = async () => {
	const mongo = await connect("mongodb://localhost:27017/test");
	console.log("Connected to MongoDB!");

	const passwordHash = await hash("password", {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});

	console.log("Create Users");
	const users: unknown[] = [];
	for (let i = 0; i < 20; i++) {
		const user = new User({
			email: faker.internet.email(),
			password: passwordHash,
			name: faker.person.firstName(),
			avatar: faker.image.avatar(),
		});

		users.push(user);
	}
	await User.insertMany(users);

	console.log("Create Videos");
	const videos: unknown[] = [];
	for (let i = 0; i < 10; i++) {
		const video = new Video({
			title: faker.lorem.words(),
			description: faker.lorem.paragraph(),
			url: faker.internet.url(),
			duration: faker.number.int({ min: 60, max: 600 }),
			thumbnailUrl: faker.image.urlPlaceholder({
				width: 640,
				height: 360,
			}),
			category: faker.helpers.arrayElement(Object.values(VideoCategory)),
			author: faker.helpers.arrayElement(users),
		});

		videos.push(video);
	}
	await Video.insertMany(videos);

	console.log("Create Comments");
	const comments: unknown[] = [];
	for (let i = 0; i < 100; i++) {
		const comment = new Comment({
			content: faker.lorem.paragraph(),
			user: faker.helpers.arrayElement(users),
			video: faker.helpers.arrayElement(videos),
		});

		comments.push(comment);
	}
	await Comment.insertMany(comments);

	console.log("Create Likes");
	const likes: unknown[] = [];
	for (let i = 0; i < 100; i++) {
		const like = new Like({
			user: faker.helpers.arrayElement(users),
			video: faker.helpers.arrayElement(videos),
		});

		likes.push(like);
	}
	await Like.insertMany(likes);

	console.log("Create Subscriptions");
	const subscriptions: unknown[] = [];
	for (let i = 0; i < 10; i++) {
		const subscription = new Subscription({
			user: faker.helpers.arrayElement(users),
			subscribedTo: faker.helpers.arrayElement(users),
		});

		subscriptions.push(subscription);
	}
	await Subscription.insertMany(subscriptions);

	console.time("count all users");
	await User.countDocuments();
	console.timeEnd("count all users");

	console.time("get 100 users with first video and count likes");
	await User.find()
		.populate({
			path: "videos",
			model: Video,
			options: {
				limit: 1,
			},
			populate: {
				path: "likeCount",
				model: Like,
			},
		})
		.limit(100);
	console.timeEnd("get 100 users with first video and count likes");

	console.time("get all videos with comments (limit 10)");
	await Video.find().populate({
		path: "comments",
		model: Comment,
		options: {
			limit: 10,
		},
	});
	console.timeEnd("get all videos with comments (limit 10)");

	console.time('create user with name "John"');
	await User.create({
		email: "johnexample@gmail.com",
		password: passwordHash,
		name: "John",
		avatar: faker.image.avatar(),
	});
	console.timeEnd('create user with name "John"');

	console.time('update user with name "John"');
	await User.updateOne({ name: "John" }, { $set: { name: "UPDATED" } });
	console.timeEnd('update user with name "John"');

	console.time("Delete user with name 'UPDATED'");
	await User.deleteOne({ name: "UPDATED" });
	console.timeEnd("Delete user with name 'UPDATED'");

	console.log("Done!");
	mongo.disconnect();
};

main().catch(console.error);
