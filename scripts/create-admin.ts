// Simple script to create admin in Firestore only
// Firebase Auth user creation should be done via Firebase Console or CLI

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase (requires GOOGLE_APPLICATION_CREDENTIALS env var)
try {
  const app = initializeApp({
    projectId: 'hackforge-numl',
  });

  const auth = getAuth(app);
  const db = getFirestore(app);

  async function createAdmin() {
    try {
      console.log('Creating admin user...');
      
      // Create user in Firebase Auth
      const userRecord = await auth.createUser({
        email: 'admin@numl.com',
        password: '123456',
        emailVerified: true
      });
      
      console.log('✅ User created in Auth:', userRecord.uid);
      
      // Add to admins collection in Firestore
      await db.collection('admins').doc('admin@numl.com').set({
        email: 'admin@numl.com',
        role: 'admin',
        uid: userRecord.uid,
        createdAt: new Date()
      });
      
      console.log('✅ Admin added to Firestore collection');
      console.log('\n✨ Admin user created successfully!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Email: admin@numl.com');
      console.log('Password: 123456');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n🔓 Login at: /admin/login');
      
      process.exit(0);
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  }

  createAdmin();
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  process.exit(1);
}
