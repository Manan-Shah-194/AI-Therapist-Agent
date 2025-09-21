
import { Schema, model, Document, Types } from 'mongoose';

export interface IActivity extends Document {
    userId: Types.ObjectId;
    type: 'meditation' | 'exercise' | 'journaling' | 'other';
    name: string;
    duration?: number; // Duration in minutes
    description?: string;
}

const activitySchema = new Schema<IActivity>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // 'enum' is a validator that ensures the 'type' field can only be one
    // of the values in the array. This keeps our data clean and consistent.
    type: { type: String, required: true, enum: ['meditation', 'exercise', 'journaling', 'other'] },
    name: { type: String, required: true },
    duration: { type: Number },
    description: { type: String },
}, { timestamps: true });

export const Activity = model<IActivity>('Activity', activitySchema);
