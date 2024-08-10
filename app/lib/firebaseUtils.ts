import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export async function fetchContext(userInput: string) {
  const conversationsRef = collection(db, 'mental_health_conversations');
  const q = query(conversationsRef, where('text', 'array-contains', userInput));
  const querySnapshot = await getDocs(q);

  const context = querySnapshot.docs.map(doc => doc.data().text).join("\n");
  return context;
}
