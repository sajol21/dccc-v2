import { getFirestore, doc, getDoc, setDoc, collection, getDocs, writeBatch, query } from "firebase/firestore";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut, 
    onAuthStateChanged as firebaseOnAuthStateChanged,
    User
} from "firebase/auth";
import { firebaseApp } from './firebaseConfig';
import type { AppData, Department, Achievement, Event, Executive, Moderator, Person, HeroData, AboutData, JoinData, FooterData, ThemeData, LeadersData, ModeratorsDoc, CurrentExecutivesDoc, PastExecutivesDoc } from '../types';
import { initialData } from "./initialData";


// --- AUTHENTICATION ---
const auth = getAuth(firebaseApp);
export const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const signOut = () => firebaseSignOut(auth);
export const onAuthStateChanged = (callback: (user: User | null) => void) => firebaseOnAuthStateChanged(auth, callback);


// --- FIRESTORE DATABASE ---
const db = getFirestore(firebaseApp);

// New structured references
const configCollection = "site_config";
const departmentsCollection = "departments";
const achievementsCollection = "achievements";
const eventsCollection = "events";
const leadersCollection = "leaders";


let appDataCache: AppData | null = null;

// Saves the entire AppData object by diffing and writing to respective documents/collections
export const saveAppData = async (data: AppData): Promise<void> => {
  try {
    const batch = writeBatch(db);
    // Use a deep clone to avoid any mutation issues with the source object
    const cleanData = JSON.parse(JSON.stringify(data));

    // Config
    batch.set(doc(db, configCollection, "hero"), cleanData.hero);
    batch.set(doc(db, configCollection, "about"), cleanData.about);
    batch.set(doc(db, configCollection, "join"), cleanData.join);
    batch.set(doc(db, configCollection, "footer"), cleanData.footer);
    batch.set(doc(db, configCollection, "theme"), cleanData.theme);
    
    // Leaders
    batch.set(doc(db, leadersCollection, "moderators"), { moderators: cleanData.leaders.moderators });
    batch.set(doc(db, leadersCollection, "currentExecutives"), { currentExecutives: cleanData.leaders.currentExecutives });
    batch.set(doc(db, leadersCollection, "pastExecutives"), { pastExecutives: cleanData.leaders.pastExecutives });

    // For collections, we'll overwrite all documents.
    const currentDepartments = await getDocs(collection(db, departmentsCollection));
    currentDepartments.forEach(d => batch.delete(d.ref));
    cleanData.departments.forEach((item: Department) => batch.set(doc(db, departmentsCollection, item.id), item));

    const currentAchievements = await getDocs(collection(db, achievementsCollection));
    currentAchievements.forEach(d => batch.delete(d.ref));
    cleanData.achievements.forEach((item: Achievement) => batch.set(doc(db, achievementsCollection, item.id), item));

    const currentEvents = await getDocs(collection(db, eventsCollection));
    currentEvents.forEach(d => batch.delete(d.ref));
    cleanData.events.forEach((item: Event) => batch.set(doc(db, eventsCollection, item.id), item));
    
    await batch.commit();
    appDataCache = data; 
    console.log("Document successfully written to Firebase!");
  } catch (error) {
    console.error("Error writing document to Firebase: ", error);
    throw error;
  }
};


const seedDatabase = async (): Promise<void> => {
    console.log("Seeding database with initial data...");
    try {
        await saveAppData(initialData);
        console.log("Database seeded successfully.");
    } catch (error) {
        console.error("Error seeding database:", error);
        throw new Error("Failed to seed database with initial data.");
    }
}

// Fetches all data and assembles it into the AppData object
export const getAppData = async (forceRefresh: boolean = false): Promise<AppData> => {
    if (appDataCache && !forceRefresh) {
        return Promise.resolve(appDataCache);
    }
    
    try {
        // Check if the database is empty by looking for one core config document
        const heroDocCheck = await getDoc(doc(db, configCollection, "hero"));
        if (!heroDocCheck.exists()) {
            console.log("Core config not found. Seeding database with initial data...");
            await seedDatabase();
        }

        const [
            heroDoc, aboutDoc, joinDoc, footerDoc, themeDoc,
            departmentsSnap, achievementsSnap, eventsSnap,
            moderatorsDoc, currentExecsDoc, pastExecsDoc
        ] = await Promise.all([
            getDoc(doc(db, configCollection, "hero")),
            getDoc(doc(db, configCollection, "about")),
            getDoc(doc(db, configCollection, "join")),
            getDoc(doc(db, configCollection, "footer")),
            getDoc(doc(db, configCollection, "theme")),
            getDocs(collection(db, departmentsCollection)),
            getDocs(collection(db, achievementsCollection)),
            getDocs(collection(db, eventsCollection)),
            getDoc(doc(db, leadersCollection, "moderators")),
            getDoc(doc(db, leadersCollection, "currentExecutives")),
            getDoc(doc(db, leadersCollection, "pastExecutives")),
        ]);
        
        const data: AppData = {
            hero: heroDoc.data() as HeroData,
            about: aboutDoc.data() as AboutData,
            join: joinDoc.data() as JoinData,
            footer: footerDoc.data() as FooterData,
            theme: themeDoc.data() as ThemeData,
            departments: departmentsSnap.docs.map(d => d.data() as Department),
            achievements: achievementsSnap.docs.map(d => d.data() as Achievement),
            events: eventsSnap.docs.map(d => d.data() as Event),
            leaders: {
                moderators: (moderatorsDoc.data() as ModeratorsDoc)?.moderators || [],
                currentExecutives: (currentExecsDoc.data() as CurrentExecutivesDoc)?.currentExecutives || [],
                pastExecutives: (pastExecsDoc.data() as PastExecutivesDoc)?.pastExecutives || [],
            }
        };

        appDataCache = data;
        return data;

    } catch (error) {
        console.error("Error getting document:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
};


// --- EFFICIENT GETTERS FOR INDIVIDUAL DATA TYPES ---

export const getDepartments = async (): Promise<Department[]> => {
    const snapshot = await getDocs(query(collection(db, departmentsCollection)));
    return snapshot.docs.map(d => d.data() as Department);
}
export const getDepartmentById = async (id: string): Promise<Department | undefined> => {
    const docSnap = await getDoc(doc(db, departmentsCollection, id));
    return docSnap.exists() ? docSnap.data() as Department : undefined;
}

export const getAchievements = async (): Promise<Achievement[]> => {
    const snapshot = await getDocs(query(collection(db, achievementsCollection)));
    return snapshot.docs.map(d => d.data() as Achievement);
}

export const getEvents = async (): Promise<Event[]> => {
    const snapshot = await getDocs(query(collection(db, eventsCollection)));
    return snapshot.docs.map(d => d.data() as Event);
}
export const getEventById = async (id: string): Promise<Event | undefined> => {
    const docSnap = await getDoc(doc(db, eventsCollection, id));
    return docSnap.exists() ? docSnap.data() as Event : undefined;
}

export const getCurrentExecutives = async (): Promise<Executive[]> => {
    const docSnap = await getDoc(doc(db, leadersCollection, "currentExecutives"));
    return (docSnap.data() as CurrentExecutivesDoc)?.currentExecutives || [];
}

export const getLeaderById = async (id: string): Promise<Person | undefined> => {
    const data = await getAppData(); // This can be optimized further if needed
    const allLeaders = [...data.leaders.currentExecutives, ...data.leaders.pastExecutives, ...data.leaders.moderators];
    return allLeaders.find(l => l.id === id);
}

export type { User };