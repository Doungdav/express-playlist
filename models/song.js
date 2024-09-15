const mongoose = require('mongoose');
const Schema = mongoose.Schema; 


const songSchema = new mongoose.Schema({

    title:{type:String, require:true, unique:true},
    artist:{type:String, require:true, unique:true},
    //image:{type: String, unique: true, sparse: true},
    duration:{type:Number, require:true},
    url:{type:String},
    create_at:{type:Date, default:Date.now},
    update_at:{type:Date, default:Date.now}

});

const Song = mongoose.model('Song', songSchema);
module.exports = Song;