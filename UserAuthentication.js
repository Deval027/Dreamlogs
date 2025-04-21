const express = require('express');
const router = express.Router();
router.post('/register', (req, res) => {
    router.post('/register', (req, res) => {
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
            const data = JSON.stringify(req.body, null, 2);
            fs.writeFile('user.json', data, (err) => {
              if (err) {
                console.error(err);
                res.json({ success: false });
              } else {
                console.log('Data written to file');
                
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

});

router.post('/login', (req, res) => {
  // Your login code here
});

// Export the router
module.exports = router;