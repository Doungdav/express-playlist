const express = require('express');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

// Ensure upload/images directory exists
const dir = path.join(__dirname);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

// storage engine 
const storage = multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB limit
    }
});

// Define your upload route
router.post('', upload.single('images'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No images uploaded.');
    }
    // Build the URL of the uploaded image
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    
    // Image information
    const imageInfo = {
        id: req.file.filename.split('_')[1],
        uuid: uuid.v4(),
        filename: req.file.filename,
        size: req.file.size, // Size in bytes
        mimeType: req.file.mimetype,
        url: imageUrl
    };
    res.send({ message: 'File uploaded successfully!', image: imageInfo });
    //res.send({ message: 'File uploaded successfully!', url: imageUrl });
});

// Error handling middleware
function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: 0,
            message: err.message
        });
    }
    next(err); // Pass to next error handler if it's not a Multer error
}
router.use(errHandler);

module.exports = router;