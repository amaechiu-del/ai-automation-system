import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let db: Firestore;

export function getDb(): Firestore {
  if (db) return db;

  const apps = getApps();
  if (apps.length === 0) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  }

  db = getFirestore();
  return db;
}

// Collection helpers
export const Collections = {
  AUTOMATIONS: 'automations',
  TASKS: 'tasks',
  INTEGRATIONS: 'integrations',
  WEBHOOKS: 'webhooks',
  LOGS: 'logs',
  USERS: 'users',
} as const;
