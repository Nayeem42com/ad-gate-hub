import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
const configured = Object.values(firebaseConfig).every(Boolean);
const app = configured ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : null;
export const auth = app ? getAuth(app) : null;
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
provider.addScope('openid');
provider.addScope('https://www.googleapis.com/auth/userinfo.email');
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');

export interface GoogleAuthResult { googleId:string; email:string; displayName:string; photoURL:string; idToken:string }
export const bindGoogleAccountWithOAuth = async (): Promise<GoogleAuthResult> => {
  if (!auth) throw new Error('Firebase is not configured. Complete the setup in .env.local first.');
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  return { googleId:user.uid, email:user.email || '', displayName:user.displayName || 'Google User', photoURL:user.photoURL || '', idToken:await user.getIdToken(true) };
};
export const unbindGoogleOAuth = async () => { if (!auth) throw new Error('Firebase is not configured.'); await signOut(auth); };
