// events object: keys are "YYYY-MM-DD", values are arrays of event objects
var events = {};
var selectedDate = null;
var eventsDocRef = null;

var today = new Date();
var currentMonth = today.getMonth();
var currentYear = today.getFullYear();

var monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Load this user's saved events once we know who's logged in.
auth.onAuthStateChanged(function (user) {
  if (!user) {
    return;
  }

  eventsDocRef = db.collection("calendarEvents").doc(user.uid);

  eventsDocRef.get().then(function (doc) {
    if (doc.exists) {
      events = doc.data().events || {};
    }

    renderCalendar();
    renderEvents();
  });
});

function saveEvents() {
  if (!eventsDocRef) {
    return;
  }

  eventsDocRef.set({ events: events });
}

function changeMonth(direction) {
  currentMonth += direction;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  } else if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
}

function renderCalendar() {
  document.getElementById("monthLabel").textContent =
    monthNames[currentMonth] + " " + currentYear;

  var grid = document.getElementById("calendarGrid");

  // Remove old day cells but keep the 7 day-header cells
  var cells = grid.querySelectorAll(".calendar-day, .empty-cell");
  for (var i = 0; i < cells.length; i++) {
    grid.removeChild(cells[i]);
  }

  // Find what day of the week the 1st falls on
  var firstDay = new Date(currentYear, currentMonth, 1).getDay();
  // Total days in this month
  var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Add blank cells for days before the 1st
  for (var i = 0; i < firstDay; i++) {
    var blank = document.createElement("div");
    blank.className = "calendar-day empty";
    grid.appendChild(blank);
  }

  // Add a cell for each day
  for (var d = 1; d <= daysInMonth; d++) {
    var dateKey = buildDateKey(currentYear, currentMonth, d);

    var cell = document.createElement("div");
    cell.className = "calendar-day";

    // Highlight today
    if (
      d === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    ) {
      cell.classList.add("today");
    }

    // Highlight selected date
    if (dateKey === selectedDate) {
      cell.classList.add("selected");
    }

    // Day number
    var dayNum = document.createElement("div");
    dayNum.className = "day-number";
    dayNum.textContent = d;
    cell.appendChild(dayNum);

    // Show colored dots for tasks on this day
    if (events[dateKey]) {
      for (var e = 0; e < events[dateKey].length; e++) {
        var dot = document.createElement("span");
        dot.className = "day-dot dot-" + events[dateKey][e].priority;
        cell.appendChild(dot);
      }
    }

    // Click to select this day
    cell.onclick = (function(key, dayNumber) {
      return function() { selectDate(key, dayNumber); };
    })(dateKey, d);

    grid.appendChild(cell);
  }
}

function buildDateKey(year, month, day) {
  var m = month + 1;
  return year + "-" + (m < 10 ? "0" + m : m) + "-" + (day < 10 ? "0" + day : day);
}

function selectDate(dateKey, dayNumber) {
  selectedDate = dateKey;

  var label = monthNames[currentMonth] + " " + dayNumber + ", " + currentYear;
  document.getElementById("selectedDateLabel").textContent = "Selected: " + label;
  document.getElementById("eventDayTitle").textContent = label;

  renderCalendar();
  renderEvents();
}

function addEvent() {
  if (!selectedDate) {
    alert("Please click a day on the calendar first.");
    return;
  }

  var input = document.getElementById("eventInput");
  var priority = document.getElementById("eventPriority").value;
  var text = input.value.trim();

  if (text === "") {
    alert("Please enter a task description.");
    return;
  }

  if (!events[selectedDate]) {
    events[selectedDate] = [];
  }

  events[selectedDate].push({
    id: Date.now(),
    text: text,
    priority: priority
  });

  input.value = "";
  saveEvents();
  renderCalendar();
  renderEvents();
}

function deleteEvent(dateKey, id) {
  var list = events[dateKey];
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      list.splice(i, 1);
      break;
    }
  }
  saveEvents();
  renderCalendar();
  renderEvents();
}

function renderEvents() {
  var ul = document.getElementById("eventList");
  ul.innerHTML = "";

  if (!selectedDate || !events[selectedDate] || events[selectedDate].length === 0) {
    var li = document.createElement("li");
    li.className = "empty-message";
    li.textContent = "No tasks for this day.";
    ul.appendChild(li);
    return;
  }

  var list = events[selectedDate];
  for (var i = 0; i < list.length; i++) {
    var ev = list[i];

    var li = document.createElement("li");
    li.className = "task-item " + ev.priority;

    var span = document.createElement("span");
    span.className = "task-text";
    span.textContent = ev.text;

    var badge = document.createElement("span");
    badge.className = "task-badge badge-" + ev.priority;
    badge.textContent = ev.priority.charAt(0).toUpperCase() + ev.priority.slice(1);

    var actions = document.createElement("div");
    actions.className = "task-actions";

    var deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = (function(dateKey, id) {
      return function() { deleteEvent(dateKey, id); };
    })(selectedDate, ev.id);

    actions.appendChild(deleteBtn);
    li.appendChild(span);
    li.appendChild(badge);
    li.appendChild(actions);
    ul.appendChild(li);
  }
}

// Paint the calendar grid immediately, with today auto-selected;
// auth state above will refill it with this user's saved events
// once Firestore responds.
selectDate(buildDateKey(currentYear, currentMonth, today.getDate()), today.getDate());
