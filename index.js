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
const recoveryRoutes = require('./mailService.js'); 
const userSettings = require('./userSettings.js');

//websockets

const wss = new WebSocket.Server({ port: 8080 });
const clients = new Set(); 
wss.on('connection', (ws) => {
    clients.add(ws);
    ws.on('close', () => {
        clients.delete(ws); 
    });
});

//database connection
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
app.use(express.urlencoded({ extended: true }));

app.use('/api',recoveryRoutes)
app.use(userSettings)


app.post('/register', (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const selectUsernameQuery = 'SELECT * FROM users WHERE username = ?';
  const selectEmailQuery = 'SELECT * FROM users WHERE email = ?';

  db.query(selectUsernameQuery, [username], (err, usernameResults) => {
    if (err) {
      console.error('Error checking username:', err);
      return res.status(500).send();
    }
    if (usernameResults.length > 0) {
      console.log('Username already exists');
      return res.json({ usernameExists: true });
    }
    db.query(selectEmailQuery, [email], (err, emailResults) => {
      if (err) {
        console.error('Error checking email:', err);
        return res.status(500).send();
      }
      if (emailResults.length > 0) {
        console.log('Email already in use');
        return res.json({ emailExists: true });
      }
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          return res.json({ success: false });
        }
        const insertQuery = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
        db.query(insertQuery, [username, hashedPassword, email], (err, result) => {
          if (err) {
            console.error('Error inserting user:', err);
            return res.json({ success: false });
          }
          console.log('User registered successfully');
          return res.json({ success: true });
        });
      });
    });
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
          console.log('Dream deleted with id:',dreamId)
      } else {
          res.status(200).send();
      }
  });
});

app.put('/api/updateDream/:dreamid', (req, res) => {
  const dreamId = req.params.dreamid;
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'Description is required.' });
  }

  const query = 'UPDATE dreams SET description = ? WHERE dreamid = ?';
  db.query(query, [description, dreamId], (err, result) => {
    if (err) {
      console.error('Error updating dream:', err);
      return res.status(500).json({ error: 'Failed to update dream.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Dream not found.' });
    }

    res.json({ message: 'Dream updated successfully.' });
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
              <label for="new-username">New Username:</label><br>
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
              <label for="new-password">New password:</label><br>
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