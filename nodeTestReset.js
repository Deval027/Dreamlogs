// test-reset-password.js
const axios = require('axios');
const crypto = require('crypto');
const db = require('./database'); // Your MySQL connection

// Function to generate a test token
function generateTestToken() {
  const token = crypto.randomBytes(32).toString('hex');
  return token;
}

// Function to create a test user
async function createTestUser() {
  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  const username = 'testuser'
  const email = 'skyland7w7@gmail.com';
  const password = 'testpassword';
  await db.query(query, [username, email, password]);
  const userIdQuery = 'SELECT id FROM users WHERE email = ?';
  const userIdResult = await db.query(userIdQuery, [email]);
  return userIdResult[0]
}

// Function to test the /recover route
async function testRecoverRoute() {
  const userId = await createTestUser();
  const token = generateTestToken();

  // Insert the token into the password_resets table
  const query = 'INSERT INTO password_resets (user_id, reset_token, reset_token_expires) VALUES (?, ?, ?)';
  const expirationTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  await db.query(query, [userId, token, expirationTime]);

  // Send a request to the /recover route
  const response = await axios.get(`http://localhost:3000/api/recover?token=${token}`);
  console.log(response.data);
}

// Function to test the /resetpassword route
async function testResetPasswordRoute() {
    const userId = await createTestUser();
    const token = generateTestToken();
  
    // Insert the token into the password_resets table
    const query = 'INSERT INTO password_resets (user_id, reset_token, reset_token_expires) VALUES (?, ?, ?)';
    const expirationTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await db.query(query, [userId, token, expirationTime]);
  
    // Send a request to the /resetpassword route
    const newPassword = 'newtestpassword';
    const response = await axios.post('http://localhost:3000/api/resetpassword', {
        token,
        newPassword: 'newtestpassword',
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
    console.log('Response:', response);
    console.log('Response data:', response.data);
    console.log('Response status:', response.status);
  }

// Run the tests
testRecoverRoute();
testResetPasswordRoute();