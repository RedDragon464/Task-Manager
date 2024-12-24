import React, { useState } from "react";
import api from "../api";

//useState for Managing Input
const TaskForm = ({ onTaskAdded }) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("To Do");

  const handleSubmit = async (e) => {
    e.preventDefault(); //This function runs when you press the Add Task button.
    try {
      const response = await api.post("/tasks", { name, status }); //sends the new task to the backend
      onTaskAdded(response.data); //function passed from App.js.

      //After adding the task, we clear the inputs to reset the form.
      setName("");
      setStatus("To Do");
      
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Task Name"
        value={name}
        required
        onChange={(e) => setName(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        style={{ marginRight: "10px" }}
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
