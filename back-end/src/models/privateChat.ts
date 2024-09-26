import mongoose from 'mongoose';
import { IUser } from './user';
import { IMessage } from './message';

export interface IPrivateChat {
	participants: IUser[];
	messages: IMessage[];
}

const messageSchema = new mongoose.Schema<IMessage>({
	id: {
		type: String,
		required: [true, 'Message ID is required']
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	message: {
		type: String,
		required: [true, 'Message content is required'],
		trim: true,
		minlength: [1, 'Message should be at least 1 character long'],
		maxlength: [1000, 'Message should be at most 1000 characters long']
	},
	timestamp: {
		type: Date,
		default: Date.now
	}
});

// ? Define the private chat schema with embedded messages
const privateChatSchema = new mongoose.Schema<IPrivateChat>(
	{
		participants: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User'
				}
			],
			validate: [
				{
					validator: (v: mongoose.Types.ObjectId[]) => v.length === 2,
					message: 'A private chat must have exactly 2 participants.'
				}
			],
			required: true
		},
		messages: {
			type: [messageSchema],
			default: []
		}
	},
	{ timestamps: true }
);

const PrivateChat = mongoose.model<IPrivateChat>('PrivateChat', privateChatSchema);

export { PrivateChat };