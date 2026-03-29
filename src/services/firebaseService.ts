import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  getDocFromServer
} from 'firebase/firestore';
import { db, auth } from '../firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. ");
    }
  }
}

// User Profile
export async function createUserProfile(uid: string, email: string, displayName: string, photoURL: string) {
  const path = `users/${uid}`;
  try {
    await setDoc(doc(db, 'users', uid), {
      uid,
      email,
      displayName,
      photoURL,
      role: email === 'hesinhthaittt@gmail.com' ? 'admin' : 'user',
      status: 'active',
      createdAt: Timestamp.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserProfile(uid: string) {
  const path = `users/${uid}`;
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// Requests
export function subscribeToRequests(callback: (requests: any[]) => void, userId?: string, isAdmin?: boolean) {
  const path = 'requests';
  let q = query(collection(db, 'requests'));
  
  if (!isAdmin && userId) {
    q = query(collection(db, 'requests'), where('userId', '==', userId));
  }

  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(requests);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

export async function createRequest(data: any) {
  const path = 'requests';
  try {
    await addDoc(collection(db, 'requests'), {
      ...data,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Events
export function subscribeToEvents(callback: (events: any[]) => void) {
  const path = 'events';
  const q = query(collection(db, 'events'));
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(events);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

// Attendance
export function subscribeToAttendance(callback: (records: any[]) => void, userId?: string, isAdmin?: boolean) {
  const path = 'attendance';
  let q = query(collection(db, 'attendance'));
  if (!isAdmin && userId) {
    q = query(collection(db, 'attendance'), where('userId', '==', userId));
  }
  return onSnapshot(q, (snapshot) => {
    const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(records);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

// Payroll
export function subscribeToPayroll(callback: (records: any[]) => void, userId?: string, isAdmin?: boolean) {
  const path = 'payroll';
  let q = query(collection(db, 'payroll'));
  if (!isAdmin && userId) {
    q = query(collection(db, 'payroll'), where('userId', '==', userId));
  }
  return onSnapshot(q, (snapshot) => {
    const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(records);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

// Personnel (Admin only)
export function subscribeToPersonnel(callback: (users: any[]) => void) {
  const path = 'users';
  const q = query(collection(db, 'users'));
  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(users);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

// Settings
export function subscribeToSettings(callback: (settings: any[]) => void) {
  const path = 'settings';
  const q = query(collection(db, 'settings'));
  return onSnapshot(q, (snapshot) => {
    const settings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(settings);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

export async function updateSetting(key: string, value: any) {
  const path = `settings/${key}`;
  try {
    await setDoc(doc(db, 'settings', key), {
      key,
      value,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
