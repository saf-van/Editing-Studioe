const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

// Initialize express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from 'uploads' folder


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/teacherNotesApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// Create a storage engine for the uploaded files using Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Destination folder for the PDF
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Naming the file based on timestamp
    }
});

const upload = multer({ storage: storage });

// Mongoose Schema for Notes
const noteSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    note: { type: String, required: true },
    subNote: { type: String },
    filePath: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Note = mongoose.model('Note', noteSchema);

const mockAuthMiddleware = (req, res, next) => {
    const role = req.query.role;
    if (!role) return res.status(400).send('Role not provided'); // Explicitly require role
    req.user = { role };
    next();
};


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Admin Routes (CRUD operations)
app.get('/admin', mockAuthMiddleware, (req, res) => {
    console.log('Role in /admin route:', req.user.role); // Log the role being checked
    if (req.user.role === 'admin') {
        res.sendFile(path.join(__dirname, 'public', 'admin.html'));
    } else {
        res.status(403).send('Access denied');
    }
});


app.get('/user', mockAuthMiddleware, (req, res) => {
    console.log('Role in /user route:', req.user.role); // Log the role being checked
    if (req.user.role === 'user') {
        res.sendFile(path.join(__dirname, 'public', 'user.html'));
    } else {
        res.status(403).send('Access denied');
    }
});



// Routes for CRUD operations for both Admin and Users
app.post('/api/notes', upload.single('file'), async (req, res) => {
    const { subject, note, subNote } = req.body;
    const filePath = req.file.path;

    const newNote = new Note({
        subject,
        note,
        subNote,
        filePath
    });

    try {
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (err) {
        res.status(400).json({ message: 'Error saving the note', error: err });
    }
});

// Get all notes (for Admin)
app.get('/api/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching notes', error: err });
    }
});

// Get notes by subject (for User)
app.get('/api/notes/:subject', async (req, res) => {
    const { subject } = req.params;
    try {
        const notes = await Note.find({ subject });
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching notes', error: err });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
