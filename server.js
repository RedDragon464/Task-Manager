const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/task-manager", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error("MongoDB connection error:", error));
db.once("open", () => console.log("Connected to MongoDB"));

// Task Schema and Model
const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, required: true },
});

const Task = mongoose.model("Task", taskSchema);

// Routes

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

// Add a new task
app.post("/tasks", async (req, res) => {
    const { name, status } = req.body;
    try {
        const newTask = new Task({
            id: new Date().getTime().toString(), // Unique ID as string
            name,
            status
        });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Error adding task", error });
    }
});


// Update a task's status
app.patch("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (updatedTask) {
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
});

// Delete all tasks
app.delete("/tasks", async (req, res) => {
  try {
    await Task.deleteMany({});
    res.status(200).json({ message: "All tasks deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting tasks", error });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


