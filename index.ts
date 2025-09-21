
import express, { Express } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// --- Import the route files ---
import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
// ---------------------------------------------

// Load environment variables from .env file
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// --- Middleware Setup ---
// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); // Enables Cross-Origin Resource Sharing
app.use(helmet()); // Sets various security-related HTTP headers
app.use(morgan('dev')); // Logs HTTP requests to the console for debugging
app.use(express.json()); // Parses incoming JSON requests and puts the parsed data in req.body

// --- Root route ---
app.get('/', (req, res) => {
    res.json({
        message: 'AI Therapist Backend Server is running!',
        status: 'success',
        timestamp: new Date().toISOString(),
        availableRoutes: [
            '/api/auth - Authentication endpoints',
            '/api/chat - Chat endpoints'
        ]
    });
});

// --- Health check route ---
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// --- NEW: Connect the routes to the application ---
// Any request starting with '/api/auth' will be handled by our authRoutes.
app.use('/api/auth', authRoutes);
// Any request starting with '/api/chat' will be handled by our chatRoutes.
app.use('/api/chat', chatRoutes);
// --------------------------------------------------

// --- Database Connection ---
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error('FATAL ERROR: MONGO_URI is not defined.');
    process.exit(1);
}

mongoose.connect(mongoUri, {
        // Add MongoDB connection options to fix SSL issues
        ssl: true,
        tls: true,
        tlsAllowInvalidCertificates: true
    })
    .then(() => {
        console.log('MongoDB connected successfully.');
        // --- Start the Server ---
        // We only start the server after a successful database connection.
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
