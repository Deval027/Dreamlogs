const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
let formData = {};
const db = require('./database');
const session = require('express-session');
app.use(express.static('public'));
app.get('/', (req, res) => {
  fs.readFile('views/login.html', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading file');
    } else {
      res.send(data);
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.use(session({
  secret: 'session',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 } // Cookie expires after 60000 milliseconds = 1 minute
}));

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
    } else {
      // Convert data to JSON and write to a file
      const data = JSON.stringify(req.body, null, 2);
      fs.writeFile('user.json', data, (err) => {
        if (err) {
          console.error(err);
          res.json({ success: false });
        } else {
          console.log('Data written to file');
          
          // Insert data into database
          const sql = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
          db.query(sql, [req.body.username, req.body.password, req.body.email], (err, result) => {
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
    }
  });
});
app.post('/login', (req, res) => {
  // Authenticate user
  // ...

  // If authenticated, save user ID in session
  req.session.userId = user.id;
});

app.get('/dashboard', (req, res) => {
  // Check if user is logged in
  if (req.session.userId) {
    // User is logged in, display dashboard
  } else {
    // User is not logged in, redirect to login page
    res.redirect('/login');
  }
});
