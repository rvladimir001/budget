import "firebase/auth"
import "firebase/database"

import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDbtQoUiDFI-H2Z2jfut_j6m9SmS1BGdbM",
  authDomain: "mybudget-55da2.firebaseapp.com",
  databaseURL: "https://mybudget-55da2-default-rtdb.firebaseio.com",
  projectId: "mybudget-55da2",
  storageBucket: "mybudget-55da2.appspot.com",
  messagingSenderId: "167743225656",
  appId: "1:167743225656:web:95c3b5317f972b9c304bcd"
};

const app = initializeApp(firebaseConfig);
const firebaseDB = getDatabase(app);
const firebaseAuth = getAuth()

export { firebaseDB, firebaseAuth }
