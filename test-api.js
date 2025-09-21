// Simple script to test the chat API
// For Node.js v18+ we can use the built-in fetch API
// For older Node.js versions, we need to import node-fetch properly
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BASE_URL = 'http://localhost:3001';

// Simple test to check if the server is running
async function testServerConnection() {
  try {
    console.log("Testing connection to server at", BASE_URL);
    
    // Test registration endpoint
    console.log("\n1. Testing user registration:");
    const uniqueEmail = `test${Date.now()}@example.com`;
    const registerResponse = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: uniqueEmail,
        password: 'password123'
      }),
    });
    
    const registerData = await registerResponse.json();
    console.log('Registration response:', registerData);
    
    // Wait a moment to ensure registration is processed
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test login endpoint
    console.log("\n2. Testing user login with the same email:");
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'password123'
      }),
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (loginData.token && loginData.user && loginData.user.id) {
      console.log("✅ Authentication working correctly");
      
      // Test chat session creation
      console.log("\n3. Testing chat session creation:");
      const sessionResponse = await fetch(`${BASE_URL}/api/chat/session`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.token}`
        },
        body: JSON.stringify({ userId: loginData.user.id }),
      });
      
      const sessionData = await sessionResponse.json();
      console.log('Session creation response:', sessionData);
      
      if (sessionData.sessionId) {
        console.log("✅ Chat session created successfully");
        
        // Test sending a message
        console.log("\n4. Testing message sending:");
        const messageResponse = await fetch(`${BASE_URL}/api/chat/${sessionData.sessionId}/message`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginData.token}`
          },
          body: JSON.stringify({ 
            message: "Hello, I'm feeling anxious today. Can you help me?",
            userId: loginData.user.id
          }),
        });
        
        const messageData = await messageResponse.json();
        console.log('AI Response:', messageData);
        
        if (messageData.response) {
          console.log("✅ Message sent and received response successfully");
        }
      }
    }
    
    console.log("\nTest completed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test
testServerConnection();