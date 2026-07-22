var dailyChecklist = [];
var todayDate = new Date().toLocaleDateString("en-CA");
var checklistDocRef = null;

// Load the checklist once we know who's logged in.
auth.onAuthStateChanged(function (user) {
  if (!user) {
    return;
  }

  checklistDocRef = db.collection("checklists").doc(user.uid);

  checklistDocRef.get().then(function (doc) {
    if (doc.exists) {
      var data = doc.data();
      dailyChecklist = data.items || [];

      // Reset completed items when a new day begins
      if (data.date !== todayDate) {
        for (var i = 0; i < dailyChecklist.length; i++) {
          dailyChecklist[i].completed = false;
        }
        saveDailyChecklist();
      }
    }

    renderDailyChecklist();
  });
});


// Save the checklist to Firestore
function saveDailyChecklist() {

  if (!checklistDocRef) {
    return;
  }

  checklistDocRef.set({
    items: dailyChecklist,
    date: todayDate
  });
}


// Add a checklist item
function addChecklistItem() {

  var checklistInput =
    document.getElementById("checklistInput");

  var checklistText =
    checklistInput.value.trim();

  // Prevent an empty checklist item
  if (checklistText === "") {
    alert("Please enter a checklist item.");
    checklistInput.focus();
    return;
  }

  // Create a checklist item object
  var checklistItem = {
    id: Date.now(),
    text: checklistText,
    completed: false
  };

  // Add the item to the array
  dailyChecklist.push(checklistItem);

  // Save and display the updated checklist
  saveDailyChecklist();
  renderDailyChecklist();

  // Clear the input
  checklistInput.value = "";
  checklistInput.focus();
}


// Display checklist items
function renderDailyChecklist() {

  var checklistElement =
    document.getElementById("dailyChecklist");

  var emptyMessage =
    document.getElementById("checklistEmptyMessage");

  // Stop if the checklist section is not on this page
  if (!checklistElement || !emptyMessage) {
    return;
  }

  // Remove the currently displayed items
  checklistElement.innerHTML = "";

  // Show or hide the empty message
  if (dailyChecklist.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }

  // Create each checklist item
  for (var i = 0; i < dailyChecklist.length; i++) {

    createChecklistItem(
      dailyChecklist[i],
      checklistElement
    );
  }

  updateChecklistProgress();
}


// Create one checklist item
function createChecklistItem(item, checklistElement) {

  // Create the list item
  var listItem =
    document.createElement("li");

  listItem.className = "checklist-item";

  if (item.completed === true) {
    listItem.classList.add("completed");
  }

  // Create the label
  var label =
    document.createElement("label");

  label.className = "checklist-label";

  // Create the checkbox
  var checkbox =
    document.createElement("input");

  checkbox.type = "checkbox";
  checkbox.className = "checklist-checkbox";
  checkbox.checked = item.completed;

  checkbox.onchange = function() {
    toggleChecklistItem(item.id);
  };

  // Create the checklist text
  var text =
    document.createElement("span");

  text.className = "checklist-text";
  text.textContent = item.text;

  // Add checkbox and text to the label
  label.appendChild(checkbox);
  label.appendChild(text);

  // Create the delete button
  var deleteButton =
    document.createElement("button");

  deleteButton.className =
    "checklist-delete-button";

  deleteButton.textContent = "Delete";

  deleteButton.onclick = function() {
    deleteChecklistItem(item.id);
  };

  // Add everything to the list item
  listItem.appendChild(label);
  listItem.appendChild(deleteButton);

  // Add the list item to the checklist
  checklistElement.appendChild(listItem);
}


// Check or uncheck a checklist item
function toggleChecklistItem(id) {

  for (var i = 0; i < dailyChecklist.length; i++) {

    if (dailyChecklist[i].id === id) {

      dailyChecklist[i].completed =
        !dailyChecklist[i].completed;

      break;
    }
  }

  saveDailyChecklist();
  renderDailyChecklist();
}


function deleteChecklistItem(id) {

  var updatedChecklist = [];

  for (var i = 0; i < dailyChecklist.length; i++) {

    if (dailyChecklist[i].id !== id) {
      updatedChecklist.push(dailyChecklist[i]);
    }
  }

  dailyChecklist = updatedChecklist;

  saveDailyChecklist();
  renderDailyChecklist();
}


function updateChecklistProgress() {

  var checklistProgress =
    document.getElementById("checklistProgress");

  if (!checklistProgress) {
    return;
  }

  var completedItems = 0;

  for (var i = 0; i < dailyChecklist.length; i++) {

    if (dailyChecklist[i].completed === true) {
      completedItems++;
    }
  }

  checklistProgress.textContent =
    completedItems +
    " of " +
    dailyChecklist.length +
    " completed";
}


var checklistInput =
  document.getElementById("checklistInput");

if (checklistInput) {

  checklistInput.addEventListener(
    "keydown",
    function(event) {

      if (event.key === "Enter") {
        addChecklistItem();
      }
    }
  );
}
