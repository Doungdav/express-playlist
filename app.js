const app = require('express')();
const http = require('http').Server(app);

const express = require('express');

const mongoose = require('mongoose');

//Models
const userRoutes = require('./routes/user.route');
const playlistRoutes = require('./routes/playlist.route');
const songRoutes = require('./routes/song.route');
const playlist_songRoutes = require('./routes/playlist_song.route');
    



// mongoose.connect('mongodb+srv://doungdav3:Odu4bsKCjWUxYcjo@esther1.5nyd0.mongodb.net/?retryWrites=true&w=majority&appName=esther1');


const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://doungdav3:Odu4bsKCjWUxYcjo@esther1.5nyd0.mongodb.net/?retryWrites=true&w=majority&appName=esther1', {
        
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

connectDB();
app.get('/', function(req, res){
    res.send("Hello world!");
 });


//middleware
app.use(express.json());
//app.use('/uploads', express.static('uploads')); // Serve uploaded images


// Routes
app.use('/api/users', userRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/playlist_songs', playlist_songRoutes);



http.listen(5000, function(){
});