const express = require('express');
const cors = require('cors');
const db = require('./db/db');
const path = require('path');

const spotRouter = require('./routes/spot-router');

const app = express();
const apiPort = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public/uploads")));

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/api', spotRouter);

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));