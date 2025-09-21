
import { Schema, model, Document, Types } from 'mongoose';

// Interface defining the properties for a Session document
export interface ISession extends Document {
    userId: Types.ObjectId; // Links to the User model
    token: string;          // The JWT token for this session
    expiresAt: Date;        // When the token/session expires
    deviceInfo?: string;    // Optional info like user agent
}

const sessionSchema = new Schema<ISession>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    deviceInfo: { type: String },
}, { timestamps: true });

// TTL (Time To Live) Index: This is a powerful MongoDB feature.
// It automatically deletes a session document from the database when its 'expiresAt'
// time is reached. This keeps our sessions collection clean and secure.
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = model<ISession>('Session', sessionSchema);