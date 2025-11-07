import { getFirestore, doc, getDoc, setDoc, collection, getDocs, writeBatch, query } from "firebase/firestore";
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

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

// --- AUTHENTICATION ---
export const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const signOut = () => firebaseSignOut(auth);
export const onAuthStateChanged = (callback: (user: User | null) => void) => firebaseOnAuthStateChanged(auth, callback);

// --- FIRESTORE CONSTANTS ---
const CONFIG_COLLECTION = "site_config";
const DEPARTMENTS_COLLECTION = "departments";
const ACHIEVEMENTS_COLLECTION = "achievements";
const EVENTS_COLLECTION = "events";
const LEADERS_COLLECTION = "leaders";

// --- RESILIENT GETTERS ---

const getConfigDoc = async <T,>(docId: keyof AppData): Promise<T> => {
    try {
        const docSnap = await getDoc(doc(db, CONFIG_COLLECTION, docId));
        if (docSnap.exists()) {
            return docSnap.data() as T;
        } else {
            console.warn(`Config doc '${docId}' not found. Falling back to initial data.`);
            return initialData[docId] as T;
        }
    } catch (error) {
        console.error(`Error fetching config doc '${docId}'. Falling back to initial data.`, error);
        return initialData[docId] as T;
    }
};

const getCollection = async <T,>(collectionName: string, fallbackKey: keyof AppData): Promise<T[]> => {
    try {
        const snapshot = await getDocs(query(collection(db, collectionName)));
        if (snapshot.empty) {
            console.warn(`Collection '${collectionName}' is empty. Falling back to initial data.`);
            const fallbackData = initialData[fallbackKey];
            return (Array.isArray(fallbackData) ? fallbackData : []) as T[];
        }
        return snapshot.docs.map(d => d.data() as T);
    } catch (error) {
        console.error(`Error fetching collection '${collectionName}'. Falling back to initial data.`, error);
        const fallbackData = initialData[fallbackKey];
        return (Array.isArray(fallbackData) ? fallbackData : []) as T[];
    }
};

// --- GENERIC SAVERS ---

const saveConfigDoc = async <T,>(docId: string, data: T): Promise<void> => {
    await setDoc(doc(db, CONFIG_COLLECTION, docId), data, { merge: true });
};

const saveCollection = async <T extends {id: string}>(collectionName: string, items: T[]): Promise<void> => {
    const batch = writeBatch(db);
    const currentDocs = await getDocs(collection(db, collectionName));
    currentDocs.forEach(d => batch.delete(d.ref));
    items.forEach(item => batch.set(doc(db, collectionName, item.id), item));
    await batch.commit();
};

// --- PUBLIC API FOR DATA ACCESS ---

export const getHomePageContent = async (): Promise<{hero: HeroData, join: JoinData}> => {
    const [hero, join] = await Promise.all([
        getConfigDoc<HeroData>('hero'),
        getConfigDoc<JoinData>('join')
    ]);
    return { hero, join };
};
export const saveHomePageContent = async (data: {hero: HeroData, join: JoinData}): Promise<void> => {
    await Promise.all([
        saveConfigDoc('hero', data.hero),
        saveConfigDoc('join', data.join)
    ]);
};

export const getAboutData = () => getConfigDoc<AboutData>('about');
export const saveAboutData = (data: AboutData) => saveConfigDoc('about', data);

export const getGeneralSettings = () => getConfigDoc<GeneralSettingsData>('general');
export const saveGeneralSettings = (data: GeneralSettingsData) => saveConfigDoc('general', data);

export const getTheme = () => getConfigDoc<ThemeData>('theme');
export const saveTheme = (data: ThemeData) => saveConfigDoc('theme', data);

export const getFooter = () => getConfigDoc<FooterData>('footer');
export const saveFooter = (data: FooterData) => saveConfigDoc('footer', data);

