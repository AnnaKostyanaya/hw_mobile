import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAzf6O7eceBaIXRwBB6lZy3HTMVXhDPh7g",
  authDomain: "react-native-213ce.firebaseapp.com",
  projectId: "react-native-213ce",
  storageBucket: "react-native-213ce.appspot.com",
  messagingSenderId: "1028713217366",
  appId: "1:1028713217366:web:17d10caee8a50fa6202af7",
  measurementId: "G-KM8YQ31YVQ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export default firebaseConfig;
export {app, auth, db, storage }; 
