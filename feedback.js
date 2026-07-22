var feedbackCollection = null;
var currentUid = null;

auth.onAuthStateChanged(function (user) {
  if (!user) {
    return;
  }

  currentUid = user.uid;
  feedbackCollection = db.collection("feedback");

  loadFeedback();
});


function submitFeedback() {

  var input = document.getElementById("feedbackInput");
  var text = input.value.trim();

  if (text === "") {
    alert("Please enter some feedback before submitting.");
    return;
  }

  if (!feedbackCollection) {
    return;
  }

  feedbackCollection.add({
    uid: currentUid,
    text: text,
    createdAt: Date.now()
  }).then(function () {
    input.value = "";
    showFeedbackMessage("Thanks for your feedback!");
    loadFeedback();
  });
}


function showFeedbackMessage(message) {
  var messageEl = document.getElementById("feedbackMessage");
  messageEl.textContent = message;

  setTimeout(function () {
    messageEl.textContent = "";
  }, 4000);
}


function loadFeedback() {

  feedbackCollection
    .where("uid", "==", currentUid)
    .get()
    .then(function (snapshot) {
      renderFeedback(snapshot);
    });
}


function renderFeedback(snapshot) {

  var listElement = document.getElementById("feedbackList");
  var emptyMessage = document.getElementById("feedbackEmptyMessage");

  listElement.innerHTML = "";

  if (snapshot.empty) {
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";

  // Sort newest first without needing a Firestore composite index.
  var items = [];
  snapshot.forEach(function (doc) {
    items.push(doc.data());
  });
  items.sort(function (a, b) {
    return b.createdAt - a.createdAt;
  });

  for (var i = 0; i < items.length; i++) {
    var item = items[i];

    var li = document.createElement("li");
    li.className = "feedback-item";

    var text = document.createElement("span");
    text.className = "feedback-text";
    text.textContent = item.text;

    var date = document.createElement("span");
    date.className = "feedback-date";
    date.textContent = new Date(item.createdAt).toLocaleDateString();

    li.appendChild(text);
    li.appendChild(date);
    listElement.appendChild(li);
  }
}