export const getDepartments = () => getCollection<Department>(DEPARTMENTS_COLLECTION, 'departments');
export const saveDepartments = (data: Department[]) => saveCollection(DEPARTMENTS_COLLECTION, data);

export const getAchievements = () => getCollection<Achievement>(ACHIEVEMENTS_COLLECTION, 'achievements');
export const saveAchievements = (data: Achievement[]) => saveCollection(ACHIEVEMENTS_COLLECTION, data);

export const getEvents = () => getCollection<Event>(EVENTS_COLLECTION, 'events');
export const saveEvents = (data: Event[]) => saveCollection(EVENTS_COLLECTION, data);

export const getLeaders = async(): Promise<LeadersData> => {
    try {
        const [moderatorsDoc, currentExecsDoc, pastExecsDoc] = await Promise.all([
            getDoc(doc(db, LEADERS_COLLECTION, "moderators")),
            getDoc(doc(db, LEADERS_COLLECTION, "currentExecutives")),
            getDoc(doc(db, LEADERS_COLLECTION, "pastExecutives")),
        ]);
        
        return {
            moderators: moderatorsDoc.exists() ? (moderatorsDoc.data() as ModeratorsDoc).moderators : initialData.leaders.moderators,
            currentExecutives: currentExecsDoc.exists() ? (currentExecsDoc.data() as CurrentExecutivesDoc).currentExecutives : initialData.leaders.currentExecutives,
            pastExecutives: pastExecsDoc.exists() ? (pastExecsDoc.data() as PastExecutivesDoc).pastExecutives : initialData.leaders.pastExecutives
        };
    } catch (error) {
        console.error("Error fetching leaders data, falling back to initial data.", error);
        return initialData.leaders;
    }
};
export const saveLeaders = async(data: LeadersData): Promise<void> => {
    const batch = writeBatch(db);
    const cleanData = JSON.parse(JSON.stringify(data));
    const defaultImageUrl = 'https://ik.imagekit.io/dccc/136881058_208a907c-e2ee-4386-ae78-0d15ed274338.svg';
    
    const applyDefaultImage = (person: Executive | Moderator) => {
        if (!person.imageUrl) person.imageUrl = defaultImageUrl;
    };

    (cleanData.moderators || []).forEach(applyDefaultImage);
    (cleanData.currentExecutives || []).forEach(applyDefaultImage);
    (cleanData.pastExecutives || []).forEach(applyDefaultImage);

    batch.set(doc(db, LEADERS_COLLECTION, "moderators"), { moderators: cleanData.moderators || [] });
    batch.set(doc(db, LEADERS_COLLECTION, "currentExecutives"), { currentExecutives: cleanData.currentExecutives || [] });
    batch.set(doc(db, LEADERS_COLLECTION, "pastExecutives"), { pastExecutives: cleanData.pastExecutives || [] });
    await batch.commit();
};

// --- AGGREGATED & DETAIL GETTERS ---
let appDataCache: AppData | null = null;
export const getAppData = async (forceRefresh: boolean = false): Promise<AppData> => {
    if (appDataCache && !forceRefresh) return appDataCache;
    
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
};

export const getDepartmentById = async (id: string): Promise<Department | undefined> => {
    const docSnap = await getDoc(doc(db, DEPARTMENTS_COLLECTION, id));
    return docSnap.exists() ? docSnap.data() as Department : undefined;
};
export const getEventById = async (id: string): Promise<Event | undefined> => {
    const docSnap = await getDoc(doc(db, EVENTS_COLLECTION, id));
    return docSnap.exists() ? docSnap.data() as Event : undefined;
};
export const getCurrentExecutives = async (): Promise<Executive[]> => {
    const leaders = await getLeaders();
    return leaders.currentExecutives;
};
export const getLeaderById = async (id: string): Promise<Person | undefined> => {
    const data = await getLeaders();
    const allLeaders = [...data.currentExecutives, ...data.pastExecutives, ...data.moderators];
    return allLeaders.find(l => l.id === id);
};

export type { User };
