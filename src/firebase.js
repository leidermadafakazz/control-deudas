import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyC9OwZlgrlAusaC1uEf0WntxWknwFkXqKs",
  authDomain: "control-deudas-c68e0.firebaseapp.com",
  projectId: "control-deudas-c68e0",
  storageBucket: "control-deudas-c68e0.firebasestorage.app",
  messagingSenderId: "135208329252",
  appId: "1:135208329252:web:ab05afa93be4750f7df8b1"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db   = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
