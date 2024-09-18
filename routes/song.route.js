const express = require('express');
const multer = require('multer');
const router = express.Router();
const { Song, validateSong } = require('../models/song');
const fs = require('fs');
const path = require('path');
const { profile } = require('console');

// Ensure upload/images directory exists
const dir = path.join(__dirname);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

// storage engine 
const storage = multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
    // limits: {
    //     fileSize: 10
    // }
})

// Define your upload route
router.post('/upload', upload.single('images'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No images uploaded.');
    }
    // Build the URL of the uploaded image
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    res.send({ message: 'File uploaded successfully!', url: imageUrl });
});

function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.json({
            success: 0,
            message: err.message
        })
    }
}
router.use(errHandler);

// Create a new song
router.post('', async (req, res) => {
    // Validate the request body
    const { error } = validateSong(req.body);
    
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const { title, artist, duration,url } = req.body;
    const newSong = new Song({ title, artist, duration,url });
    await newSong.save();
    res.status(201).send(newSong);
}); 

// Get all songs
router.get('/', async (req, res) => {
    try {
        const song = await Song.find();
        res.json(song);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a song by ID
router.delete('/:id', async (req, res) => {
    await Song.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

module.exports = router;