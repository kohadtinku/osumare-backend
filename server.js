const express = require('express');
const app = express();
const port = 8080;

// Middleware 
app.use(express.json());

// In-memory storage for tasks
let tasks = [];
let currentId = 1;

// Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Get a task by ID
app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id, 10));
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});


// Create a new task
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newTask = {
    id: currentId++,
    title,
    description: description || '',
    completed: false,
  };
  tasks.push(newTask);
  res.status(200).json(newTask); // Changed status to 201 for created resource
});

app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id, 10));
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const { title, description, completed } = req.body;
    if (title === undefined || completed === undefined) {
      return res.status(400).json({ error: 'Title and completed status are required' });
    }
    task.title = title;
    task.description = description || task.description;
    task.completed = completed;
    res.json(task);
  });
  

// Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id, 10));
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  tasks.splice(taskIndex, 1);
  res.status(200).end();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
