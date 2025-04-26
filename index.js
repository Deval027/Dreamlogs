const express = require('express');
require('dotenv').config();
const fs = require('fs');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
let formData = {};
const db = require('./database');
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require('path');
const cookieParser = require('cookie-parser');
const { defaultMaxListeners } = require('events');
const { error } = require('console');
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'views')));
const WebSocket = require('ws');
const util = require('util');
db.query = util.promisify(db.query);
db.beginTransaction = util.promisify(db.beginTransaction);
db.commit = util.promisify(db.commit);
db.rollback = util.promisify(db.rollback);

//websockets

const wss = new WebSocket.Server({ port: 8080 });
const clients = new Set(); 
wss.on('connection', (ws) => {
    clients.add(ws);
    ws.on('close', () => {
        clients.delete(ws); 
    });
});

//database conn

const MySQLStore = require('connect-mysql')(session);
const options = {
  config: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'dreamlogs',
    ssl: false
  }
};


app.use(session({
  secret: 'session_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: new MySQLStore(options)
}));
//start server port
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/submit', (req, res) => {
  formData = req.body;
  console.log(formData);
  res.redirect('/');
});

app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/home');
  } else {
    fs.readFile('views/login2.html', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error reading file');
      } else {
        res.send(data);
      }
    });
  }
});

app.get('/home', (req, res) => {
  if (!req.session.userId) {
    res.redirect('/');
  } else {
    fs.readFile('views/home.html', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error reading file');
      } else {
        res.send(data);
      }
    });
  }
});
app.get('/profile', (req, res) => {
  if (!req.session.userId) {
    res.redirect('/');
  } else {
    fs.readFile('views/profile.html', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error reading file');
      } else {
        res.send(data);
      }
    });
  }
});

app.get('/getFormData', (req, res) => {
  res.json(formData);
  res.end();
});
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/register', (req, res) => {
const username = req.body.username;
const selectQuery = 'SELECT * FROM users WHERE username = ?';
db.query(selectQuery, [username], (err, results) => {
  if (err) {
    console.error(err);
    res.status(500).send();
  } else if (results.length > 0) {
    res.json({ usernameExists: true });
    console.log('Username already exists');
  } else {
    bcrypt.hash(req.body.password, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error(err);
        res.json({ success: false });
      } else {
        const sql = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
        db.query(sql, [req.body.username, hashedPassword, req.body.email], (err, result) => {
          if (err) {
            console.error(err);
            res.json({ success: false });
          } else {
            console.log('Data inserted into database');
            res.json({ success: true});
          }
        });
      }
    });
  };
});
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  console.log(`Login attempt: Username = ${username}, Password = ${password}`);

  const sql = 'SELECT * FROM users WHERE username = ?';

  db.query(sql, [username], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ success: false, error: 'Server error' });
      }
      console.log('Database results:', results); 
      if (results.length > 0) {
          const user = results[0];
          console.log('User found:', user);

          bcrypt.compare(password, user.password, (err, match) => {
              if (err) {
                  console.error('Bcrypt error:', err);
                  return res.status(500).json({ success: false, error: 'Server error' });
              }

              console.log('Password match:', match);

              if (match) {
                  req.session.userId = user.id;
                  console.log('User logged in successfully:', user.id);
                  return res.json({ success: true, redirect: '/home.html' });
              } else {
                  console.log('Incorrect password');
                  return res.json({ success: false, reload: true });
              }
          });
      } else {
          console.log('Invalid username: User not found');
          return res.json({ success: false, reload: true });
      }
  });
});

function sendReloadMessage() {
  clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ action: 'reload', message: 'Invalid login! Page will reload.' }));
      }
  });
}

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      res.status(500).send();
    } else {
      res.redirect('/'); 
      console.log("Sesion destruida")
    }
  });
});
app.get('/api/userId', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const userId = req.session.userId; 
  db.query('SELECT username FROM users WHERE Id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ userId: userId, username: results[0].username });
  });
});


