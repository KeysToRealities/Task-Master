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

var selectedMinutes = 25;
var timeRemaining = selectedMinutes * 60;

// Stores the setInterval used to run the timer.
var timerInterval = null;

// Tracks whether the timer is currently running.
var timerRunning = false;

/*
  Sets the timer to the number of minutes
  selected by the user.
*/
function setTimer(minutes) {
  // Stop the current timer before changing the time.
  clearInterval(timerInterval);

  selectedMinutes = minutes;
  timeRemaining = minutes * 60;
  timerRunning = false;

  updateTimerDisplay();

  document.getElementById("timerMessage").textContent =
    minutes + " minute timer selected. Press Start.";
}

/*
  Starts the countdown timer.
*/
function startTimer() {
  // Prevent multiple intervals from running at the same time.
  if (timerRunning) {
    return;
  }

  // Do not start if the timer has already reached zero.
  if (timeRemaining <= 0) {
    document.getElementById("timerMessage").textContent =
      "Please select a new time before starting.";

    return;
  }

  timerRunning = true;

  document.getElementById("timerMessage").textContent =
    "Focus session in progress...";

  // Run the timer every 1,000 milliseconds, or one second.
  timerInterval = setInterval(function () {
    timeRemaining--;

    updateTimerDisplay();

    // Check whether the countdown has finished.
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);

      timerInterval = null;
      timerRunning = false;
      timeRemaining = 0;

      updateTimerDisplay();

      document.getElementById("timerMessage").textContent =
        "Time is up! Great work!";

      alert("Time is up! Your focus session is complete.");
    }
  }, 1000);
}

/*
  Pauses the timer at its current time.
*/
function pauseTimer() {
  if (!timerRunning) {
    document.getElementById("timerMessage").textContent =
      "The timer is not currently running.";

    return;
  }

  clearInterval(timerInterval);

  timerInterval = null;
  timerRunning = false;

  document.getElementById("timerMessage").textContent =
    "Timer paused. Press Start to continue.";
}

/*
  Stops the timer and returns it to
  the most recently selected time.
*/
function resetTimer() {
  clearInterval(timerInterval);

  timerInterval = null;
  timerRunning = false;
  timeRemaining = selectedMinutes * 60;

  updateTimerDisplay();

  document.getElementById("timerMessage").textContent =
    "Timer reset. Press Start when ready.";
}

/*
  Converts the remaining seconds into
  the MM:SS format and updates the page.
*/
function updateTimerDisplay() {
  var minutes = Math.floor(timeRemaining / 60);
  var seconds = timeRemaining % 60;

  // Add a zero before single-digit minutes.
  var minuteDisplay;

  if (minutes < 10) {
    minuteDisplay = "0" + minutes;
  } else {
    minuteDisplay = minutes;
  }

  // Add a zero before single-digit seconds.
  var secondDisplay;

  if (seconds < 10) {
    secondDisplay = "0" + seconds;
  } else {
    secondDisplay = seconds;
  }

  document.getElementById("timerDisplay").textContent =
    minuteDisplay + ":" + secondDisplay;
}

// Display the starting time when the page loads.
updateTimerDisplay();