import mongoose, { Schema } from 'mongoose'
import ConversationMessageSchema from './message.schema'

const ConversationSchema = new Schema(
	{
		requestId: {
			type: mongoose.Types.ObjectId,
			required: true,
			trim: true,
		},
		roomId: {
			type: mongoose.Types.UUID,
			required: true,
			trim: true,
		},
		users: {
			type: [mongoose.Types.ObjectId],
			required: true,
			trim: true,
		},
		messages: [ConversationMessageSchema],
	},
	{
		timestamps: true,
	},
)

export default ConversationSchema
