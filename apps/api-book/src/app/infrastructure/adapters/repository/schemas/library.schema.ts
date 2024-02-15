import { LibraryStatus } from '@bookhood/shared'
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
		status: {
			type: String,
			enum: LibraryStatus,
			default: LibraryStatus.TO_LEND,
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
		place: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
)
LibrarySchema.index({ location: '2dsphere' })
export default LibrarySchema
