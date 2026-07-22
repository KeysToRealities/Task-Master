var nameInput = document.getElementById("name");
var formTitle = document.getElementById("formTitle");
var submitBtn = document.getElementById("submitBtn");
var toggleModeText = document.getElementById("toggleModeText");
var toggleModeLink = document.getElementById("toggleModeLink");

var mode = "login";

function applyMode() {
  if (mode === "signup") {
    formTitle.textContent = "Sign Up";
    submitBtn.textContent = "Sign Up";
    nameInput.style.display = "block";
    toggleModeText.textContent = "Already have an account?";
    toggleModeLink.textContent = "Log In";
  } else {
    formTitle.textContent = "Log In";
    submitBtn.textContent = "Log In";
    nameInput.style.display = "none";
    toggleModeText.textContent = "Don't have an account?";
    toggleModeLink.textContent = "Sign Up";
  }
}

// Start in whichever mode the link on the welcome page pointed to.
var params = new URLSearchParams(window.location.search);
if (params.get("mode") === "signup") {
  mode = "signup";
}
applyMode();

toggleModeLink.addEventListener("click", function (e) {
  e.preventDefault();
  mode = mode === "signup" ? "login" : "signup";
  applyMode();
});

function showError(message) {
  var errorEl = document.getElementById("loginError");
  errorEl.textContent = message;
  errorEl.style.display = "block";
}

submitBtn.addEventListener("click", function () {
  var email = document.getElementById("email").value.trim();
  var password = document.getElementById("password").value;

  if (mode === "signup") {
    var name = nameInput.value.trim();

    auth.createUserWithEmailAndPassword(email, password)
      .then(function (credential) {
        if (name === "") {
          return;
        }
        // Firebase can take a moment to make a fresh displayName visible on
        // reload, so hand it to the home page directly instead of relying on
        // that propagation to finish before the redirect below.
        sessionStorage.setItem("taskMasterJustSignedUpName", name);
        return credential.user.updateProfile({ displayName: name });
      })
      .then(function () {
        window.location.href = "home.html";
      })
      .catch(function (error) {
        showError(error.message);
      });
  } else {
    auth.signInWithEmailAndPassword(email, password)
      .then(function () {
        window.location.href = "home.html";
      })
      .catch(function (error) {
        showError(error.message);
      });
  }
});

// Already logged in? Skip straight to the app.
auth.onAuthStateChanged(function (user) {
  if (user) {
    window.location.href = "home.html";
  }
});
