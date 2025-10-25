import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDygqXdvEhqf0Imv1tfNuNk3Fe8AxZ8dqM",
  authDomain: "careerflow-ai-ff250.firebaseapp.com",
  projectId: "careerflow-ai-ff250",
  storageBucket: "careerflow-ai-ff250.firebasestorage.app",
  messagingSenderId: "534779561103",
  appId: "1:534779561103:web:441a78f7f9d40f98d69cfa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;