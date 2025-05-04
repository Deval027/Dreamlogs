const express = require('express');
const router = express.Router();
const db = require('./database');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const util = require('util');
db.query = util.promisify(db.query);
db.beginTransaction = util.promisify(db.beginTransaction);
db.commit = util.promisify(db.commit);
db.rollback = util.promisify(db.rollback);
//This section handles the settings module
router.post('/submitUsername', async (req, res) => {
    const { newUsername } = req.body; 
    const userId = req.session.userId;
  
    if (!userId || !newUsername) {
      return res.status(400).send("");
    }
  
    try {
      const existingUser = await db.query('SELECT * FROM users WHERE username = ?', [newUsername]);
      if (existingUser.length > 0) {
        return res.status(200).json({ success: true, message: 'Username already exist' });
      }
  
      const result = await db.query('UPDATE users SET username = ? WHERE Id = ?', [newUsername, userId]);
      if (result.affectedRows === 0) {
        return res.status(404).send("User not found or username unchanged.");
      }
  
      console.log(`User ID ${userId}: Username updated to ${newUsername}`);
      return res.status(200).json({ success: true, message: 'Username updated successfully!' });
    } catch (err) {
      console.error("Error updating username:", err);
      res.status(500).send("Database update failed.");
    }
  });
  
  
  
router.post('/submit-password', (req, res) => {
    const { newPassword, currentPassword } = req.body;
    const userId = req.session.userId;
    console.log(userId, newPassword, currentPassword)
    if (!newPassword || !userId || !currentPassword) {
      return res.status(400).send("Missing required fields.");
    }
  
    const sql = 'SELECT * FROM users WHERE id = ?';
  
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, error: 'Server error' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      
      const user = results[0];
      console.log('User found:');
  
      bcrypt.compare(currentPassword, user.password, (err, match) => {
        if (err) {
          console.error('Bcrypt error:', err);
          return res.status(500).json({ success: false, error: 'Server error' });
        }
  
        if (!match) {
          return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }
  
        bcrypt.hash(newPassword, saltRounds, (err, hashedPassword) => {
          if (err) {
            console.error('Hashing error:', err);
            return res.status(500).json({ success: false, error: 'Error hashing password' });
          }
  
          const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
          db.query(updateQuery, [hashedPassword, userId], (err, result) => {
            if (err) {
              console.error('Error updating password:', err);
              return res.status(500).json({ success: false, error: 'Database update failed' });
            }
            if (result.affectedRows === 0) {
              return res.status(404).json({ success: false, error: 'User not found or password unchanged' });
            } else {
              console.log("Password updated to: ", newPassword);
              return res.status(200).json({ success: true, message: 'Password updated successfully!' });
            }
          });
        });
      });
    });
  });
  
  
  
router.post('/submit-delete-account', async (req, res) => {
    const userId = req.session.userId;
    const { password } = req.body;

    try {
    const results = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

    if (results.length === 0) {
    return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
    return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    // Password correct: start transaction
    await db.beginTransaction();

    await db.query('DELETE FROM dreams WHERE userid = ?', [userId]);
    const deleteUserResult = await db.query('DELETE FROM users WHERE id = ?', [userId]);

    if (deleteUserResult.affectedRows === 0) {
    await db.rollback();
    return res.status(404).send('Account not found.');
    }

    await db.commit();
    console.log('Account deleted successfully');
    req.session.destroy(err => {
        if (err) console.error('Session destruction error:', err);
      });
    res.redirect('/logout');

    } catch (err) {
    console.error('Error:', err);
    try {
    await db.rollback();
    } catch (rollbackErr) {
    console.error('Rollback error:', rollbackErr);
    }
    res.status(500).send('An error occurred while deleting the account.');
    }
});
  
  //End of settings module
  module.exports = router;