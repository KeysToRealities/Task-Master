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