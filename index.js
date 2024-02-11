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
  secret: 'session',
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore(options),
  cookie: { maxAge: 60000 }  
}));
//user session for testing and devlopment remove when finished
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
  // If the user is not logged in, redirect them to the login page
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
          const userId = user.id;
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
app.post('/dreampost', (req, res) => {
  const { NameInput, dayInput, monthInput, yearInput, typeD, clarity, DreamDescription, userId } = req.body;
  const query = 'INSERT INTO dreams (title, date, type, clarity, description, userId) VALUES (?, ?, ?, ?, ?, ?)';
  const date = `${dayInput}-${monthInput}-${yearInput}`;

  db.query(query, [NameInput, date, typeD, clarity, DreamDescription, userId], (err, result) => {
    if (err) throw err;
    const dreamId = result.insertId;
    module.exports = dreamId;
    // You can now use dreamId for your button id
    res.redirect('/home'); 
  });
});
