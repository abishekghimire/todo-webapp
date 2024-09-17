import { showToast } from './view.js';
import { saveTasks } from './storage.js';

export function handleEditTask(editBtn, taskInput, oldValue, tasks, saveTasks) {
  if (taskInput.disabled) {
    taskInput.disabled = false;
    taskInput.focus();
    editBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  } else {
    taskInput.disabled = true;
    editBtn.innerHTML = '<i class="fa-solid fa-pencil"></i>';
    
    const taskIndex = tasks.indexOf(oldValue);
    if (taskIndex > -1) {
      tasks[taskIndex] = taskInput.value;
      showToast('Task updated successfully!', 'green');
      saveTasks(tasks);
    }
  }
}

export function handleDeleteTask(delBtn, taskRow, taskValue, tasks, saveTasks) {
  const confirmDelete = window.confirm('Are you sure you want to delete this task?');
  if (confirmDelete) {
    taskRow.remove();
    const taskIndex = tasks.indexOf(taskValue);
    if (taskIndex > -1) {
      tasks.splice(taskIndex, 1);
      showToast('Task deleted successfully!', 'red');
      saveTasks(tasks);
    }
  }
}

export function handleCheckboxClick(checkbox, taskInput, taskRow, tasks, finishedTasks, updateClearButton, saveTasks) {
  if (checkbox.checked) {
    finishedTasks.push(taskInput.value);
    const taskIndex = tasks.indexOf(taskInput.value);
    if (taskIndex > -1) {
      tasks.splice(taskIndex, 1);
    }
    taskRow.remove();
    showToast('Task moved to "Finished Task" list!', 'green');
    updateClearButton();
    saveTasks(tasks, finishedTasks);
  }
}
