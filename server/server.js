const {express} = require('express');
const connectDB = require('./src/config/db');
const app = require('./src/app')
connectDB();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});