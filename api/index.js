const express = require('express');

const cors = require('cors');
const { UserRouter } = require('../routes/userRouter/UserRouter');
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello from Vercel!');
});
app.use('/user', UserRouter)

module.exports = app;
