
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, writeBatch, query, deleteDoc } from "firebase/firestore";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut, 
    onAuthStateChanged as firebaseOnAuthStateChanged,
    User
} from "firebase/auth";
import { firebaseApp } from './firebaseConfig';
import type { AppData, Department, Achievement, Event, Executive, Moderator, Person, HeroData, AboutData, JoinData, FooterData, ThemeData, LeadersData, ModeratorsDoc, CurrentExecutivesDoc, PastExecutivesDoc, GeneralSettingsData } from '../types';
import { initialData } from "./initialData";


// --- AUTHENTICATION ---
const auth = getAuth(firebaseApp);
export const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const signOut = () => firebaseSignOut(auth);
export const onAuthStateChanged = (callback: (user: User | null) => void) => firebaseOnAuthStateChanged(auth, callback);


// --- FIRESTORE DATABASE ---
const db = getFirestore(firebaseApp);

// Collection Names
const CONFIG_COLLECTION = "site_config";
const DEPARTMENTS_COLLECTION = "departments";
const ACHIEVEMENTS_COLLECTION = "achievements";
const EVENTS_COLLECTION = "events";
const LEADERS_COLLECTION = "leaders";

// --- PRIVATE HELPERS ---

const seedDatabaseWithInitialData = async (): Promise<void> => {
    console.log("Seeding database with initial data...");
    try {
        const batch = writeBatch(db);
        const data = initialData;

        // Config
        batch.set(doc(db, CONFIG_COLLECTION, "hero"), data.hero);
        batch.set(doc(db, CONFIG_COLLECTION, "about"), data.about);
        batch.set(doc(db, CONFIG_COLLECTION, "join"), data.join);
        batch.set(doc(db, CONFIG_COLLECTION, "footer"), data.footer);
        batch.set(doc(db, CONFIG_COLLECTION, "theme"), data.theme);
        batch.set(doc(db, CONFIG_COLLECTION, "general"), data.general);
        
        // Leaders
        batch.set(doc(db, LEADERS_COLLECTION, "moderators"), { moderators: data.leaders.moderators });
        batch.set(doc(db, LEADERS_COLLECTION, "currentExecutives"), { currentExecutives: data.leaders.currentExecutives });
        batch.set(doc(db, LEADERS_COLLECTION, "pastExecutives"), { pastExecutives: data.leaders.pastExecutives });

        // Collections
        data.departments.forEach((item: Department) => batch.set(doc(db, DEPARTMENTS_COLLECTION, item.id), item));
        data.achievements.forEach((item: Achievement) => batch.set(doc(db, ACHIEVEMENTS_COLLECTION, item.id), item));
        data.events.forEach((item: Event) => batch.set(doc(db, EVENTS_COLLECTION, item.id), item));
        
        await batch.commit();
        console.log("Database seeded successfully.");
    } catch (error) {
        console.error("Error seeding database:", error);
        throw new Error("Failed to seed database with initial data.");
    }
}

const checkAndPrepareDatabase = async (): Promise<void> => {
    const generalDocCheck = await getDoc(doc(db, CONFIG_COLLECTION, "general"));
    if (!generalDocCheck.exists()) {
        await seedDatabaseWithInitialData();
    }
};

// Initialize DB on first load
checkAndPrepareDatabase();


// --- GENERIC GETTERS / SAVERS ---

const getConfigDoc = async <T,>(docId: string): Promise<T> => {
    const docSnap = await getDoc(doc(db, CONFIG_COLLECTION, docId));
    if (!docSnap.exists()) throw new Error(`${docId} config not found`);
    return docSnap.data() as T;
}

const saveConfigDoc = async <T,>(docId: string, data: T): Promise<void> => {
    await setDoc(doc(db, CONFIG_COLLECTION, docId), data, { merge: true });
}

const getCollection = async <T,>(collectionName: string): Promise<T[]> => {
    const snapshot = await getDocs(query(collection(db, collectionName)));
    return snapshot.docs.map(d => d.data() as T);
}

// Replaces the entire collection with the new set of items.
const saveCollection = async <T extends {id: string}>(collectionName: string, items: T[]): Promise<void> => {
    const batch = writeBatch(db);
    const currentDocs = await getDocs(collection(db, collectionName));
    currentDocs.forEach(d => batch.delete(d.ref));
    items.forEach(item => batch.set(doc(db, collectionName, item.id), item));
    await batch.commit();
}


// --- PUBLIC API FOR DATA ACCESS ---

// Home Page Content
export const getHomePageContent = async (): Promise<{hero: HeroData, join: JoinData}> => {
    const [hero, join] = await Promise.all([
        getConfigDoc<HeroData>('hero'),
        getConfigDoc<JoinData>('join')
    ]);
    return { hero, join };
}
export const saveHomePageContent = async (data: {hero: HeroData, join: JoinData}): Promise<void> => {
    const batch = writeBatch(db);
    batch.set(doc(db, CONFIG_COLLECTION, "hero"), data.hero);
    batch.set(doc(db, CONFIG_COLLECTION, "join"), data.join);
    await batch.commit();
}

// About Page Content
export const getAboutData = () => getConfigDoc<AboutData>('about');
export const saveAboutData = (data: AboutData) => saveConfigDoc('about', data);

