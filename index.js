const express = require('express');
const fs = require('fs');
const { dirname } = require('path');
const app = express();
const port = 3000;


app.use(express.static('public'));

// Set the proper MIME type for CSS files
app.use((req, res, next) => {
  if (req.url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  }
  next();
});

app.get('/', (req, res) => {
    fs.readFile('views/index.html', 'utf8', (err, data) => {
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