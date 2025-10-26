let tasks = [];

document.addEventListener("DOMContentLoaded", () => {
  const storedTasks = JSON.parse(localStorage.getItem('tasks'));
  if (storedTasks) {
    tasks.push(...storedTasks);
    updateTaskList();
    updateStats();
  }
});

const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const createTask = () => {
  const taskInput = document.getElementById('taskInput');
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    taskInput.value = "";
    updateTaskList();
    updateStats();
    saveTasks();
  }
};

const toggleTaskComplete = (index) => {
  tasks[index].completed = !tasks[index].completed;
  updateTaskList();
  updateStats();
  saveTasks();
};

const deleteTask = (index) => {
  tasks.splice(index, 1);
  updateTaskList();
  updateStats();
  saveTasks();
};

const editTask = (index) => {
  const taskInput = document.getElementById('taskInput');
  taskInput.value = tasks[index].text;
  tasks.splice(index, 1);
  updateTaskList();
  updateStats();
  saveTasks();
};

const updateStats = () => {
  const completeTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks === 0 ? 0 : (completeTasks / totalTasks) * 100;

  const progressBar = document.getElementById('progress');
  progressBar.style.width = `${progress}%`;

  document.getElementById('numbers').innerText = `${completeTasks}/${totalTasks}`;
};

const updateTaskList = () => {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <div class="taskItem">
        <div class="task ${task.completed ? 'completed' : ''}">
          <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""}>
          <p>${task.text}</p>
        </div>
        <div class="icons">
          <img src="edit.png" alt="edit" onClick="editTask(${index})">
          <img src="delete.png" alt="delete" onClick="deleteTask(${index})">
        </div>
      </div>`;
    listItem.querySelector('.checkbox').addEventListener('change', () => toggleTaskComplete(index));
    taskList.appendChild(listItem);
  });
};

document.getElementById('addTask').addEventListener('click', (e) => {
  e.preventDefault();
  createTask();
});
