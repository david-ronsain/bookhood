import { Schema } from 'mongoose'
import { Role } from '@bookhood/shared'

const UserSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
			unique: true,
			trim: true,
		},
		role: {
			type: [String],
			enum: Role,
			default: [Role.USER],
		},
	},
	{
		timestamps: true,
	}
)

export default UserSchema
