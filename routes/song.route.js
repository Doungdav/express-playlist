const express = require('express');
//const multer = require('multer');
const router = express.Router();
const { Song, validateSong } = require('../models/song');
//const fs = require('fs');





// Create a new song
router.post('', async (req, res) => {
    // Validate the request body
    const { error } = validateSong(req.body);
    
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const { title, artist, duration } = req.body;
    const newSong = new Song({ title, artist, duration });
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