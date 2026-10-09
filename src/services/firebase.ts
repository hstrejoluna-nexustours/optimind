import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocFromServer, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  Unsubscribe 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { AbcdeEntry, MoodCheckIn, PlanTier } from '../types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with firestoreDatabaseId (CRITICAL: App will break without this)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Verify connection on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or starting up.');
    }
    return false;
  }
}
testConnection();

// Standard Error Handling conforming to FirestoreErrorInfo
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
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// User Profile Data Structure
export interface UserProfileData {
  userId: string;
  displayName: string;
  email: string;
  photoURL: string;
  streak: number;
  totalWorkouts: number;
  plan?: PlanTier;
  bookmarkedTerms: string[];
  createdAt: string;
  updatedAt: string;
}

// Auth Handlers
export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In failed', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-Out failed', error);
    throw error;
  }
}

// Ensure User Document Exists in Firestore
export async function syncUserProfile(
  user: User, 
  currentStreak: number = 3, 
  totalWorkouts: number = 0,
  bookmarkedTerms: string[] = []
): Promise<UserProfileData> {
  const userDocRef = doc(db, 'users', user.uid);
  try {
    const existingSnap = await getDoc(userDocRef);
    const now = new Date().toISOString();
    
    if (existingSnap.exists()) {
      const data = existingSnap.data() as UserProfileData;
      const updatedProfile: UserProfileData = {
        userId: user.uid,
        displayName: user.displayName || data.displayName || 'Practicante de Optimismo',
        email: user.email || data.email || '',
        photoURL: user.photoURL || data.photoURL || '',
        streak: Math.max(data.streak || 0, currentStreak),
        totalWorkouts: Math.max(data.totalWorkouts || 0, totalWorkouts),
        plan: data.plan || 'free',
        bookmarkedTerms: Array.isArray(data.bookmarkedTerms) ? data.bookmarkedTerms : bookmarkedTerms,
        createdAt: data.createdAt || now,
        updatedAt: now
      };
      await setDoc(userDocRef, updatedProfile, { merge: true });
      return updatedProfile;
    } else {
      const newProfile: UserProfileData = {
        userId: user.uid,
        displayName: user.displayName || 'Practicante de Optimismo',
        email: user.email || '',
        photoURL: user.photoURL || '',
        streak: currentStreak,
        totalWorkouts: totalWorkouts,
        plan: 'free',
        bookmarkedTerms: bookmarkedTerms,
        createdAt: now,
        updatedAt: now
      };
      await setDoc(userDocRef, newProfile);
      return newProfile;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
  }
}

// Update MicroSaaS Subscription Tier
export async function updateUserSubscriptionPlan(userId: string, plan: PlanTier): Promise<void> {
  const userDocRef = doc(db, 'users', userId);
  try {
    await setDoc(userDocRef, {
      plan,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}`);
  }
}

// Real-time Subscriptions for ABCDE Entries
export function subscribeToUserEntries(
  userId: string,
  onEntries: (entries: AbcdeEntry[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = `users/${userId}/entries`;
  const entriesCol = collection(db, 'users', userId, 'entries');

  return onSnapshot(entriesCol, (snapshot) => {
    const list: AbcdeEntry[] = [];
    snapshot.forEach(docSnap => {
      list.push(docSnap.data() as AbcdeEntry);
    });
    // Sort descending by createdAt
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    onEntries(list);
  }, (error) => {
    if (onError) onError(error);
    handleFirestoreError(error, OperationType.GET, path);
  });
}

// Save ABCDE Entry
export async function saveUserEntryToCloud(userId: string, entry: AbcdeEntry): Promise<void> {
  const sanitizedId = entry.id.replace(/[^a-zA-Z0-9_\-]/g, '_');
  const path = `users/${userId}/entries/${sanitizedId}`;
  const entryDoc = doc(db, 'users', userId, 'entries', sanitizedId);
  const now = new Date().toISOString();

  const payload: any = {
    ...entry,
    id: sanitizedId,
    userId,
    updatedAt: now,
    createdAt: entry.createdAt || now
  };

  try {
    await setDoc(entryDoc, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete ABCDE Entry
export async function deleteUserEntryFromCloud(userId: string, entryId: string): Promise<void> {
  const sanitizedId = entryId.replace(/[^a-zA-Z0-9_\-]/g, '_');
  const path = `users/${userId}/entries/${sanitizedId}`;
  const entryDoc = doc(db, 'users', userId, 'entries', sanitizedId);

  try {
    await deleteDoc(entryDoc);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Real-time Subscriptions for Mood Check-Ins
export function subscribeToUserMoods(
  userId: string,
  onMoods: (moods: MoodCheckIn[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = `users/${userId}/moods`;
  const moodsCol = collection(db, 'users', userId, 'moods');

  return onSnapshot(moodsCol, (snapshot) => {
    const list: MoodCheckIn[] = [];
    snapshot.forEach(docSnap => {
      list.push(docSnap.data() as MoodCheckIn);
    });
    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    onMoods(list);
  }, (error) => {
    if (onError) onError(error);
    handleFirestoreError(error, OperationType.GET, path);
  });
}

// Save Mood Check-In
export async function saveUserMoodToCloud(userId: string, mood: MoodCheckIn): Promise<void> {
  const sanitizedId = mood.id.replace(/[^a-zA-Z0-9_\-]/g, '_');
  const path = `users/${userId}/moods/${sanitizedId}`;
  const moodDoc = doc(db, 'users', userId, 'moods', sanitizedId);
  const now = new Date().toISOString();

  const payload: any = {
    ...mood,
    id: sanitizedId,
    userId,
    createdAt: now
  };

  try {
    await setDoc(moodDoc, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Save Bookmarks to Cloud Profile
export async function saveBookmarksToCloud(userId: string, bookmarks: string[]): Promise<void> {
  const userDocRef = doc(db, 'users', userId);
  try {
    await setDoc(userDocRef, {
      bookmarkedTerms: bookmarks.slice(0, 50),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}`);
  }
}

// Migrate/Sync guest local data up to Cloud when user logs in
export async function migrateLocalDataToCloud(
  userId: string,
  localEntries: AbcdeEntry[],
  localMoods: MoodCheckIn[],
  localBookmarks: string[]
): Promise<void> {
  try {
    // 1. Sync entries
    for (const entry of localEntries) {
      await saveUserEntryToCloud(userId, entry);
    }
    // 2. Sync moods
    for (const mood of localMoods) {
      await saveUserMoodToCloud(userId, mood);
    }
    // 3. Sync bookmarks & profile
    await saveBookmarksToCloud(userId, localBookmarks);
  } catch (error) {
    console.error('Error during local to cloud migration:', error);
  }
}
