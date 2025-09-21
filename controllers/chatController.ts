import { Request, Response } from 'express';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';

// ✅ Use default imports from guarded model files
import Chat from '../models/Chat';
import User from '../models/user';

import mongoose from 'mongoose';

// Get API key from environment variables
const apiKey = process.env.GEMINI_API_KEY || "AIzaSyAUX93NRdIbX3Ewfpcrlytbg9f5FbxkzDI";
console.log('Using Gemini API key:', apiKey.substring(0, 5) + '...');
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Creates a new, empty chat session for a user.
 */
export const createChatSession = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const newSession = new Chat({
      userId,
      sessionId: uuidv4(),
      messages: [],
    });

    await newSession.save();

    res.status(201).json({
      message: 'New chat session created.',
      sessionId: newSession.sessionId,
    });
  } catch (error) {
    console.error('Error creating chat session:', error);
    res.status(500).json({ message: 'Server error while creating chat session.' });
  }
};

/**
 * Handles sending a message to the Gemini AI and getting a response.
 */
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { message, userId } = req.body;

    if (!message || !userId) {
      return res.status(400).json({ message: 'User ID and message are required.' });
    }

    // Find the existing chat session in the database
    const chatSession = await Chat.findOne({ sessionId, userId });
    if (!chatSession) {
      return res.status(404).json({ message: 'Chat session not found or you are not authorized.' });
    }

    // Prepare conversation history
    const history = chatSession.messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Configure and start the AI chat
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction:
        'You are Aura, a supportive and empathetic AI therapist. Your goal is to listen, understand, and provide gentle, helpful guidance. Do not give medical advice. Focus on active listening, validation, and suggesting mindfulness techniques. Keep your responses concise and caring.',
    });

    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 500,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const aiResponse = await result.response;
    const aiResponseText = aiResponse.text();

    // Save messages
    chatSession.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    chatSession.messages.push({
      role: 'assistant',
      content: aiResponseText,
      timestamp: new Date(),
    });

    await chatSession.save();

    res.status(200).json({ response: aiResponseText });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error while sending message.' });
  }
};
