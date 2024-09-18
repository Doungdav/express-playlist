const mongoose = require('mongoose');
const Joi = require('joi');

const playlistSchema = new mongoose.Schema({

    name:{type:String, required: true, unique:true},
    description:{type:String, required:true},
    image:{type:String},
    url:{type:String},
    create_at:{type:Date, default:Date.now},
    update_at:{type:Date, default:Date.now}

});
const Playlist = mongoose.model('Playlist', playlistSchema);

// Joi Validation Schema
const validatePlaylist = (playlist) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.base': `"name" should be a type of 'text'`,
            'any.required': `"name" is a required field`
        }),
        description: Joi.string().required().messages({
            'string.base': `"description" should be a type of 'text'`,
            'any.required': `"description" is a required field`
        }),
        image: Joi.string().optional(),
        url: Joi.string().optional()
    });
    return schema.validate(playlist);  // Use the Joi schema to validate
};
module.exports = { Playlist, validatePlaylist };