const mongoose = require('mongoose');

const playlistSongSchema = new mongoose.Schema({
    playlist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist', required: true },
    song_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },
    order: { type: Number, required: true }, // Position of the song in the playlist
});

module.exports = mongoose.model('PlaylistSong', playlistSongSchema);