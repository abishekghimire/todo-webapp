export function saveTasks(tasks, finishedTasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('finishedTasks', JSON.stringify(finishedTasks));
}

export function loadTasks() {
  return {
    tasks: JSON.parse(localStorage.getItem('tasks')) || [],
    finishedTasks: JSON.parse(localStorage.getItem('finishedTasks')) || []
  };
}
