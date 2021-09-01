const File = require('../models/file-model');
const multer = require('multer');
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    // determine if file was sent from AddSpot form or UpdateProfile form and set destination
    destination: function(req, _destination, cb) {
        if (req.rawHeaders.indexOf('add-spot') > 0) {
            _destination = "../public/uploads";
            if (!fs.existsSync(_destination)) {
                fs.mkdirSync(_destination);
            }
        } else if (req.rawHeaders.indexOf('update-profile') > 0) {
            _destination = "../public/pfps";
            if (!fs.existsSync(_destination)) {
                fs.mkdirSync(_destination);
            }
        }
        cb(null, _destination);
    },
    // change file name to user email or curent date in ISO format
    filename: function(req, file, cb) {
        if (req.rawHeaders.indexOf('update-profile') > 0) {
            cb(null, "" + req.get('current-user-email') + ".jpg");
        } else {
            var date = new Date();
            cb(null, "" + date.toISOString().split('.')[0]+"Z" + path.extname(file.originalname));
        }
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