import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchEvents = async () => {
  const snapshot = await getDocs(collection(db, "events"));
  const events = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return events;
};