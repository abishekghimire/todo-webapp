//Wait until the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector(".add-btn");
  const taskInputField = document.querySelector(".add-task input");
  const taskList = document.querySelector(".task-list");
  const finishedTasksList = []; //Array to store finished tasks
  const tasks = []; //Array to store tasks in to-do list
  const finishedTaskBtn = document.querySelector(
    ".bottom-buttons .bottom-btn:first-child"
  );
  let viewingFinishedTasks = false; //State to track whether we're viewing finished task or not

  //Function to add a new task
  addBtn.addEventListener("click", () => {
    const taskValue = taskInputField.value.trim();
    if (taskValue) {
      tasks.push(taskValue); //Add task to to-do list array
      createTaskRow(taskValue);
      taskInputField.value = ""; //Clear the input field
    }
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
      } else {
        taskInput.disabled = true; //Save changes and disable editing
      }
    });

    //Delete task functionality
    delBtn.addEventListener("click", () => {
      taskRow.remove();
      const taskIndex = tasks.indexOf(taskValue);
      if (taskIndex > -1) {
        tasks.splice(taskIndex, 1); //Remove task from to-do list array
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
      }
    });
  }

  //Handle Finished Task button (shows finished tasks and toggle to-do list)
  finishedTaskBtn.addEventListener("click", () => {
    taskList.innerHTML = ""; //Clear the current task list

    if (viewingFinishedTasks) {
      //If we're viewing finished tasks, switch back to to-do list
      tasks.forEach((task) => createTaskRow(task)); //Show all tasks in the to-do list
      finishedTaskBtn.textContent = "Finished Task"; //Change the button to "Finished Task"
      viewingFinishedTasks = false; //Set the state to show to-do list
    } else {
      //If we are viewing to-do list, switch to finished tasks
      if (finishedTasksList.length === 0) {
        //If there are no finished tasks
        const noTaskMessage = document.createElement("div");
        noTaskMessage.classList.add("no-tasks-message");
        noTaskMessage.textContent = "No finished tasks yet!";
        taskList.appendChild(noTaskMessage);
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
      finishedTaskBtn.textContent = "To Do"; //Change button trxt to "To Do"
      viewingFinishedTasks = true; //Set the state to show finished tasks
    }
  });

  //Handle Clear All button
  document
    .querySelector(".bottom-buttons .bottom-btn:last-child")
    .addEventListener("click", () => {
      taskList.innerHTML = " "; //Clear the current task list
      tasks.length = 0; //Clear the to do list
      finishedTasksList.length = 0; // Clear the finished task list
    });
});
