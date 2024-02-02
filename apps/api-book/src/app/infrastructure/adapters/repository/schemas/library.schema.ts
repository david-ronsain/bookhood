import mongoose, { Schema } from 'mongoose'

const LibrarySchema = new Schema(
	{
		userId: {
			type: mongoose.Types.ObjectId,
			required: true,
			trim: true,
		},
		bookId: {
			type: mongoose.Types.ObjectId,
			required: true,
			trim: true,
		},
		location: {
			type: {
				type: String,
				enum: ['Point'],
				default: 'Point',
			},
			coordinates: {
				type: [Number],
				default: [0, 0],
			},
		},
	},
	{
		timestamps: true,
	}
)
LibrarySchema.index({ location: '2dsphere' })
export default LibrarySchema
