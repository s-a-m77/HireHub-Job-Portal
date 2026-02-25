import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, firestore } from '@/firebase/firebase';
import type { User } from '@/types';

interface AuthContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  register: (userData: Omit<User, 'uid' | 'id' | 'createdAt'>, password?: string) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeDoc: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        // Subscribe to user profile from Firestore
        unsubscribeDoc = onSnapshot(doc(firestore, 'users', user.uid), (docSnap) => {
          if (docSnap.exists()) {
            setCurrentUser(docSnap.data() as User);
          } else {
            // User authenticated but no profile yet (e.g. mid-registration)
            setCurrentUser(null);
          }
          setLoading(false);
        }, (error) => {
          console.error('Error listening to user profile:', error);
          setCurrentUser(null);
          setLoading(false);
        });
      } else {
        setCurrentUser(null);
        setLoading(false);
        if (unsubscribeDoc) unsubscribeDoc();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User | null> => {
    try {
      // Sign in with Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      // Wait for the user to be set
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            try {
              const userDoc = await getDoc(doc(firestore, 'users', user.uid));
              if (userDoc.exists()) {
                const userData = userDoc.data() as User;
                resolve(userData);
              } else {
                resolve(null);
              }
            } catch (error) {
              console.error('Error fetching user profile:', error);
              resolve(null);
            }
          } else {
            resolve(null);
          }
          unsubscribe();
        });
      });
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    await auth.signOut();
  }, []);

  const register = useCallback(async (userData: Omit<User, 'uid' | 'id' | 'createdAt'>, password?: string): Promise<User | null> => {
    try {
      let uid: string;

      if (password) {
        // Email/password registration
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
        uid = userCredential.user.uid;
      } else {
        // Google registration - user is already authenticated
        if (!firebaseUser) {
          throw new Error('No authenticated user for Google registration');
        }
        uid = firebaseUser.uid;
      }

      // Set employer approval status
      const isApproved = userData.role === 'employer' ? false : true; // Employers need approval, students are auto-approved

      const newUser: User = {
        ...userData,
        uid,
        id: uid, // Use Firebase UID as ID
        isApproved,
        createdAt: new Date().toISOString(),
      };

      // Save to Firestore
      await setDoc(doc(firestore, 'users', uid), newUser);
      return newUser;
    } catch (error: any) {
      console.error('Error creating user account:', error);

      // Check if this is an "email already in use" error from Firebase Auth
      if (error.code === 'auth/email-already-in-use') {
        // Re-throw with a more descriptive message so the UI can handle it properly
        throw new Error('An account with this email already exists in authentication. Please try logging in instead.');
      }

      // For other errors, also re-throw to provide better feedback
      throw error;
    }
  }, [firebaseUser]);

  return (
    <AuthContext.Provider value={{
      currentUser,
      firebaseUser,
      loading,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
