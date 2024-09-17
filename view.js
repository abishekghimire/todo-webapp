export function createTaskRow(taskValue, taskList, tasks, finishedTasks, updateClearButton, saveTasks) {
  const taskRow = document.createElement('div');
  taskRow.classList.add('task-row');
  
  taskRow.innerHTML = `
    <input type="checkbox" class="task-checkbox" />
    <input type="text" class="task-input" value="${taskValue}" disabled />
    <div class="task-actions">
      <button class="task-edit-btn"><i class="fa-solid fa-pencil"></i></button>
      <button class="task-del-btn"><i class="fa-solid fa-trash"></i></button>
    </div>
  `;
  
  taskList.appendChild(taskRow);

  const editBtn = taskRow.querySelector('.task-edit-btn');
  const delBtn = taskRow.querySelector('.task-del-btn');
  const taskInput = taskRow.querySelector('.task-input');
  const checkbox = taskRow.querySelector('.task-checkbox');

  editBtn.addEventListener('click', () => handleEditTask(editBtn, taskInput, taskValue, tasks, saveTasks));
  delBtn.addEventListener('click', () => handleDeleteTask(delBtn, taskRow, taskValue, tasks, saveTasks));
  checkbox.addEventListener('click', () => handleCheckboxClick(checkbox, taskInput, taskRow, tasks, finishedTasks, updateClearButton, saveTasks));
}

export function showToast(message, backgroundColor) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    backgroundColor: backgroundColor,
    close: true,
    stopOnFocus: true
  }).showToast();
}

export function displayNoTasksMessage(taskList, message) {
  const noTasksMessage = document.createElement('div');
  noTasksMessage.classList.add('no-tasks-message');
  noTasksMessage.textContent = message;
  taskList.appendChild(noTasksMessage);
}

export function removeNoTasksMessage() {
  const noTasksMessage = document.querySelector('.no-tasks-message');
  if (noTasksMessage) {
    noTasksMessage.remove();
  }
}
