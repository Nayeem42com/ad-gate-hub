import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

initializeApp();
const db = getFirestore();
const needAuth = (request: { auth?: { uid: string; token: Record<string, unknown> } | null }) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in required.');
  return request.auth;
};
const needAdmin = (request: { auth?: { uid: string; token: Record<string, unknown> } | null }) => {
  const auth = needAuth(request);
  if (auth.token.admin !== true) throw new HttpsError('permission-denied', 'Admin only.');
  return auth;
};

// Initialize profile exactly once; referral code attribution cannot be changed by clients.
export const initializeUser = onCall(async (request) => {
  const auth = needAuth(request); const uid = auth.uid;
  const rawCode = typeof request.data?.referralCode === 'string' ? request.data.referralCode.trim().toUpperCase() : '';
  const userRef = db.doc(`users/${uid}`);
  await db.runTransaction(async tx => {
    const existing = await tx.get(userRef); if (existing.exists) return;
    let referrerUid: string | null = null;
    if (rawCode) {
      const codeDoc = await tx.get(db.doc(`referralCodes/${rawCode}`));
      if (codeDoc.exists && codeDoc.get('uid') !== uid) referrerUid = codeDoc.get('uid');
    }
    const code = uid.slice(0, 8).toUpperCase();
    tx.create(userRef, { uid, displayName: String(auth.token.name || ''), photoURL: String(auth.token.picture || ''), email: String(auth.token.email || ''), points: 0, usdt: 0, referralCode: code, referredBy: referrerUid, createdAt: FieldValue.serverTimestamp() });
    tx.create(db.doc(`referralCodes/${code}`), { uid, createdAt: FieldValue.serverTimestamp() });
    if (referrerUid) tx.create(db.collection('referrals').doc(`${referrerUid}_${uid}`), { referrerUid, referredUid: uid, createdAt: FieldValue.serverTimestamp(), status: 'joined' });
  });
  return { ok: true };
});

// Never accept a client-supplied balance or reward amount. Admin-configured task docs own values.
export const claimTask = onCall(async (request) => {
  const auth = needAuth(request); const taskId = String(request.data?.taskId || '');
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(taskId)) throw new HttpsError('invalid-argument', 'Invalid task.');
  const userRef = db.doc(`users/${auth.uid}`); const taskRef = db.doc(`tasks/${taskId}`); const claimRef = db.doc(`taskClaims/${auth.uid}_${taskId}`);
  await db.runTransaction(async tx => {
    const [user, task, claim] = await Promise.all([tx.get(userRef), tx.get(taskRef), tx.get(claimRef)]);
    if (!user.exists || !task.exists || task.get('active') !== true) throw new HttpsError('failed-precondition', 'Task unavailable.');
    if (claim.exists) throw new HttpsError('already-exists', 'Task already claimed.');
    const reward = Number(task.get('rewardPoints'));
    if (!Number.isSafeInteger(reward) || reward <= 0 || reward > 1000000) throw new HttpsError('failed-precondition', 'Invalid task reward configuration.');
    tx.update(userRef, { points: FieldValue.increment(reward), updatedAt: FieldValue.serverTimestamp() });
    tx.create(claimRef, { uid: auth.uid, taskId, rewardPoints: reward, createdAt: FieldValue.serverTimestamp() });
    tx.create(db.collection('transactions').doc(), { uid: auth.uid, type: 'task_reward', amount: reward, unit: 'POINTS', taskId, createdAt: FieldValue.serverTimestamp() });
  });
  return { ok: true };
});

export const adminSetUserDisabled = onCall(async request => {
  needAdmin(request); const uid = String(request.data?.uid || ''); const disabled = request.data?.disabled;
  if (!uid || typeof disabled !== 'boolean') throw new HttpsError('invalid-argument', 'uid and disabled are required.');
  await getAuth().updateUser(uid, { disabled });
  await db.collection('adminAudit').add({ actorUid: request.auth!.uid, action: disabled ? 'disable_user' : 'enable_user', targetUid: uid, createdAt: FieldValue.serverTimestamp() });
  return { ok: true };
});
