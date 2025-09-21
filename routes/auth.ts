import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';

// Create a new router instance. A router is like a mini-application,
// capable only of performing routing and middleware functions.
const router = Router();

// Define the route for user registration.
// When a POST request is made to '/register', the 'registerUser' function from our controller will be executed.
router.post('/register', registerUser);

// Define the route for user login.
// When a POST request is made to '/login', the 'loginUser' function from our controller will be executed.
router.post('/login', loginUser);

// Export the router so we can use it in our main index.ts file.
export default router;
