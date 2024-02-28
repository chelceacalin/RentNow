import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: "AIzaSyCZe99xcbISEyBHt-Cg2-KVPxAByLm1Vso",
  authDomain: "appdisertatie-98250.firebaseapp.com",
  projectId: "appdisertatie-98250",
  storageBucket: "appdisertatie-98250.appspot.com",
  messagingSenderId: "275653755384",
  appId: "1:275653755384:web:3fda3838333ccf6323d60d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider= new GoogleAuthProvider();
export { auth, provider }