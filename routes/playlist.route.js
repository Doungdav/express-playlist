const express = require('express');
//const multer = require('multer');
const router = express.Router();
const Playlist = require('../models/playlist');
//const path = require('path');

// Set up storage for images
/*const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'D:/playlistjs/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
    },
});*/

/*const upload = multer({ storage });

router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    console.log('File uploaded:', req.file);
    res.send('File uploaded successfully.');
});*/


//Create Playlist
router.post('', async (req, res) => {
    const playlist = new Playlist(req.body);
    console.log(playlist);
    console.log(req.body);
    try {
        await playlist.save();
    
        res.status(201).json(playlist);
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