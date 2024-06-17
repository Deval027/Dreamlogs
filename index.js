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
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'views')));
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
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/submit', (req, res) => {
  formData = req.body;
  console.log(formData);
  res.redirect('/');
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
      res.status(500).send();
    } else if (results.length > 0) {
      const user = results[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send();
        } else if (result) {
          userId = user.id; 
          req.session.userId = userId;
          console.log('User logged in');
          res.redirect('/home.html');
          console.log(userId);
        } else {
          console.log('Invalid username or password');
        }
      });
    } else {
      console.log('Invalid username or password');
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
              <button type="submit">Submit</button>
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
              <button type="submit">Submit</button>
          </form>
      </div>
  `);
});

app.get('/deleteAccount', (req, res) => {
  res.send(`
      <div id="form-container">
          <h2>Delete Account</h2>
          <form id="submitForm" action="/submit-delete-account" method="post">
              <label for="confirm">Type "DELETE" to confirm:</label>
              <input type="text" id="confirm" name="confirm" required><br><br>
              <button type="submit">Delete</button>
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

app.post('/submit-delete-account', (req, res) => {
  const confirmation = req.body.confirm;
  if (confirmation === 'DELETE') {
      console.log('Account deleted');
      res.send('Account deleted successfully.');
  } else {
      res.send('Account deletion failed. Incorrect confirmation.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});