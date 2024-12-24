const express = require('express');
const router = express.Router();

// In-memory task storage
let tasks = [];

// GET all tasks
router.get('/', (req, res) => {
    res.json(tasks);
});

// POST a new task
router.post('/', (req, res) => {
    const { name, status } = req.body;
    const newTask = { id: tasks.length + 1, name, status };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PATCH (update task status)
router.patch('/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const task = tasks.find(task => task.id === parseInt(id));
    if (task) {
        task.status = status;
        res.json(task);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

module.exports = router;
