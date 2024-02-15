import { Schema } from 'mongoose'

const BookSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		authors: {
			type: [String],
			required: true,
			trim: true,
		},
		categories: {
			type: [String],
			default: [],
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		language: {
			type: String,
			required: true,
			trim: true,
		},
		subtitle: {
			type: String,
			trim: true,
		},
		publisher: {
			type: String,
			trim: true,
		},
		publishedDate: {
			type: String,
			trim: true,
		},
		image: {
			thumbnail: {
				type: String,
				trim: true,
			},
			smallThumbnail: {
				type: String,
				trim: true,
			},
		},
		isbn: [
			{
				_id: false,
				type: {
					type: String,
				},
				identifier: {
					type: String,
				},
			},
		],
	},
	{
		timestamps: true,
	},
)

export default BookSchema
