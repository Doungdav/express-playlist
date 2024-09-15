const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({

    name:{type:String, require: true, unique:true},
    description:{type:String},
    image:{type:String},
    create_at:{type:Date, default:Date.now},
    update_at:{type:Date, default:Date.now}

});
const Playlist = mongoose.model('Playlist', playlistSchema);
module.exports = Playlist;