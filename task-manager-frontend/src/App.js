import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import api from "./api";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  // Group tasks by status
  const tasksByStatus = {
    "To Do": tasks.filter((task) => task.status === "To Do"),
    "In Progress": tasks.filter((task) => task.status === "In Progress"),
    Completed: tasks.filter((task) => task.status === "Completed"),
  };

  // Handle drag-and-drop functionality
  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceStatus = source.droppableId;
    const destinationStatus = destination.droppableId;

    // Prevent dragging out of "Completed"
    if (sourceStatus === "Completed" && sourceStatus !== destinationStatus) {
      return;
    }

    // If dropped in the same position, do nothing
    if (
      sourceStatus === destinationStatus &&
      source.index === destination.index
    ) {
      return;
    }

    // Clone the current tasks to avoid mutating state directly
    const updatedTasks = [...tasks];
    const draggedTask = tasksByStatus[sourceStatus][source.index];

    // Create a new copy of the dragged task with updated status
    const updatedTask = { ...draggedTask, status: destinationStatus };

    try {
      // Update task status in the backend
      await api.patch(`/tasks/${draggedTask._id}`, { status: destinationStatus });

      // Update the task in the frontend state
      updatedTasks.splice(tasks.indexOf(draggedTask), 1, updatedTask);

      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Handle task status updates from the dropdown menu
  const handleTaskUpdate = async (taskId, newStatus) => {
    try {
      // Update task status in the backend
      await api.patch(`/tasks/${taskId}`, { status: newStatus });

      // Update the task in the frontend state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div>
      <h1>Task Manager</h1>
      <TaskForm onTaskAdded={(newTask) => setTasks([...tasks, newTask])} />
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="columns">
          {Object.keys(tasksByStatus).map((status) => (
            <TaskList
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
              onTaskUpdated={handleTaskUpdate} // Pass the update function to TaskList
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default App;





