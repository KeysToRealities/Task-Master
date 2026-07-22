// Include on any page that requires a logged-in user.
auth.onAuthStateChanged(function (user) {
  if (!user) {
    window.location.href = "login.html";
  }
});

function logout() {
  auth.signOut().then(function () {
    window.location.href = "login.html";
  });
}
