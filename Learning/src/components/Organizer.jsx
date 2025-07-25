// src/pages/Organizer.jsx

import React, { useState } from "react";
import "../styles/Organizer.css";

const Organizer = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      const task = {
        id: Date.now(),
        title: newTask,
        completed: false,
      };
      setTasks([...tasks, task]);
      setNewTask("");
    }
  };

  const handleToggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="organizer-container">
      <h2>Study Organizer</h2>
      <div className="add-task-form">
        <input
          type="text"
          placeholder="Enter your task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTask}>Add</button>
      </div>

      <ul className="task-list">
        {tasks.length === 0 ? (
          <p>No tasks yet. Add one!</p>
        ) : (
          tasks.map((task) => (
            <li key={task.id} className={task.completed ? "completed" : ""}>
              <span onClick={() => handleToggleComplete(task.id)}>
                {task.title}
              </span>
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Organizer;
