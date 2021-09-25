const File = require('../models/file-model');
const multer = require('multer');
const path = require("path");
const fs = require("fs");
require('dotenv').config();
const aws = require("aws-sdk");
const multerS3 = require("multer-s3-transform");
const sharp = require("sharp");

const s3Config = new aws.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_ACCESS_SECRET,
    region: "us-west-1",
});

const pfp_bucket = process.env.S3_PFP_BUCKET_NAME;
const spot_bucket = process.env.S3_SPOT_BUCKET_NAME;

const s3storage = multerS3({
    acl: "public-read",
    s3: s3Config,
    // determine if file was sent from AddSpot form or UpdateProfile form and set destination
    bucket: function(req, _bucket, cb) {
        if (req.rawHeaders.indexOf('add-spot') > 0) {
            _bucket = spot_bucket;
        } else if (req.rawHeaders.indexOf('update-profile') > 0) {
            _bucket = pfp_bucket;
        }
        cb(null, _bucket);
    },
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });  
    },
    shouldTransform: true,
    transforms: [{
    // change file name to user id or curent date in ISO format
    key: function(req, file, cb) {
        if (req.rawHeaders.indexOf('update-profile') > 0) {
            cb(null, "" + req.get('current-user-id') + ".jpg");
        } else {
            var date = new Date();
            cb(null, "" + date.toISOString().split('.')[0]+"Z" + path.extname(file.originalname));
        }
    },
    transform: function (req, file, cb) {
        //Perform desired transformations
        cb(null, sharp().resize(600, 600));
      }
    }]
});

const upload = multer({
    storage: s3storage,
}).single("myfile");

const file = new File();

try {

    uploadFile = (req, res) => {
        upload(req, res, () => {
        file.meta_data = req.file;
        });

    file
        .save((err, file) => {
            if (err) {
                console.log("error on saving in the db");
            } else {
                console.log(`database item has been created: ${file}`);
            }
        })
        .then(() => {
            return res.status(200).json({
                success: true,
                message: 'Photo successfully uploaded',
            });
        })
        .catch(error => {
            return res.status(400).json({
                error: error,
                message: 'Photo upload failed',
            });
        });
    }
} catch (err) {
    console.log('Error occured in saving to DB or with mail send ', err);
    return res.sendStatus(500);
}

 module.exports = {
    uploadFile
}