// Store all tasks in an array
var tasks = [];
var currentFilter = "all";

function addTask() {
  var input = document.getElementById("taskInput");
  var prioritySelect = document.getElementById("prioritySelect");
  var text = input.value.trim();

  if (text === "") {
    alert("Please enter a task!");
    return;
  }

  // Create a task object
  var task = {
    id: Date.now(),
    text: text,
    priority: prioritySelect.value,
    done: false
  };

  tasks.push(task);
  input.value = "";

  renderTasks();
}

function toggleDone(id) {
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      tasks[i].done = !tasks[i].done;
      break;
    }
  }
  renderTasks();
}

function deleteTask(id) {
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      tasks.splice(i, 1);
      break;
    }
  }
  renderTasks();
}

function filterTasks(priority) {
  currentFilter = priority;

  // Update active filter button styling
  var buttons = document.querySelectorAll(".filter-btn");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active-filter");
  }
  event.target.classList.add("active-filter");

  renderTasks();
}

function renderTasks() {
  var list = document.getElementById("taskList");
  var emptyMsg = document.getElementById("emptyMessage");
  list.innerHTML = "";

  // Decide which tasks to show based on the current filter
  var filtered = [];
  for (var i = 0; i < tasks.length; i++) {
    if (currentFilter === "all" || tasks[i].priority === currentFilter) {
      filtered.push(tasks[i]);
    }
  }

  if (filtered.length === 0) {
    emptyMsg.style.display = "block";
    return;
  }

  emptyMsg.style.display = "none";

  for (var i = 0; i < filtered.length; i++) {
    var task = filtered[i];

    var li = document.createElement("li");
    li.className = "task-item " + task.priority;
    if (task.done) {
      li.className += " done";
    }

    // Task text
    var span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    // Priority badge
    var badge = document.createElement("span");
    badge.className = "task-badge badge-" + task.priority;
    badge.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

    // Action buttons
    var actions = document.createElement("div");
    actions.className = "task-actions";

    var doneBtn = document.createElement("button");
    doneBtn.className = "btn-done";
    doneBtn.textContent = task.done ? "Undo" : "Done";
    doneBtn.onclick = (function(id) {
      return function() { toggleDone(id); };
    })(task.id);

    var deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = (function(id) {
      return function() { deleteTask(id); };
    })(task.id);

    actions.appendChild(doneBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(badge);
    li.appendChild(actions);
    list.appendChild(li);
  }
}

// Allow pressing Enter to add a task
document.getElementById("taskInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    addTask();
  }
});
