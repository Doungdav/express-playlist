const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const Joi = require('joi');


const songSchema = new mongoose.Schema({

    title:{type:String, required:true, unique:true},
    artist:{type:String, required:true, unique:true},
    //image:{type: String, unique: true, sparse: true},
    duration:{type:Number, require:true},
    url:{type:String},
    create_at:{type:Date, default:Date.now},
    update_at:{type:Date, default:Date.now}

});
const Song = mongoose.model('Song', songSchema);

// Joi Validation Schema
const validateSong = (song) => {
    const schema = Joi.object({
        title: Joi.string().required().messages({
            'string.base': `"title" should be a type of 'text'`,
            'any.required': `"title" is a required field`
        }),
        artist: Joi.string().required().messages({
            'string.base': `"artist" should be a type of 'text'`,
            'any.required': `"artist" is a required field`
        }),
        duration: Joi.number().required().messages({  // Ensure required here
            'number.base': `"duration" should be a type of 'number'`,
            'any.required': `"duration" is a required field`
        }),
        url: Joi.string().optional()
    });
    return schema.validate(song);  // Use the Joi schema to validate
};

module.exports = {Song, validateSong}