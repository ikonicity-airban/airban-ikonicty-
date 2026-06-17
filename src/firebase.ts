import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { portfolioData } from './data';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();

// Graceful safety net for Firebase iframe/ad-blocker network restrictions
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    if (reason && (
      (reason.message && reason.message.includes('auth/network-request-failed')) ||
      (reason.code && reason.code.includes('auth/network-request-failed')) ||
      String(reason).includes('auth/network-request-failed')
    )) {
      console.warn('[Firebase-SafeNet] Gracefully absorbed iframe-blocked Firebase Auth network request rejection.');
      event.preventDefault();
    }
  });

  window.addEventListener('error', (event) => {
    const error = event.error;
    const msg = event.message;
    if (
      (error && error.message && error.message.includes('auth/network-request-failed')) ||
      (msg && msg.includes('auth/network-request-failed'))
    ) {
      console.warn('[Firebase-SafeNet] Gracefully absorbed iframe-blocked Firebase Auth network error.');
      event.preventDefault();
    }
  });
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
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
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Pre-packaged Seed Database Helper
export async function seedDatabaseIfEmpty() {
  try {
    const user = auth.currentUser;
    const isAuthorizedAdmin = user && user.email === 'ikonicityairban@gmail.com';

    // 1. Projects seed check
    const projectSnap = await getDocs(collection(db, 'projects'));
    if (projectSnap.empty) {
      if (!isAuthorizedAdmin) {
        console.log('// Firestore projects collection is currently vacant. Log in via Cockpit to authorize automatic seeding.');
      } else {
        console.log('// Seeding projects collection from local data...');
        let index = 0;
        for (const p of portfolioData.projects) {
          const docId = p.id;
          // Map to strict Project Schema in firestore.rules
          const docData = {
            title: p.title,
            slug: p.id,
            imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
            status: p.status,
            liveUrl: p.links?.[0]?.url || '#',
            repoUrl: p.links?.[1]?.url || '#',
            description: p.subtitle,
            longDesc: p.description,
            role: p.tag,
            year: '2024',
            stack: p.tech,
            featured: true,
            isVisible: true,
            order: index++
          };
          await setDoc(doc(db, 'projects', docId), docData);
        }
      }
    }

    // 2. Testimonials seed check
    const testimonialSnap = await getDocs(collection(db, 'testimonials'));
    if (testimonialSnap.empty) {
      if (!isAuthorizedAdmin) {
        console.log('// Firestore testimonials collection is currently vacant. Log in via Cockpit to authorize automatic seeding.');
      } else {
        console.log('// Seeding testimonials collection...');
        // Sample high quality feedback testimonials
        const initialTestimonials = [
          {
            quote: "Eban transformed our WhatsApp messaging bottleneck. His automated core routing logic works cleanly, handling thousands of dispatches with ease.",
            authorName: "Engr. Patrick",
            company: "PWorld Concepts",
            authorRole: "Technical Director",
            avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
            isVisible: true,
            order: 0
          },
          {
            quote: "A rare engineer who relishes structural renovation and complex migrations. He cleaned up years of tech debt on iCatholic Igbo Mobile.",
            authorName: "Father Raymond",
            company: "iCatholic Igbo",
            authorRole: "Platform Steward",
            avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
            isVisible: true,
            order: 1
          }
        ];
        for (let i = 0; i < initialTestimonials.length; i++) {
          await addDoc(collection(db, 'testimonials'), {
            ...initialTestimonials[i],
            order: i
          });
        }
      }
    }

    // 3. Availability seed check
    const availabilitySnap = await getDocs(collection(db, 'availability'));
    if (availabilitySnap.empty) {
      if (!isAuthorizedAdmin) {
        console.log('// Firestore availability check is vacant. Log in via Cockpit to authorize automatic seeding.');
      } else {
        console.log('// Seeding availability configuration...');
        await setDoc(doc(db, 'availability', 'global'), {
          status: 'available',
          message: 'Currently building Geek Creations & open to freelance consultation',
          updatedAt: new Date().toISOString()
        });
      }
    }
  } catch (error) {
    console.error('Seeding error:', error);
  }
}
