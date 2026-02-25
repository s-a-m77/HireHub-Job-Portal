// Script to create an admin user in Firebase Emulator
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

(async function () {
  let adminEmail, adminPassword;

  if (process.argv[2] && process.argv[3]) {
    adminEmail = process.argv[2];
    adminPassword = process.argv[3];
  } else {
    adminEmail = await new Promise(resolve => rl.question('Enter admin email: ', resolve));
    adminPassword = await new Promise(resolve => rl.question('Enter admin password: ', resolve));
  }

  const adminName = 'Admin User';

  // Create user in Auth emulator
  const authUrl = 'http://localhost:19099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=dummy';

  const authBody = {
    email: adminEmail,
    password: adminPassword,
    returnSecureToken: true
  };

  try {
    console.log('Creating admin user in Auth emulator...');
    const authRes = await fetch(authUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authBody)
    });

    if (!authRes.ok) {
      throw new Error(`Auth creation failed: ${authRes.status}`);
    }

    const authData = await authRes.json();
    const uid = authData.localId;

    console.log('Auth user created with UID:', uid);

    // Create user profile in Firestore emulator (port must match firebase.json -> 18087)
    const firestoreUrl = `http://localhost:18087/v1/projects/intern-7403e/databases/(default)/documents/users/${uid}`;

    // This shape matches the `User` type used in the app so the admin
    // behaves like any other user (especially for role checks & IDs).
    const userData = {
      fields: {
        uid: { stringValue: uid },
        id: { stringValue: uid },
        name: { stringValue: adminName },
        email: { stringValue: adminEmail },
        role: { stringValue: 'admin' },
        createdAt: { stringValue: new Date().toISOString() },
        skills: { arrayValue: { values: [] } },
        education: { stringValue: '' },
        bio: { stringValue: '' },
        phone: { stringValue: '' }
      }
    };

    console.log('Creating user profile in Firestore...');
    const firestoreRes = await fetch(firestoreUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!firestoreRes.ok) {
      throw new Error(`Firestore creation failed: ${firestoreRes.status}`);
    }

    console.log('Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('You can now log in as admin at /admin');

  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    rl.close();
  }
})();
