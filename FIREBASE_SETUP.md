Setup Firebase & Firestore (local example)

1) Create a Firebase project at https://console.firebase.google.com/ and enable Firestore.

2) Copy credentials into a `.env.local` at the project root (do NOT commit secrets):

VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

3) Run the dev server:
```bash
npm install
npm run dev
```

4) Open the app at `http://localhost:5173`. If Firebase is configured (the `VITE_FIREBASE_API_KEY` var is set), the app will attempt to load/save a single Firestore document at `app/state` to sync users, jobs, applications and theme.

5) To inspect Firestore writes, open the Firebase Console → Firestore Database and look for collection `app` → document `state`.

Notes
- The app falls back to `localStorage` when Firebase is not configured or initialization fails.
- For production, secure access rules in Firestore; this example stores a single app-state document for development convenience only.

--

Optional: quick permissive rules for local development

If you want to quickly remove the "Missing or insufficient permissions" errors while developing (do NOT use these in production), update your Firestore rules in the Firebase Console → Firestore → Rules to:

```
service cloud.firestore {
	match /databases/{database}/documents {
		match /{document=**} {
			// WARNING: development-only permissive rules
			allow read, write: if true;
		}
	}
}
```

OR — safer: run the local Firestore emulator and connect the app to it. Example `.env` entries:

```
VITE_FIREBASE_EMULATOR_HOST=localhost
VITE_FIREBASE_EMULATOR_PORT=8080
```

Then start the emulator and the dev server:

```bash
firebase emulators:start --only firestore
npm run dev
```

When running the emulator the app will log a message like `Connecting Firestore to emulator localhost:8080` and reads/writes go to your local emulator instead of production.

6) To create an admin user for the application, run the admin creation script:

```bash
node scripts/create-admin.js
```

This script will prompt you to enter the admin email and password interactively. It will create the admin user in the Firebase Auth and Firestore emulators. Note: The credentials are not stored in the code and must be provided each time the script is run.
