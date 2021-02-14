import firebase from "firebase"


const firebaseConfig = {
	apiKey: "AIzaSyBfyryGcSqiJ8H2_YD-9fVe4nu7Ed0i0wo",
	authDomain: "netflix-clone-5bd1b.firebaseapp.com",
	projectId: "netflix-clone-5bd1b",
	storageBucket: "netflix-clone-5bd1b.appspot.com",
	messagingSenderId: "72261147378",
	appId: "1:72261147378:web:dddfb1e8c00ede67628e6b",
	measurementId: "G-Y7JDQJR86X",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export {auth};
export default db;