import { Router } from 'express';
import { createChatSession, sendMessage } from '../controllers/chatController';

// Create a new router instance for chat-related routes.
const router = Router();

// Define the route to create a new chat session.
// When a POST request is made to '/session', the 'createChatSession' function will be executed.
router.post('/session', createChatSession);

// Define the route to send a message within a specific session.
// The ':sessionId' is a URL parameter, allowing us to specify which session we're sending a message to.
// Example: POST /api/chat/1234-abcd-5678/message
// When a POST request is made to this URL, the 'sendMessage' function will be executed.
router.post('/:sessionId/message', sendMessage);

// Export the router to be used in our main index.ts file.
export default router;
