import { getFirestore} from "@firebase/firestore";
import {initializeApp} from "firebase/app"
import {getAuth} from "firebase/auth";
import { getStorage} from "firebase/storage";

const firebaseConfig = {
    apiKey:process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGEING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
  };

const app=initializeApp(firebaseConfig)
export const auth= getAuth(app);
export const db= getFirestore(app);
export const storage=getStorage(app);

export const admin="rohitsraut95@gmail.com"
export const color="#645CAA"