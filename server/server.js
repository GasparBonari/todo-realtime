const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const taskRoutes = require('./routes/tasks');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: '*' }
});

// Middleware
app.use(cors());
app.use(express.json());

// Attach io instance to each request so routes can emit events
app.use((req, res, next) => {
    req.io = io;
    next();
});

// API routes
app.use('/api/tasks', taskRoutes);

// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Connect to MongoDB and start the HTTP + WebSocket server
const MONGO_URI = 'mongodb://localhost:27017/todoapp';
mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('✅ MongoDB connected');
        server.listen(3000, () => {
        console.log('🚀 Server listening on http://localhost:3000');
        });
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
    });
