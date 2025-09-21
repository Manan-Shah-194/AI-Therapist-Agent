import mongoose, { Schema, Document } from 'mongoose';

// Interface for the Chat document
export interface IChat extends Document {
  userId: mongoose.Types.ObjectId;
  sessionId: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Schema for the Chat model
const ChatSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    sessionId: {
      type: String,
      required: true,
      unique: true
    },
    messages: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant'],
          required: true
        },
        content: {
          type: String,
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

// Create and export the Chat model
export const Chat = mongoose.model<IChat>('Chat', ChatSchema);
export default Chat;