const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.use(express.static('public'));
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

// This object will store the form data
let formData = {};

app.use(bodyParser.urlencoded({ extended: true }));


app.post('/submit', (req, res) => {
    // Store the form data in the formData object
    formData = req.body;
    console.log(formData);
    res.redirect('/');
});

app.get('/getFormData', (req, res) => {
    res.json(formData);
    res.end();
});
