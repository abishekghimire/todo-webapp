//Wait until the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector(".add-btn");
  const taskInputField = document.querySelector(".add-task input");
  const taskList = document.querySelector(".task-list");
  const finishedTasksList = [];
  const tasks = [];
  const finishedTaskBtn = document.querySelector(
    ".bottom-buttons .bottom-btn:first-child"
  );
  const clearBtn = document.querySelector(
    ".bottom-buttons .bottom-btn:last-child"
  );
  const successMessage = document.querySelector(".success-message");
  const titleHeading = document.querySelector(".todo-container h1");
  let viewingFinishedTasks = false; //State to track whether we're viewing finished task or not

  //Function to display messages when there is not task added
  function displayNoTaskMessage() {
    const noTasksMessage = document.createElement("div");
    noTasksMessage.classList.add("no-tasks-message");
    noTasksMessage.textContent = "Add tasks for your day!";
    taskList.appendChild(noTasksMessage);
  }

  //Function to remove no task message
  function removeNoTaskMessage() {
    const noTasksMessage = document.querySelector(".no-tasks-message");
    if (noTasksMessage) {
      noTasksMessage.remove();
    }
  }

  //Function to check if there are any tasks
  function checkForEmptyTask() {
    if (tasks.length === 0 && !viewingFinishedTasks) {
      taskList.innerHTML = " ";
      displayNoTaskMessage();
    }
  }

  //Function to display a success message
  // function showSuccessMessage(message, color) {
  //   successMessage.textContent = message;
  //   successMessage.style.display = "block";
  //   successMessage.style.color = color;

  //   //Hide the message after 2 seconds
  //   setTimeout(() => {
  //     successMessage.style.display = "none";
  //   }, 1000);
  // }
  function showToast(message, backgroundColor) {
    Toastify({
      text: message,
      duration: 2000,
      gravity: "top",
      position: "right",
      backgroundColor: backgroundColor,
      close: true,
      stopOnFocus: true,
    }).showToast();
  }

  //Function to add a new task
  addBtn.addEventListener("click", () => {
    const taskValue = taskInputField.value.trim();
    if (taskValue) {
      tasks.push(taskValue);
      removeNoTaskMessage();
      createTaskRow(taskValue);
      taskInputField.value = ""; //Clear the input field
      showToast("Task added successfully!", "green");
    }
    checkForEmptyTask(); //check for empty task after adding the task
  });

  //Function to create a new task row
  function createTaskRow(taskValue) {
    const taskRow = document.createElement("div");
    taskRow.classList.add("task-row");

    taskRow.innerHTML = `
       <input type="checkbox" class="task-checkbox" />
        <input type="text" class="task-input" value="${taskValue}" disabled />
        <div class="task-actions">
          <button class="task-edit-btn">
            <i class="fa-solid fa-pencil"></i>
          </button>
          <button class="task-del-btn">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
    `;

    taskList.appendChild(taskRow); //Add task to the task-list div

    const editBtn = taskRow.querySelector(".task-edit-btn");
    const delBtn = taskRow.querySelector(".task-del-btn");
    const taskInput = taskRow.querySelector(".task-input");
    const checkbox = taskRow.querySelector(".task-checkbox");

    //Edit task functionality
    editBtn.addEventListener("click", () => {
      if (taskInput.disabled) {
        taskInput.disabled = false; //Enable editing
        taskInput.focus();
        editBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
      } else {
        taskInput.disabled = true; //Save changes and disable editing
        editBtn.innerHTML = '<i class="fa-solid fa-pencil"></i>';

        //Update the task in the task array if it's in the to-do list
        const taskIndex = tasks.indexOf(taskValue);
        if (taskIndex > -1) {
          tasks[taskIndex] = taskInput.value;
          showToast("Task updated successfully!", "green");
        }
      }
    });

    //Delete task functionality
    delBtn.addEventListener("click", () => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this task?"
      );
      if (confirmDelete) {
        taskRow.remove();
        const taskIndex = tasks.indexOf(taskValue);
        if (taskIndex > -1) {
          tasks.splice(taskIndex, 1); //Remove task from to-do list array
          showToast("Task deleted successfully!", "red");
        }
        checkForEmptyTask(); //Check for empty task after deletion
      }
    });

    //Checkbox functionality to mark task as finished
    checkbox.addEventListener("click", () => {
      if (checkbox.checked) {
        finishedTasksList.push(taskInput.value); //Add the task to the finished task list
        const taskIndex = tasks.indexOf(taskInput.value);
        if (taskIndex > -1) {
          tasks.splice(taskIndex, 1); //Remove the task from the to-do array
        }
        taskRow.remove(); //Remove the task from the main list
        showToast("Moved to finished task!", "green");
        checkForEmptyTask(); //Check for empty task after moving to finished
      }
    });
  }

  //Function to hide task input field
  function hideTaskInputField() {
    taskInputField.style.display = "none";
    addBtn.style.display = "none";
  }

  //function to show task input field
  function showTaskInputField() {
    taskInputField.style.display = "block";
    addBtn.style.display = "block";
  }

  //Handle Finished Task button (shows finished tasks and toggle to-do list)
  finishedTaskBtn.addEventListener("click", () => {
    taskList.innerHTML = ""; //Clear the current task list

    if (viewingFinishedTasks) {
      //If we're viewing finished tasks, switch back to to-do list
      tasks.forEach((task) => createTaskRow(task)); //Show all tasks in the to-do list
      finishedTaskBtn.textContent = "Finished Task";
      titleHeading.textContent = "To Do";
      viewingFinishedTasks = false; //Set the state to show to-do list
      checkForEmptyTask(); //Check for empty task while going back to to-do list
      showTaskInputField();
    } else {
      //If we are viewing to-do list, switch to finished tasks
      if (finishedTasksList.length === 0) {
        //If there are no finished tasks
        const noTasksMessage = document.createElement("div");
        noTasksMessage.classList.add("no-tasks-message");
        noTasksMessage.textContent = "No finished tasks yet";
        taskList.appendChild(noTasksMessage);
      } else {
        //Display finished tasks from the finishedTasksList array
        finishedTasksList.forEach((task) => {
          const taskRow = document.createElement("div");
          taskRow.classList.add(".task-row");

          taskRow.innerHTML = `
        <input type="checkbox" class="task-checkbox" checked disabled />
                  <input type="text" class="task-input" value="${task}" disabled />
        `;

          taskList.appendChild(taskRow);
        });
      }
      finishedTaskBtn.textContent = "To Do";
      titleHeading.textContent = "Finished Task";
      viewingFinishedTasks = true; //Set the state to show finished tasks
      hideTaskInputField();
    }
    removeHideTaskInput();
  });

  //Handle Clear button
  clearBtn.addEventListener("click", () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear all tasks?"
    );
    if (confirmClear) {
      if (viewingFinishedTasks) {
        finishedTasksList.length = 0;
        taskList.innerHTML = " "; //Clear the current task list
        showToast("Cleared all tasks!", "green");

        const noTasksMessage = document.createElement("div");
        noTasksMessage.classList.add("no-tasks-message");
        noTasksMessage.textContent = "No finished tasks yet";
        taskList.appendChild(noTasksMessage);
      } else {
        tasks.length = 0;
        taskList.innerHTML = ""; //Clear the current task list
        showToast("Cleared all tasks!", "green");
      }
    }

    checkForEmptyTask(); //check for empty task after clearing the list
  });
  checkForEmptyTask(); //Check for empty task on page load
});
