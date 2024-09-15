const express = require('express');
const PlaylistSong = require('../models/playlist_song');
const router = express.Router();

// Add a song to a playlist
router.post('/', async (req, res) => {
    const { playlist_id, song_id, order } = req.body;
    const newPlaylistSong = new PlaylistSong({ playlist_id, song_id, order });
    await newPlaylistSong.save();
    res.status(201).send(newPlaylistSong);
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