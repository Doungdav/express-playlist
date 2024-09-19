const app = require('express')();
const http = require('http').Server(app);

const express = require('express');

const mongoose = require('mongoose');
const path = require('path');

//Models
const userRoutes = require('./routes/user.route');
const playlistRoutes = require('./routes/playlist.route');
const songRoutes = require('./routes/song.route');
const playlist_songRoutes = require('./routes/playlist_song.route');
const uploadRoutes = require('./routes/upload.route');
const verifyToken = require('./middleware/authmiddleware');
const protectedRoutes = require('./routes/protectedRoute');
    



mongoose.connect('mongodb+srv://doungdav3:Odu4bsKCjWUxYcjo@esther1.5nyd0.mongodb.net/?retryWrites=true&w=majority&appName=esther1');


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
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ status: 'FAILED', message: 'Something went wrong!' });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/playlists',verifyToken, playlistRoutes);
app.use('/api/songs', verifyToken, songRoutes);
app.use('/api/playlists/:playlistsId', playlist_songRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/protected', protectedRoutes);



http.listen(5000, function(){
    console.log('Applicate start at port 5000');
});