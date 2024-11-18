const express = require('express');

const app = express();

// Define your routes
app.get('/', (req, res) => {
    res.send('Hello from Vercel!');
});

// Export the Express app as a serverless function
module.exports = app;
