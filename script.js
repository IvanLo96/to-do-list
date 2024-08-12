const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Cargar tareas guardadas
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''}>
      <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
      <div class="task-actions">
        <button class="edit-task">Edit</button>
        <button class="delete-task">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (taskText) {
    tasks.push({ text: taskText, completed: false });
    taskInput.value = '';
    saveTasks();
    renderTasks();
  }
});

taskList.addEventListener('click', (e) => {
  const taskItem = e.target.closest('.task-item');
  const index = Array.from(taskList.children).indexOf(taskItem);

  if (e.target.type === 'checkbox') {
    tasks[index].completed = e.target.checked;
    saveTasks();
    renderTasks();
  } else if (e.target.classList.contains('edit-task')) {
    startEditing(taskItem, index);
  } else if (e.target.classList.contains('delete-task')) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  } else if (e.target.classList.contains('save-task')) {
    saveEdit(taskItem, index);
  } else if (e.target.classList.contains('cancel-edit')) {
    cancelEdit(taskItem, index);
  }
});

function startEditing(taskItem, index) {
  const taskText = taskItem.querySelector('.task-text');
  const taskActions = taskItem.querySelector('.task-actions');
  
  taskText.style.display = 'none';
  taskActions.style.display = 'none';

  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'edit-input';
  editInput.value = tasks[index].text;

  const saveBtn = document.createElement('button');
  saveBtn.className = 'save-task';
  saveBtn.textContent = 'Save';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'cancel-edit';
  cancelBtn.textContent = 'Cancel';

  taskItem.insertBefore(editInput, taskActions);
  taskItem.insertBefore(saveBtn, taskActions);
  taskItem.insertBefore(cancelBtn, taskActions);

  editInput.focus();
}

function saveEdit(taskItem, index) {
  const editInput = taskItem.querySelector('.edit-input');
  const newText = editInput.value.trim();

  if (newText) {
    tasks[index].text = newText;
    saveTasks();
    renderTasks();
  }
}

function cancelEdit(taskItem, index) {
  renderTasks();
}

// Renderizar tareas iniciales
renderTasks();
