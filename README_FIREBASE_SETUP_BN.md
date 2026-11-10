# Ad Gate Hub — Firebase + Telegram Mini App Setup (বাংলা)

এই প্যাকেজটি আপনার বর্তমান React/Vite UI অক্ষত রেখে Firebase Hosting, Authentication, Firestore rules এবং নিরাপদ Cloud Functions-এর **প্রাথমিক অবকাঠামো** যোগ করে। এটি এখনো লাইভ/প্রোডাকশন অ্যাপ নয়: বর্তমান `src/App.tsx`-এ demo state/localStorage আছে। Wallet, spin, exchange, withdrawal, referral bonus ইত্যাদি প্রতিটি action-কে Cloud Functions-এ স্থানান্তর ও UI-র সঙ্গে যুক্ত না করা পর্যন্ত প্রকৃত টাকা/রিওয়ার্ড চালাবেন না।

## 1) Firebase Project তৈরি
1. https://console.firebase.google.com/ খুলে **Add project** চাপুন। নাম দিন `ad-gate-hub` (বা আপনার পছন্দের নাম)।
2. Project তৈরি হলে Project settings → General → Your apps → Web app (</>) যোগ করুন। প্রদর্শিত Firebase web config কপি করুন।
3. Authentication → Sign-in method → **Google** Enable করুন। Support email নির্বাচন করে Save করুন।
4. Authentication → Settings → Authorized domains-এ `localhost` এবং পরে আপনার Hosting domain যোগ করুন।
5. Firestore Database → Create database → production mode নির্বাচন করুন। Location স্থায়ীভাবে বেছে নিন (ব্যবহারকারীদের কাছাকাছি উপযুক্ত অঞ্চল)।
6. Project settings → General থেকে Project ID নিন।

## 2) লোকাল config
- `.env.example` কপি করে `.env.local` করুন।
- Firebase Web App config-এর মানগুলো `VITE_FIREBASE_*` ভ্যারিয়েবলে বসান।
- `VITE_TELEGRAM_BOT_USERNAME`-এ `@` ছাড়া Bot username দিন।
- Firebase Web API key ক্লায়েন্টে থাকা স্বাভাবিক; **Service Account JSON, private key, Bot token বা secret কখনো VITE_ ভ্যারিয়েবলে দেবেন না**।

## 3) Hosting deploy
```bash
npm install
npm run build
npm install -g firebase-tools
firebase login
cp .firebaserc.example .firebaserc
# .firebaserc-এর YOUR_FIREBASE_PROJECT_ID বদলান
firebase use YOUR_FIREBASE_PROJECT_ID
firebase deploy --only hosting,firestore:rules,firestore:indexes
```
Hosting URL হবে `https://YOUR_PROJECT_ID.web.app` (অথবা Firebase custom domain)। Hosting custom domain Firebase Console → Hosting → Add custom domain থেকে যুক্ত করুন; Firebase HTTPS certificate স্বয়ংক্রিয়ভাবে দেয়।

## 4) Cloud Functions
```bash
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```
Functions deploy-এর জন্য Blaze billing plan লাগতে পারে। আগে Firebase pricing/usage limits দেখে নিন। `initializeUser` এবং `claimTask` প্রাথমিক উদাহরণ; UI এখনো এগুলো invoke করে না। Task completion-এ বাস্তব প্রমাণ যাচাই (যেমন server-side Telegram membership বা provider callback) যোগ না করে reward claim চালু করবেন না।

## 5) Admin claim
1. Admin Gmail `mdnaimeh73@gmail.com` দিয়ে Google sign-in একবার সম্পন্ন করুন।
2. Firebase Authentication → Users থেকে ঐ অ্যাকাউন্টের UID কপি করুন।
3. নিরাপদ লোকাল মেশিনে Firebase Admin SDK service account credential সেট করুন (`GOOGLE_APPLICATION_CREDENTIALS`); key কখনো চ্যাটে বা public repo-তে দেবেন না।
4. `scripts/set-admin-claim.mjs` চালানোর জন্য root-এ `firebase-admin` dependency ইনস্টল করুন, তারপর:
```bash
GOOGLE_APPLICATION_CREDENTIALS=/secure/path/service-account.json node scripts/set-admin-claim.mjs FIREBASE_AUTH_UID
```
5. Admin ব্যবহারকারীকে sign out/in করতে হবে। Admin status শুধু server-issued custom claim থেকে যাচাই হবে; client-side email check বা PIN নিরাপদ নয়।

## 6) Telegram Mini App
1. BotFather → আপনার bot → Bot Settings → Configure Mini App / Menu Button (যেটি উপলব্ধ) থেকে HTTPS Hosting URL দিন।
2. BotFather-এর Web App URL হিসেবে `https://YOUR_PROJECT_ID.web.app` ব্যবহার করুন।
3. Telegram Web App init data backend-এ পাঠিয়ে **server-side HMAC signature ও auth_date যাচাই** করুন। শুধু `initDataUnsafe` বা client-supplied Telegram user ID বিশ্বাস করবেন না। এই যাচাই endpoint এই starter-এ এখনো যোগ করা হয়নি।
4. Referral deep link format: `https://t.me/YOUR_BOT_USERNAME?startapp=REFERRAL_CODE`; start_param server-এ যাচাই করে একবার attribution লিখুন।

## 7) গুরুত্বপূর্ণ অসম্পূর্ণ integration
- বর্তমান App-এর demo balances, sample referrals, sample transactions, admin PIN `1234` এবং localStorage persistence এখনো UI-তে আছে। এগুলো production-এ ব্যবহার করা যাবে না।
- Google OAuth service config env-based করা হয়েছে, কিন্তু Google identity-কে Telegram account-এর সঙ্গে নিরাপদে bind করার server callable flow এখনো UI-তে wired নয়। Firebase Auth user-কে সরাসরি Telegram UID ধরে নেবেন না।
- Deposit/withdrawal/exchange/Spin/referral payouts-এর server validation, idempotency keys, rate limits, audit trail, abuse prevention এবং admin approval workflow সম্পূর্ণ করতে হবে।
- Firestore rules client-side wallet writes বন্ধ রেখেছে; সঠিক Cloud Functions না জুড়ে UI থেকে wallet update হবে না—এটাই নিরাপদ default।
- Deploy করার আগে emulator-এ rules/functions পরীক্ষা, production secrets, billing alerts, App Check এবং backup policy সেট করুন।

## 8) নিরাপত্তা
কখনোই client থেকে balance, reward amount, admin flag, referral owner বা transaction status গ্রহণ করবেন না। Server config থেকে reward amount পড়ুন, transaction-এ balance ও ledger একসঙ্গে update করুন, duplicate request আটকাতে idempotency document ব্যবহার করুন। Admin actions audit করুন।
