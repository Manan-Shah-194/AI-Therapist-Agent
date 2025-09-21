import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { Session } from '../models/session';

/**
 * Handles new user registration.
 */
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        // 1. Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email, and password.' });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        // 3. Create and save the new user (password will be hashed by pre-save hook)
        const newUser = new User({
            username: name, // Map name to username field
            email,
            password: password, // The pre-save hook will hash this automatically
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully.' });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

/**
 * Handles user login.
 */
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password.' });
        }

        // 2. Find the user in the database (explicitly select password field)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' }); // Generic message for security
        }

        // 3. Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password || '');
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // 4. If credentials are correct, create a JSON Web Token (JWT)
        const payload = { userId: user._id };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' } // Token expires in 1 day
        );
        
        // 5. Create a session document in the database
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 1); // Session also expires in 1 day

        await new Session({
            userId: user._id,
            token,
            expiresAt,
            deviceInfo: req.headers['user-agent'] // Optional: store user agent
        }).save();


        // 6. Send the token and user info back to the client
        res.status(200).json({
            message: 'Login successful.',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};