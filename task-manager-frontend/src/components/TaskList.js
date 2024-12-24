import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import api from "../api";

const TaskList = ({ status, tasks, onTaskUpdated }) => {
  const handleStatusChange = async (task, newStatus) => {
    try {
      // Update task status in the backend
      await api.patch(`/tasks/${task._id}`, { status: newStatus });

      // Call the parent function to update the state
      onTaskUpdated(task._id, newStatus);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="column" // Styling for the column
        >
          <h2>{status}</h2>
          {tasks && tasks.length > 0 ? (
            tasks.map((task, index) => (
              <Draggable
                key={task._id} // Use MongoDB's `_id` as a unique identifier
                draggableId={task._id.toString()}
                index={index}
                isDragDisabled={status === "Completed"} // Prevent dragging out of "Completed"
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...(status !== "Completed" ? provided.dragHandleProps : {})}
                    className="task" // Styling for individual tasks
                  >
                    <div className="task-content">
                      {task.name}
                      {status !== "Completed" && (
                        <select
                          onChange={(e) =>
                            handleStatusChange(task, e.target.value)
                          }
                          defaultValue="default"
                          style={{
                            marginLeft: "10px",
                            padding: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                          }}
                        >
                          <option value="default" disabled>
                            Actions
                          </option>
                          {status !== "To Do" && (
                            <option value="To Do">Move to To Do</option>
                          )}
                          {status !== "In Progress" && (
                            <option value="In Progress">Move to In Progress</option>
                          )}
                          {status !== "Completed" && (
                            <option value="Completed">Move to Completed</option>
                          )}
                        </select>
                      )}
                    </div>
                  </div>
                )}
              </Draggable>
            ))
          ) : (
            <p>No tasks available</p> // Handle empty task lists
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default TaskList;





