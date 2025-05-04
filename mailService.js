const nodemailer = require('nodemailer');
const db = require('./database');
const crypto = require('crypto');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;


router.post('/querymail', (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'No user with that email' });
    }

    const user = results[0];

    // Create a unique token (optional: store it in DB with expiry)
    const token = crypto.randomBytes(32).toString('hex');
    const expirationTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Store the token and expiration in the password_resets table
    const insertTokenQuery = 'INSERT INTO password_resets (user_id, reset_token, reset_token_expires) VALUES (?, ?, ?)';
    db.query(insertTokenQuery, [user.id, token, expirationTime], (err) => {
      if (err) {
        console.error('Failed to store token:', err);
        return res.status(500).json({ message: 'Failed to store reset token' });
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,    
          pass: process.env.EMAIL_PASS     
        }
      });

      const recoveryLink = `http://localhost:3000/api/recover?token=${token}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Recovery',
        html: `
          <h3>Password Recovery</h3>
          <p>Hello ${user.username || ''},</p>
          <p>Click the link below to reset your password:</p>
          <a href="${recoveryLink}">${recoveryLink}</a>
          <p>If you didn’t request this, just ignore it.</p>
        `
      }; 

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('Error sending mail:', err);
          return res.status(500).json({ message: 'Email failed to send' });
        }

        res.status(200).json({ message: 'Recovery email sent successfully' });
        console.log(recoveryLink)
      });
    });
  });
});




router.get('/recover', (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }
  // Check if before doing any change
  const query = 'SELECT * FROM password_resets WHERE reset_token = ? AND reset_token_expires > NOW()';
  db.query(query, [token], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    const user = results[0];
    fs.readFile('views/ChangePassword.html', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error reading file');
      } else {
        const htmlWithToken = data.replace('%%TOKEN%%', token); // Inject token
        res.send(htmlWithToken);
      }
    });
  });
});


router.post('/resetpassword', (req, res) => {
  const { token, newPassword } = req.body;
  console.log(token, newPassword)
  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  // validate token
  const query = 'SELECT * FROM password_resets WHERE reset_token = ? AND reset_token_expires > NOW()';
  db.query(query, [token], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const userId = results[0].user_id;

    bcrypt.hash(newPassword, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error('Hashing error:', err);
        return res.status(500).json({ message: 'Error hashing password' });
      }
    
      const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
      db.query(updateQuery, [hashedPassword, userId], (err) => {
        if (err) {
          console.error('Failed to update password:', err);
          return res.status(500).json({ message: 'Failed to update password' });
        }
    
        // Delete the reset token
        const deleteTokenQuery = 'DELETE FROM password_resets WHERE reset_token = ?';
        db.query(deleteTokenQuery, [token], (err) => {
          if (err) {
            console.error('Failed to delete token:', err);
          }
        });
    
        res.status(200).json({ message: 'Password reset successfully' });
      });
    });
  });
});


module.exports = router;