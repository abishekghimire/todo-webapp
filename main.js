import { saveTasks, loadTasks } from './storage.js';
import { createTaskRow, showToast, displayNoTasksMessage, removeNoTasksMessage } from './view.js';
import { handleEditTask, handleDeleteTask, handleCheckboxClick } from './handlers.js';

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector('.add-btn');
  const taskInputField = document.querySelector('.add-task input');
  const taskList = document.querySelector('.task-list');
  const finishedTaskBtn = document.querySelector('.bottom-buttons .bottom-btn:first-child');
  const clearBtn = document.querySelector('.bottom-buttons .bottom-btn:last-child');
  const titleHeading = document.querySelector('.todo-container h1');
  let viewingFinishedTasks = false;

  const { tasks, finishedTasks } = loadTasks();

  function updateClearButton() {
    clearBtn.disabled = viewingFinishedTasks ? finishedTasks.length === 0 : tasks.length === 0;
  }

  function checkForEmptyTask() {
    if (tasks.length === 0 && !viewingFinishedTasks) {
      taskList.innerHTML = '';
      displayNoTasksMessage(taskList, 'Add tasks for your day!');
    } else {
      removeNoTasksMessage();
    }
  }

  function hideTaskInputField() {
    taskInputField.style.display = 'none';
    addBtn.style.display = 'none';
  }

  function showTaskInputField() {
    taskInputField.style.display = 'block';
    addBtn.style.display = 'block';
  }

  addBtn.addEventListener('click', () => {
    const taskValue = taskInputField.value.trim();
    if (taskValue) {
      tasks.push(taskValue);
      removeNoTasksMessage();
      createTaskRow(taskValue, taskList, tasks, finishedTasks, updateClearButton, (tasks, finishedTasks) => saveTasks(tasks, finishedTasks));
      taskInputField.value = '';
      showToast('Task added successfully!', 'green');
      updateClearButton();
      saveTasks(tasks, finishedTasks);
    }
    checkForEmptyTask();
  });

  finishedTaskBtn.addEventListener('click', () => {
    taskList.innerHTML = '';
    if (viewingFinishedTasks) {
      tasks.forEach(task => createTaskRow(task, taskList, tasks, finishedTasks, updateClearButton, (tasks, finishedTasks) => saveTasks(tasks, finishedTasks)));
      finishedTaskBtn.textContent = 'Finished Task';
      titleHeading.textContent = 'To Do';
      viewingFinishedTasks = false;
      showTaskInputField();
      checkForEmptyTask();
    } else {
      if (finishedTasks.length === 0) {
        displayNoTasksMessage(taskList, 'No finished tasks yet');
      } else {
        finishedTasks.forEach(task => createTaskRow(task, taskList, tasks, finishedTasks, updateClearButton, (tasks, finishedTasks) => saveTasks(tasks, finishedTasks)));
      }
      finishedTaskBtn.textContent = 'To Do';
      titleHeading.textContent = 'Finished Task';
      viewingFinishedTasks = true;
      hideTaskInputField();
    }
    updateClearButton();
  });

  clearBtn.addEventListener('click', () => {
    const confirmClear = window.confirm('Are you sure you want to clear all tasks?');
    if (confirmClear) {
      if (viewingFinishedTasks) {
        finishedTasks.length = 0;
        taskList.innerHTML = '';
        showToast('Cleared all finished tasks!', 'red');
        displayNoTasksMessage(taskList, 'No finished tasks yet');
      } else {
        tasks.length = 0;
        taskList.innerHTML = '';
        showToast('Cleared all to do tasks!', 'red');
      }
      updateClearButton();
      saveTasks(tasks, finishedTasks);
    }
  });

  checkForEmptyTask();
  tasks.forEach(task => createTaskRow(task, taskList, tasks, finishedTasks, updateClearButton, (tasks, finishedTasks) => saveTasks(tasks, finishedTasks)));
  updateClearButton();
});
