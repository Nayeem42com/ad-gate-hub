// Run locally after setting GOOGLE_APPLICATION_CREDENTIALS to a Firebase Admin SDK service-account JSON.
// npm install firebase-admin (from project root) then: node scripts/set-admin-claim.mjs USER_UID
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
initializeApp({ credential: applicationDefault() });
const uid = process.argv[2];
if (!uid) throw new Error('Usage: node scripts/set-admin-claim.mjs USER_UID');
const user = await getAuth().getUser(uid);
if (user.email?.toLowerCase() !== 'mdnaimeh73@gmail.com') throw new Error('UID email does not match the configured admin email.');
await getAuth().setCustomUserClaims(uid, { ...(user.customClaims || {}), admin: true });
console.log(`Admin claim assigned to ${user.email}. Sign out and sign in again.`);
