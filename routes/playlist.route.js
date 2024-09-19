const express = require('express');
const multer = require('multer');
const router = express.Router();
const { Playlist, validatePlaylist } = require('../models/playlist');
const path = require('path');
const fs = require('fs');

// Ensure the images directory exists
const uploadDir = path.join(__dirname);
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
}

// Serve uploaded images
router.use('/images', express.static(uploadDir)); // Serve from '/images'

// storage engine 
const storage = multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage });

// Define your upload route
router.post('/upload', upload.single('images'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No images uploaded.');
    }
    // Build the URL of the uploaded image
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    res.send({ message: 'File uploaded successfully!', url: imageUrl });
});

//Create Playlist
router.post('', async (req, res) => {
    // Validate the request body
    const { error } = validatePlaylist(req.body);
    
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const playlist = new Playlist(req.body);
    console.log(playlist);
    console.log(req.body);
    try {
        await playlist.save();
    
        res.status(201).json({playlist, url:"http://localhost:5000/images/images_1726643430504.png"});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Read All Users
router.get('/', async (req, res) => {
    try {
        const playlist = await Playlist.find();
        res.json(playlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Read Single User
router.get('/:id', async (req, res) => {
    console.log(req.params);
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
        res.json(playlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update User
router.patch('/:id', async (req, res) => {
    try {
        const playlist = await Playlist.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
        res.json(playlist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete User
router.delete('/:id', async (req, res) => {
    try {
        const playlist = await Playlist.findByIdAndDelete(req.params.id);
        if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
        res.status(200).json({message: "Delete successfully!"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;