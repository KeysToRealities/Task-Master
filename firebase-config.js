var firebaseConfig = {
  apiKey: "AIzaSyAIBzcR3NnH5hRaeD0JdKeFxmJYxiSIfPE",
  authDomain: "task-master-72375.firebaseapp.com",
  projectId: "task-master-72375",
  storageBucket: "task-master-72375.firebasestorage.app",
  messagingSenderId: "780803187948",
  appId: "1:780803187948:web:0e8765e7044324daf231c9"
};

firebase.initializeApp(firebaseConfig);

var auth = firebase.auth();
var db = firebase.firestore();
