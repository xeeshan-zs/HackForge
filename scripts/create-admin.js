#!/usr/bin/env node

// This script creates an admin user directly in Firestore
// It doesn't require service account credentials

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function createAdmin() {
  try {
    console.log('🔧 Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    console.log('👤 Creating admin user...');
    const userCredential = await createUserWithEmailAndPassword(auth, 'admin@numl.com', '123456');
    const user = userCredential.user;

    console.log('✅ User created:', user.uid);

    console.log('📝 Adding admin to Firestore...');
    await setDoc(doc(db, 'admins', 'admin@numl.com'), {
      email: 'admin@numl.com',
      uid: user.uid,
      role: 'admin',
      createdAt: new Date().toISOString(),
    });

    console.log('\n✨ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    admin@numl.com');
    console.log('🔐 Password: 123456');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔓 Login at: http://localhost:3000/admin/login');
    console.log('   or: /admin/login\n');

    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 'auth/email-already-in-use') {
      console.log('\n⚠️  Admin user already exists!');
      console.log('   Email: admin@numl.com');
      console.log('   Password: 123456');
    }
    process.exit(1);
  }
}

createAdmin();
