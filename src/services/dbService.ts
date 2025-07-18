
import { db, appId } from '../firebase';
import { collection, doc, getDoc, setDoc, addDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp, FirestoreError } from '@firebase/firestore';
import { sanitizeForFirebaseId } from '../utils';
import type { ArtistStyleAnalysis, SavedLyricSession } from '../types';

const getArtistCollectionRef = (userId: string) => collection(db, `artifacts/${appId}/users/${userId}/artistAnalyses`);
const getLyricsCollectionRef = (userId: string) => collection(db, `artifacts/${appId}/users/${userId}/savedLyrics`);

// --- Artist Analysis Cache ---

export const getArtistAnalysisFromCache = async (userId: string, artistName: string): Promise<ArtistStyleAnalysis | null> => {
    const artistId = sanitizeForFirebaseId(artistName);
    const docRef = doc(getArtistCollectionRef(userId), artistId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log("Artist analysis found in cache:", artistName);
        return docSnap.data() as ArtistStyleAnalysis;
    }
    return null;
};

export const saveArtistAnalysisToCache = async (userId: string, artistName: string, analysis: ArtistStyleAnalysis): Promise<void> => {
    const artistId = sanitizeForFirebaseId(artistName);
    const docRef = doc(getArtistCollectionRef(userId), artistId);
    await setDoc(docRef, analysis, { merge: true });
    console.log("Artist analysis cached:", artistName);
};

// --- Saved Lyric Sessions ---

export const listenToSavedLyrics = (
    userId: string, 
    successCallback: (data: { sessions: SavedLyricSession[], fromCache: boolean }) => void,
    errorCallback: (error: FirestoreError) => void
): (() => void) => {
    const q = query(getLyricsCollectionRef(userId), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const sessions: SavedLyricSession[] = [];
        querySnapshot.forEach((doc) => {
            sessions.push({ id: doc.id, ...doc.data() } as SavedLyricSession);
        });
        successCallback({ sessions, fromCache: querySnapshot.metadata.fromCache });
      }, 
      (error) => {
        console.error("Error listening to saved lyrics:", error);
        errorCallback(error);
      }
    );
    return unsubscribe;
};

export const saveLyricSession = async (userId: string, sessionData: Omit<SavedLyricSession, 'id' | 'createdAt'>): Promise<string> => {
    const dataToSave = {
        ...sessionData,
        createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(getLyricsCollectionRef(userId), dataToSave);
    return docRef.id;
};

export const deleteLyricSession = async (userId: string, sessionId: string): Promise<void> => {
    const docRef = doc(getLyricsCollectionRef(userId), sessionId);
    await deleteDoc(docRef);
};
