const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET all tasks sorted by newest
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().sort('-createdAt');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST a new task
router.post('/', async (req, res) => {
    try {
        const newTask = new Task({ text: req.body.text });
        const savedTask = await newTask.save();
        // emit the new task to all connected clients
        req.io.emit('newTask', savedTask);
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;