// Greets the user based on the time of day and shows today's date.
function setGreeting(name) {
  var hour = new Date().getHours();
  var greeting;

  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  document.getElementById("greeting").textContent =
    name ? greeting + ", " + name + "!" : greeting + "!";
}

function setTodayDate() {
  var today = new Date();
  var options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  document.getElementById("todayDate").textContent = today.toLocaleDateString(undefined, options);
}

auth.onAuthStateChanged(function (user) {
  if (!user) {
    return;
  }

  var freshName = sessionStorage.getItem("taskMasterJustSignedUpName");
  if (freshName) {
    sessionStorage.removeItem("taskMasterJustSignedUpName");
    setGreeting(freshName);
  } else {
    setGreeting(user.displayName);
  }
});

setTodayDate();
