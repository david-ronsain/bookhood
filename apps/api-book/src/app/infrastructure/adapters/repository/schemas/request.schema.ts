import { RequestStatus } from '@bookhood/shared'
import mongoose, { Schema } from 'mongoose'

const RequestEventSchema = new Schema(
	{
		oldStatus: {
			type: String,
			enum: RequestStatus,
		},
		currentStatus: {
			type: String,
			enum: RequestStatus,
			required: true,
		},
		oldStartDate: {
			type: String,
		},
		currentStartDate: {
			type: String,
			enum: RequestStatus,
			required: true,
		},
		oldEndDate: {
			type: String,
		},
		currentEndDate: {
			type: String,
			enum: RequestStatus,
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
	},
	{
		timestamps: false,
		versionKey: false,
	},
)

const RequestSchema = new Schema(
	{
		libraryId: {
			type: mongoose.Types.ObjectId,
			required: true,
		},
		userId: {
			type: mongoose.Types.ObjectId,
			required: true,
		},
		ownerId: {
			type: mongoose.Types.ObjectId,
			required: true,
		},
		status: {
			type: String,
			enum: RequestStatus,
			default: RequestStatus.PENDING_VALIDATION,
		},
		startDate: {
			type: Date,
		},
		endDate: {
			type: Date,
		},
		events: [RequestEventSchema],
	},
	{
		timestamps: true,
	},
)

export default RequestSchema
