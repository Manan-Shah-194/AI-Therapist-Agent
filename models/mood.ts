import { Schema, model, Document, Types } from 'mongoose';

export interface IMood extends Document {
    userId: Types.ObjectId;
    score: number; // e.g., a score from 0 to 100
    note?: string; // Optional notes from the user
}

const moodSchema = new Schema<IMood>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // We add validators to ensure the score is always within a valid range.
    score: { type: Number, required: true, min: 0, max: 100 },
    note: { type: String },
}, { timestamps: true });

export const Mood = model<IMood>('Mood', moodSchema);