app.post('/dreampost', (req, res) => {
  const { NameInput, dayInput, monthInput, yearInput, typeD, DreamDescription, userId } = req.body;

  if (!NameInput || !dayInput || !monthInput || !yearInput || !typeD || !DreamDescription || !userId) {
    return res.redirect('/home');
  }
  const date = `${yearInput}-${monthInput}-${dayInput}`;
  if (isNaN(new Date(date))) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  const query = 'INSERT INTO dreams (dream_name, date, type_of_dream, description, userid) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [NameInput, date, typeD, DreamDescription, userId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to save dream' });
    }

    const dreamId = result.insertId;
    console.log('Data inserted into database with dreamId:', dreamId);

    res.redirect('/home');
  });
});

app.get('/api/dreams', (req, res) => {
  const query = 'SELECT * FROM dreams WHERE userid = ? ORDER BY created_at DESC';
  db.query(query, [req.session.userId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send();
    } else {
      res.json(results);
    }
  });
});

app.delete('/api/deleteDream/:dreamId', (req, res) => {
  const dreamId = req.params.dreamId;

  const query = 'DELETE FROM dreams WHERE dreamid = ?';
  db.query(query, [dreamId], (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).send();
      } else {
          res.status(200).send();
      }
  });
});
app.get('/userLogs', (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(400).json({ error: 'User ID not found in session' });
  }

  const userQuery = 'SELECT username FROM users WHERE Id = ?';
  const postCountQuery = 'SELECT COUNT(*) AS postCount FROM dreams WHERE userId = ?';

  db.query(userQuery, [userId], (userErr, userResults) => {
    if (userErr) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    if (userResults.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const username = userResults[0].username;

    db.query(postCountQuery, [userId], (postErr, postResults) => {
      if (postErr) {
        return res.status(500).json({ error: 'Database query failed' });
      }

      const postCount = postResults[0].postCount;

      res.json({ userId: userId, username: username, postCount: postCount });
    });
  });
});

//Server sends html form so the client can handle only one form at a time
app.get('/CUsername', (req, res) => {
  res.send(`
      <div id="form-container">
          <h2>Change Username</h2>
          <form id="submitForm" action="/submitUsername" method="post">
              <label for="new-username">New Username:</label>
              <input type="text" class="newUser" id="new-username" name="username" required><br><br>
              <button class="sub" type="change username">Submit</button>
          </form>
      </div>
  `);
});

app.get('/CPassword', (req, res) => {
  res.send(`
      <div id="form-container">
          <h2>Change Password</h2>
          <form id="submitPsw">
              <label for="Currentpsw">Current password:</label><br>
              <input type="password" id="password" class="newPass" name="password" required><br>
              <label for="new-password">New password:</label>
              <input class="newPass" type="password" id="new-password" name="password" required><br><br>
              <button type="submit" class="sub">Change password</button>
          </form>
      </div>
  `);
});

app.get('/deleteAccount', (req, res) => {
  res.send(`
      <div id="formContainer">
        <h2>Delete Account</h2>
        <form id="deleteForm" method="post" action="/submit-delete-account">
          <label for="confirm">Your account will be permanently deleted. Are you sure?</label>
          <button type="button" class="delete" id="deleteBtn">Delete</button>
        </form>
      </div>
  `);
});

//This section handles the settings module
app.post('/submitUsername', (req, res) => {
  const { newUsername } = req.body; 
  const userId = req.session.userId;
  const selectQuery = 'SELECT * FROM users WHERE username = ?';
  console.log(userId, newUsername)
  if (!userId || !newUsername) {
    return res.status(400).send("");
  }
  db.query(selectQuery, [newUsername], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send();
    } else if (results.length > 0) {
      console.log('Username already exists');
      return res.status(200).json({ success: true, message: 'Username already exist' });
    }else{
      const query = "UPDATE users SET username = ? WHERE Id = ?";

  db.query(query, [newUsername, userId], (err, result) => {
    if (err) {
      console.error("Error updating username:", err);
      return res.status(500).send("Database update failed.");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("User not found or username unchanged.");
    }

    console.log(`User ID ${userId}: Username updated to ${newUsername}`);
    return res.status(200).json({ success: true, message: 'Username updated succesfully!' });
  });
    }
  })
});


app.post('/submit-password', (req, res) => {
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



app.post('/submit-delete-account', async (req, res) => {
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
