const mongoose = require('mongoose');
const Joi = require('joi');

const playlistSongSchema = new mongoose.Schema({
    playlist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist', required: true },
    song_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },
    order: { type: Number, required: true }, // Position of the song in the playlist
});
const PlaylistSong = mongoose.model('PlaylistSong', playlistSongSchema);

// Joi Validation Schema
const validatePlaylistSong = (playlistSong) => {
    const schema = Joi.object({
        playlist_id: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/) // Check for valid ObjectId format
            .required()
            .label('Playlist ID'),

        song_id: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/) // Check for valid ObjectId format
            .required()
            .label('Song ID'),

        order: Joi.number()
            .integer()
            .min(0) // assuming order should be non-negative
            .required()
            .label('Order')
            .messages({
                'integer.base': `"order" should be a type of 'integer'`,
                'any.required': `"order" is a required field`
            }) 
    });

    return schema.validate(playlistSong);  // Use the Joi schema to validate
};

module.exports = { PlaylistSong, validatePlaylistSong };