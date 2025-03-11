//TODO: fix error when submitting dream if spaces are empty it crashes the server
const express = require('express');
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
//websockets
const wss = new WebSocket.Server({ port: 8080 });
const clients = new Set(); 
wss.on('connection', (ws) => {
    clients.add(ws);
    ws.on('close', () => {
        clients.delete(ws); 
    });
});

//basic config
//user session for testing and devlopment remove when finished
const MySQLStore = require('connect-mysql')(session);
const options = {
  config: {
    user: 'root',
    password: 'admin',
    database: 'dreamlogs'
  }
};


app.use(session({
  secret: 'session_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: new MySQLStore(options)
}));
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
    fs.readFile('views/login.html', 'utf8', (err, data) => {
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
    res.redirect('/login');
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
            res.json({ success: true });
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
  const sql = 'SELECT * FROM users WHERE username = ?';

  db.query(sql, [username], (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ success: false, error: 'Server error' });
      }

      if (results.length > 0) {
          const user = results[0];
          bcrypt.compare(password, user.password, (err, match) => {
              if (err) {
                  console.error(err);
                  return res.status(500).json({ success: false, error: 'Server error' });
              }

              if (match) {
                  req.session.userId = user.id;
                  console.log('User logged in:', user.id);
                  return res.json({ success: true, redirect: '/home.html' }); // ✅ Return success
              } else {
                  console.log('Invalid username or password');
                  sendReloadMessage();
                  return res.json({ success: false }); // ❌ Login failed
              }
          });
      } else {
          console.log('Invalid username or password');
          sendReloadMessage();
          return res.json({ success: false }); // ❌ User not found
      }
  });
});

// Function to send a reload message to all connected WebSocket clients
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
  db.query('SELECT username FROM users WHERE Id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send the userId and username to the client
    res.json({ userId: userId, username: results[0].username });
  });
});

app.post('/dreampost', (req, res) => {
  const { NameInput, dayInput, monthInput, yearInput, typeD, clarity, DreamDescription, userId } = req.body;
  const query = 'INSERT INTO dreams (dream_name, date, type_of_dream, clarity, description, userid) VALUES (?, ?, ?, ?, ?, ?)';
  const date = `${yearInput}-${monthInput}-${dayInput}`;
  db.query(query, [NameInput, date, typeD, clarity, DreamDescription, userId], (err, result) => {
    if (err) throw err;
    var dreamId = result.insertId;
    module.exports = dreamId;
    console.log('Data inserted into database');
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

  // Query to get the username
  const userQuery = 'SELECT username FROM users WHERE Id = ?';
  // Query to count the posts
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

      // Send the userId, username, and postCount to the client
      res.json({ userId: userId, username: username, postCount: postCount });
    });
  });
});

app.get('/CUsername', (req, res) => {
  res.send(`
      <div id="form-container">
          <h2>Change Username</h2>
          <form id="submitForm" action="/submit-username" method="post">
              <label for="new-username">New Username:</label>
              <input type="text" id="new-username" name="username" required><br><br>
              <button type="change username">Submit</button>
          </form>
      </div>
  `);
});

app.get('/CPassword', (req, res) => {
  res.send(`
      <div id="form-container">
          <h2>Change Password</h2>
          <form id="submitForm" action="/submit-password" method="post">
              <label for="new-password">New Password:</label>
              <input type="password" id="new-password" name="password" required><br><br>
              <button type="submit">Change password</button>
          </form>
      </div>
  `);
});

app.get('/deleteAccount', (req, res) => {
  res.send(`
      <div id="form-container">
          <h2>Delete Account</h2>
          <form id="submitForm" action="/submit-delete-account" method="post">
              <label for="confirm">Your account will be permanently deleted, are you sure?</label>
              <a href='submit-delete-account'>Delete</a>
          </form>
      </div>
  `);
});

// Routes to handle form submissions
app.post('/submit-username', (req, res) => {
  const username = req.body.username;
  console.log(`New Username: ${username}`);
  res.send(`Username updated to: ${username}`);
});

app.post('/submit-password', (req, res) => {
  const password = req.body.password;
  console.log(`New Password: ${password}`);
  res.send(`Password updated successfully.`);
});

app.get('/submit-delete-account', (req, res) => {
    const userId = req.session.userId;
    db.beginTransaction((transactionError) => {
      if (transactionError) {
        console.error('Transaction error:', transactionError);
        res.status(500).send('An error occurred while starting the transaction.');
        return;
      }

      // First, delete related records from the dreams table
      const deleteDreamsQuery = 'DELETE FROM dreams WHERE userid = ?';
      db.query(deleteDreamsQuery, [userId], (dreamsError, dreamsResults) => {
        if (dreamsError) {
          db.rollback(() => {
            console.error('Error deleting related dreams:', dreamsError);
            res.status(500).send('An error occurred while deleting related dreams.');
          });
          return;
        }

        // Now, delete the user
        const deleteUserQuery = 'DELETE FROM users WHERE id = ?';
        db.query(deleteUserQuery, [userId], (userError, userResults) => {
          if (userError) {
            dbrollback(() => {
              console.error('Error deleting account:', userError);
              res.status(500).send('An error occurred while deleting the account.');
            });
          } else if (userResults.affectedRows === 0) {
            db.rollback(() => {
              res.status(404).send('Account not found.');
            });
          } else {
            db.commit((commitError) => {
              if (commitError) {
                db.rollback(() => {
                  console.error('Commit error:', commitError);
                  res.status(500).send('An error occurred while committing the transaction.');
                });
              } else {
                console.log('Account deleted');
                res.redirect('/');
              } 
            });
          }
        });
      });
    });
});