// General Settings
export const getGeneralSettings = () => getConfigDoc<GeneralSettingsData>('general');
export const saveGeneralSettings = (data: GeneralSettingsData) => saveConfigDoc('general', data);

// Theme
export const getTheme = () => getConfigDoc<ThemeData>('theme');
export const saveTheme = (data: ThemeData) => saveConfigDoc('theme', data);

// Footer
export const getFooter = () => getConfigDoc<FooterData>('footer');
export const saveFooter = (data: FooterData) => saveConfigDoc('footer', data);

// Departments
export const getDepartments = () => getCollection<Department>(DEPARTMENTS_COLLECTION);
export const saveDepartments = (data: Department[]) => saveCollection(DEPARTMENTS_COLLECTION, data);
export const getDepartmentById = async (id: string): Promise<Department | undefined> => {
    const docSnap = await getDoc(doc(db, DEPARTMENTS_COLLECTION, id));
    return docSnap.exists() ? docSnap.data() as Department : undefined;
}

// Achievements
export const getAchievements = () => getCollection<Achievement>(ACHIEVEMENTS_COLLECTION);
export const saveAchievements = (data: Achievement[]) => saveCollection(ACHIEVEMENTS_COLLECTION, data);

// Events
export const getEvents = () => getCollection<Event>(EVENTS_COLLECTION);
export const saveEvents = (data: Event[]) => saveCollection(EVENTS_COLLECTION, data);
export const getEventById = async (id: string): Promise<Event | undefined> => {
    const docSnap = await getDoc(doc(db, EVENTS_COLLECTION, id));
    return docSnap.exists() ? docSnap.data() as Event : undefined;
}

// Leaders
export const getLeaders = async(): Promise<LeadersData> => {
    const [moderatorsDoc, currentExecsDoc, pastExecsDoc] = await Promise.all([
        getDoc(doc(db, LEADERS_COLLECTION, "moderators")),
        getDoc(doc(db, LEADERS_COLLECTION, "currentExecutives")),
        getDoc(doc(db, LEADERS_COLLECTION, "pastExecutives")),
    ]);
    return {
        moderators: (moderatorsDoc.data() as ModeratorsDoc)?.moderators || [],
        currentExecutives: (currentExecsDoc.data() as CurrentExecutivesDoc)?.currentExecutives || [],
        pastExecutives: (pastExecsDoc.data() as PastExecutivesDoc)?.pastExecutives || [],
    }
}
export const saveLeaders = async(data: LeadersData): Promise<void> => {
    const batch = writeBatch(db);
    // Use a deep clone to avoid any mutation issues with the source object
    const cleanData = JSON.parse(JSON.stringify(data));
    
    const defaultImageUrl = 'https://ik.imagekit.io/dccc/136881058_208a907c-e2ee-4386-ae78-0d15ed274338.svg';
    const applyDefaultImage = (person: Executive | Moderator) => {
        if (!person.imageUrl) {
            person.imageUrl = defaultImageUrl;
        }
    };

    cleanData.moderators.forEach(applyDefaultImage);
    cleanData.currentExecutives.forEach(applyDefaultImage);
    cleanData.pastExecutives.forEach(applyDefaultImage);

    batch.set(doc(db, LEADERS_COLLECTION, "moderators"), { moderators: cleanData.moderators });
    batch.set(doc(db, LEADERS_COLLECTION, "currentExecutives"), { currentExecutives: cleanData.currentExecutives });
    batch.set(doc(db, LEADERS_COLLECTION, "pastExecutives"), { pastExecutives: cleanData.pastExecutives });

    await batch.commit();
}


// --- AGGREGATED GETTER for public pages ---

let appDataCache: AppData | null = null;
export const getAppData = async (forceRefresh: boolean = false): Promise<AppData> => {
    if (appDataCache && !forceRefresh) {
        return Promise.resolve(appDataCache);
    }
    
    try {
        const [
            hero, about, join, footer, theme, general,
            departments, achievements, events, leaders
        ] = await Promise.all([
            getConfigDoc<HeroData>('hero'),
            getConfigDoc<AboutData>('about'),
            getConfigDoc<JoinData>('join'),
            getFooter(),
            getTheme(),
            getGeneralSettings(),
            getDepartments(),
            getAchievements(),
            getEvents(),
            getLeaders(),
        ]);
        
        const data: AppData = { hero, about, join, footer, theme, general, departments, achievements, events, leaders };
        appDataCache = data;
        return data;

    } catch (error) {
        console.error("Error getting document:", error);
        throw error;
    }
};

// --- SINGLE GETTERS FOR DETAIL PAGES ---
export const getCurrentExecutives = async (): Promise<Executive[]> => {
    const docSnap = await getDoc(doc(db, LEADERS_COLLECTION, "currentExecutives"));
    return (docSnap.data() as CurrentExecutivesDoc)?.currentExecutives || [];
}
export const getLeaderById = async (id: string): Promise<Person | undefined> => {
    const data = await getLeaders();
    const allLeaders = [...data.currentExecutives, ...data.pastExecutives, ...data.moderators];
    return allLeaders.find(l => l.id === id);
}

export type { User };