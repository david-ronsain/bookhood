import mongoose, { Schema } from 'mongoose'

const ConversationMessageSchema = new Schema(
	{
		message: {
			type: String,
			required: true,
			trim: true,
		},
		from: {
			type: mongoose.Types.ObjectId,
			required: true,
			trim: true,
		},
	},
	{
		timestamps: true,
	},
)

export default ConversationMessageSchema
