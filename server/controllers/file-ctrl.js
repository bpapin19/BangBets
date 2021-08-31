const File = require('../models/file-model');
const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({
    destination: "../public/uploads",
    filename: function(req, file, cb) {
        var date = new Date();
        cb(null, "" + date.toISOString().split('.')[0]+"Z" + path.extname(file.originalname));
    }
 });

 const upload = multer({
    storage: storage,
 }).single("myfile");

 const file = new File();

uploadFile = (req, res) => {
    upload(req, res, () => {
       file.meta_data = req.file;
    });

file
    .save()
    .then(() => {
        return res.status(201).json({
            success: true,
            id: spot._id,
            message: 'Photo successfully uploaded',
        })
    })
    .catch(error => {
        return res.status(400).json({
            error,
            message: 'Photo upload failed',
        });
    });
}

 module.exports = {
    uploadFile
}