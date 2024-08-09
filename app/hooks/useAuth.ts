import { useEffect, useState } from 'react';
import { auth } from '@/app/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export const useAuth = (): User | null | undefined => {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return user;
};
