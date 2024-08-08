import { useEffect, useState } from 'react';
import { auth } from '@/app/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export const useAuth = (): User | null => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Set up the subscription to listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  return user;
};
