import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// This is a TypeScript interface. It tells us what properties a User object will have.
export interface IUser extends Document {
    username: string;
    email: string;
    password?: string; // The '?' makes it optional, as we won't always send it back.
}

// This is the Mongoose Schema. It defines the structure for MongoDB.
const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // 'select: false' is a crucial security feature. It prevents the password
    // from being sent back in queries by default.
    password: { type: String, required: true, select: false }, 
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt' fields.

// This is a "pre-save hook". Before a user document is saved, this function
// will run to hash the password. This ensures we never store plain-text passwords.
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Create and export the User model
export const User = model<IUser>('User', userSchema);
export default User;