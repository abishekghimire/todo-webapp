document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector(".add-btn");
  const taskInputField = document.querySelector(".add-task input");
  const taskList = document.querySelector(".task-list");
  const finishedTasksList = []; //Array to store finished tasks
  const tasks = []; //Array to store tasks in to-do list
  const finishedTaskBtn = document.querySelector(
    ".bottom-buttons .bottom-btn:first-child"
  );
  const clearBtn = document.querySelector(
    ".bottom-buttons .bottom-btn:last-child"
  );
  const titleHeading = document.querySelector(".todo-container h1");
  let viewingFinishedTasks = false; //State to track whether we're viewing finished tasks or not

  //Function to display a toast notification
  function showToast(message, backgroundColor) {
    Toastify({
      text: message,
      duration: 2000, // Toast will appear for 2 seconds
      gravity: "top", // Toast will appear at the top of the page
      position: "right", // Align toast to the right side
      backgroundColor: backgroundColor,
      close: true, // Adds a close button
      stopOnFocus: true, // Prevents the toast from closing when focused
    }).showToast();
  }

  // Function to display no tasks message
  function displayNoTaskMessage() {
    const noTasksMessage = document.createElement("div");
    noTasksMessage.classList.add("no-tasks-message");
    noTasksMessage.textContent = "Add tasks for your day!";
    taskList.appendChild(noTasksMessage);
  }

  // Function to remove no tasks message
  function removeNoTaskMessage() {
    const noTasksMessage = document.querySelector(".no-tasks-message");
    if (noTasksMessage) {
      noTasksMessage.remove();
    }
  }

  // Function to check for empty tasks
  function checkForEmptyTask() {
    if (tasks.length === 0 && !viewingFinishedTasks) {
      taskList.innerHTML = "";
      displayNoTaskMessage();
    }
  }

  // Add new task
  addBtn.addEventListener("click", () => {
    const taskValue = taskInputField.value.trim();
    if (taskValue) {
      tasks.push(taskValue); // Add task to to-do list array
      removeNoTaskMessage();
      createTaskRow(taskValue);
      taskInputField.value = ""; // Clear the input field
      showToast("Task added successfully!", "green");
    }
    checkForEmptyTask(); // Check for empty task after adding
  });

  // Function to create a new task row
  function createTaskRow(taskValue) {
    const taskRow = document.createElement("div");
    taskRow.classList.add("task-row");

    taskRow.innerHTML = `
       <input type="checkbox" class="task-checkbox" />
        <input type="text" class="taskHerneInput " value="${taskValue}" disabled />
        <div class="task-actions">
          <button class="task-edit-btn">
            <i class="fa-solid fa-pencil"></i>
          </button>
          <button class="task-del-btn">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
    `;

    taskList.appendChild(taskRow); // Add task to the task-list div

    const editBtn = taskRow.querySelector(".task-edit-btn");
    const delBtn = taskRow.querySelector(".task-del-btn");
    const taskInput = taskRow.querySelector(".taskHerneInput");
    const checkbox = taskRow.querySelector(".task-checkbox");

    // Edit task functionality
    editBtn.addEventListener("click", () => {
      if (taskInput.disabled) {
        taskInput.disabled = false; // Enable editing
        taskInput.focus();
        editBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
      } else {
        taskInput.disabled = true; // Save changes and disable editing
        editBtn.innerHTML = '<i class="fa-solid fa-pencil"></i>';

        // Update the task in the task array if it's in the to-do list
        const taskIndex = tasks.indexOf(taskValue);
        if (taskIndex > -1) {
          tasks[taskIndex] = taskInput.value;
          showToast("Task updated successfully!", "green");
        }
      }
    });

    // Delete task functionality
    delBtn.addEventListener("click", () => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this task?"
      );
      if (confirmDelete) {
        taskRow.remove();
        const taskIndex = tasks.indexOf(taskValue);
        if (taskIndex > -1) {
          tasks.splice(taskIndex, 1); // Remove task from to-do list array
          showToast("Task deleted successfully!", "red");
        }
        checkForEmptyTask(); // Check for empty task after deletion
      }
    });

    // Checkbox functionality to mark task as finished
    checkbox.addEventListener("click", () => {
      if (checkbox.checked) {
        finishedTasksList.push(taskInput.value); // Add the task to the finished task list
        const taskIndex = tasks.indexOf(taskInput.value);
        if (taskIndex > -1) {
          tasks.splice(taskIndex, 1); // Remove the task from the to-do array
        }
        taskRow.remove(); // Remove the task from the main list
        showToast("Moved to finished task!", "green");
        checkForEmptyTask(); // Check for empty task after moving to finished
      }
    });
  }

  // Handle Finished Task button
  finishedTaskBtn.addEventListener("click", () => {
    taskList.innerHTML = ""; // Clear the current task list

    if (viewingFinishedTasks) {
      // If we're viewing finished tasks, switch back to to-do list
      tasks.forEach((task) => createTaskRow(task)); // Show all tasks in the to-do list
      finishedTaskBtn.textContent = "Finished Task"; // Change the button to "Finished Task"
      titleHeading.textContent = "To Do";
      viewingFinishedTasks = false; // Set the state to show to-do list
      checkForEmptyTask(); // Check for empty task while going back to to-do list
      taskInputField.style.display = "block";
      addBtn.style.display = "block";
    } else {
      // If we are viewing the to-do list, switch to finished tasks
      if (finishedTasksList.length === 0) {
        const noTasksMessage = document.createElement("div");
        noTasksMessage.classList.add("no-tasks-message");
        noTasksMessage.textContent = "No finished tasks yet";
        taskList.appendChild(noTasksMessage);
      } else {
        finishedTasksList.forEach((task) => {
          const taskRow = document.createElement("div");
          taskRow.classList.add("task-row");

          taskRow.innerHTML = `
            <input type="checkbox" class="task-checkbox" checked disabled />
            <input type="text" class="taskHerneInput" value="${task}" disabled />
          `;

          taskList.appendChild(taskRow);
        });
      }
      finishedTaskBtn.textContent = "To Do"; // Change button text to "To Do"
      titleHeading.textContent = "Finished Task";
      viewingFinishedTasks = true; // Set the state to show finished tasks
      taskInputField.style.display = "none";
      addBtn.style.display = "none";
    }
  });

  // Handle Clear button
  clearBtn.addEventListener("click", () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear all tasks?"
    );
    if (confirmClear) {
      tasks.length = 0; // Clear the tasks array
      taskList.innerHTML = ""; // Clear the task list display
      finishedTasksList.length = 0; // Clear finished task list
      showToast("Cleared all tasks!", "green");
      checkForEmptyTask(); // Check for empty task after clearing
    }
  });

  // Initial check for empty tasks
  checkForEmptyTask();
});
