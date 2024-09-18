const express = require('express');
const {PlaylistSong, validatePlaylistSong} = require('../models/playlist_song');
const router = express.Router();

// Add a song to a playlist
router.post('/songs/:songId', async (req, res) => {
    const { error } = validatePlaylistSong(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const playlistSong = new PlaylistSong(req.body);
        await playlistSong.save();
        res.status(201).send(playlistSong);
    } catch (err) {
        res.status(500).send('Something went wrong: ' + err.message);
    }
});

// Get songs in a playlist
router.get('/:playlistId', async (req, res) => {
    const songs = await PlaylistSong.find({ playlist_id: req.params.playlistId }).populate('song_id');
    res.status(200).send(songs);
});
// Remove a song from a playlist by id
router.delete('/:id', async (req, res) => {
    await PlaylistSong.findByIdAndDelete(req.params.id);
    res.status(204).send();
});
module.exports = router;