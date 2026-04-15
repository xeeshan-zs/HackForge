// Quick Setup: Copy & Paste in Browser Console on ANY page
// This creates the admin user using client-side Firebase SDK

(async function() {
  try {
    const { getAuth, createUserWithEmailAndPassword } = await import('https://www.gstatic.com/firebaselibs/9.0.0/firebase-auth.js');
    const { getFirestore, doc, setDoc } = await import('https://www.gstatic.com/firebaselibs/9.0.0/firebase-firestore.js');
    
    // Firebase config from .env.local
    const firebaseConfig = {
      apiKey: "AIzaSyDhmS45CgQW9x_N8rJiutlMyWtYOJTUijA",
      authDomain: "hackforge-numl.firebaseapp.com",
      projectId: "hackforge-numl",
      storageBucket: "hackforge-numl.firebasestorage.app",
      messagingSenderId: "700067389983",
      appId: "1:700067389983:web:5ee520e77d7fe472c6ab2a",
    };

    const app = window.firebase.initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    console.log('👤 Creating admin user: admin@numl.com...');
    
    const userCredential = await createUserWithEmailAndPassword(auth, 'admin@numl.com', '123456');
    const user = userCredential.user;

    console.log('✅ Auth user created:', user.uid);

    await setDoc(doc(db, 'admins', 'admin@numl.com'), {
      email: 'admin@numl.com',
      uid: user.uid,
      role: 'admin',
      createdAt: new Date().toISOString(),
    });

    console.log('%c✨ ADMIN CREATED SUCCESSFULLY!', 'color: green; font-size: 16px; font-weight: bold;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: green;');
    console.log('%c📧 Email: admin@numl.com', 'color: blue; font-size: 14px;');
    console.log('%c🔐 Password: 123456', 'color: blue; font-size: 14px;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: green;');
    console.log('%c\n🔓 Go to /admin/login', 'color: green; font-size: 14px; font-weight: bold;');

  } catch (error: any) {
    console.error('%c❌ Error:', 'color: red; font-weight: bold;', error.message);
    if (error.code === 'auth/email-already-in-use') {
      console.log('%c⚠️  Admin already exists!', 'color: orange;');
    }
  }
})();
