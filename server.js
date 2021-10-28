const express = require('express');
const cors = require('cors');
const db = require('./db/db');
const path = require('path');

const betRouter = require('./routes/bet-router');

const app = express();
const apiPort = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/api', betRouter);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.listen(process.env.PORT || apiPort, () => console.log(`Server running on port ${apiPort}`));