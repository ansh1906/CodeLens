const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth.routes');
const analyzeRoutes = require('./routes/analyze.routes');

const cookieParser = require('cookie-parser');

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api', analyzeRoutes);



module.exports = app;