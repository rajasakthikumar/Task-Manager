const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDirectory = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

// File filter to allow specific file types
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type. Only images and documents are allowed.'));
    }
};

// Configure multer
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter
});

module.exports = upload;
