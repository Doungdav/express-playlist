const express = require('express');
const router = express.Router();
const { Song, validateSong } = require('../models/song');
const { profile } = require('console');

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
    res.status(201).send({newSong, url:"http://localhost:5000/images/images_1726760106399.png"});
}); 

// Get all songs
router.get('/', async (req, res) => {
    try {
        const song = await Song.find();
        res.json({song, url:"http://localhost:5000/images/images_1726760106399.png"});
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