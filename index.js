const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs'); 

// parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

// Function to read files from the ./files directory
app.get("/", function(req, res) {
    fs.readdir('./files', function(err, files) {
        if (err) {
            return res.status(500).send('Error reading directory');
        }
        res.render('index', { files });
    });
});

// Function to create a new file
app.post("/create", function(req, res) {
    const filename = req.body.title.split(' ').join('_'); // Replace spaces with underscores in filename
    fs.writeFile(`./files/${filename}`, req.body.details, function(err) {
        if (err) {
            return res.status(500).send('Error writing file');
        }
        res.redirect("/");
    });
});

// Function to display file content on the show page
app.get('/file/:filename', function(req, res) {
    fs.readFile(`./files/${req.params.filename}`, 'utf-8', function(err, filedata) {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        res.render('show', { filename: req.params.filename, filedata: filedata });
    });
});

// Function to delete a file and mark task as done
app.post('/delete/:filename', function(req, res) {
    const filename = req.params.filename;
    const filepath = `./files/${filename}`;

    fs.unlink(filepath, function(err) {
        if (err) {
            return res.status(500).send('Error deleting file');
        }
        res.redirect('/');
    });
});

// Start server
app.listen(3000, function() {
    console.log("Running on 3000");
});
