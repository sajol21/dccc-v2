import { 
    getFirestore, doc, getDoc, setDoc, collection, getDocs, 
    writeBatch, deleteDoc, query, orderBy, updateDoc, addDoc
} from "firebase/firestore";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut, 
    onAuthStateChanged as firebaseOnAuthStateChanged,
    User
} from "firebase/auth";
import { firebaseApp } from './firebaseConfig';
import type { AppData, Department, Achievement, Event, Executive, Moderator, Person, LeadersData } from '../types';

// --- MIGRATION & INITIALIZATION DATA ---
const MOCK_DATA: AppData = {
  hero: {
    headline: "Ignite Your Creativity",
    tagline: "Welcome to the Dhaka College Cultural Club, where passion meets performance.",
    ctaButtons: [
      { text: "Explore Departments", link: "#/departments" },
      { text: "Join Us", link: "#join" },
    ],
  },
  about: {
    shortText: "Founded in 1956, we are the cultural heart of Dhaka College, fostering creativity and celebrating diversity through arts, music, dance, and literature.",
    fullText: "The Dhaka College Cultural Club has a rich history of nurturing talent and promoting cultural exchange. For over six decades, we have been a vibrant platform for students to express themselves, learn new skills, and collaborate on exciting projects. Our mission is to preserve our cultural heritage while embracing contemporary art forms, creating a dynamic and inclusive community for all. We are a family of creators, performers, and dreamers united by a shared passion for culture and the arts.",
    imageUrl: "https://picsum.photos/1200/800?random=1",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    foundedYear: 1956,
    visionTagline: "Art is not what you see, but what you make others see.",
    stats: [
        { value: `${new Date().getFullYear() - 1956}+`, label: "Years of Legacy" },
        { value: "8", label: "Creative Departments" },
        { value: "1000+", label: "Active Members" },
        { value: "50+", label: "Events Hosted Annually" }
    ]
  },
  departments: [
    { id: "wordspace", name: "WordSpace", iconUrl: "✍️", shortDesc: "Where words breathe, and voices find rhythm.", fullDesc: "WordSpace is the literary heart of our club. We nurture poets, writers, and orators, providing a platform for creative expression through workshops, open mics, poetry slams, and publications. Join us to explore the power of language and share your unique voice.", coverImage: 'https://picsum.photos/800/600?random=30', gallery: [{type:'image', url: 'https://picsum.photos/800/600?random=30', thumbUrl: 'https://picsum.photos/200/150?random=30'}], keyActivities: ["Weekly Open Mics", "Poetry Slam Competitions", "Creative Writing Workshops", "Annual Literary Magazine Publication"], coordinatorId: "ce16", order: 0 },
    { id: "musica", name: "Musica", iconUrl: "🎸", shortDesc: "The rhythm that defines our spirit.", fullDesc: "Musica is dedicated to every facet of music. From vocal training to instrumental practice, we host jam sessions, form bands, and organize concerts. Whether you're a seasoned musician or a budding artist, Musica is where you'll find your harmony.", coverImage: 'https://picsum.photos/800/600?random=31', gallery: [{type:'image', url: 'https://picsum.photos/800/600?random=31', thumbUrl: 'https://picsum.photos/200/150?random=31'}], keyActivities: ["Jam Sessions", "Instrumental Workshops", "Vocal Training", "Annual Concert 'Rhapsody'"], coordinatorId: "ce10", order: 1 },
    { id: "artstation", name: "Artstation", iconUrl: "🎨", shortDesc: "Where imagination meets the canvas.", fullDesc: "Artstation is a haven for visual artists. We explore painting, sketching, digital art, and sculpture. Through workshops, exhibitions, and collaborative projects, we help our members refine their skills and bring their creative visions to life.", coverImage: 'https://picsum.photos/800/600?random=32', gallery: [{type:'image', url: 'https://picsum.photos/800/600?random=32', thumbUrl: 'https://picsum.photos/200/150?random=32'}], keyActivities: ["Live Painting Sessions", "Art Exhibitions", "Digital Art Workshops", "Mural Projects"], coordinatorId: "ce14", order: 2 },
    { id: "timbre", name: "Timbre", iconUrl: "🎭", shortDesc: "The pulse of performance and emotion.", fullDesc: "Timbre is our drama and theatre department. We delve into acting, directing, scriptwriting, and stage production. Join us to create compelling performances, tell powerful stories, and experience the magic of the stage.", coverImage: 'https://picsum.photos/800/600?random=33', gallery: [{type:'image', url: 'https://picsum.photos/800/600?random=33', thumbUrl: 'https://picsum.photos/200/150?random=33'}], keyActivities: ["Acting Workshops", "Stage Production", "Annual Theatre Fest", "Street Plays"], coordinatorId: "ce11", order: 3 },
    { id: "film-photo", name: "Film School and Photography", iconUrl: "🎬", shortDesc: "Stories in motion, moments immortalized.", fullDesc: "This department is for the storytellers behind the lens. We cover everything from cinematography and editing to photographic composition. We produce short films, documentaries, and host photo walks and exhibitions to capture the world around us.", coverImage: 'https://picsum.photos/800/600?random=34', gallery: [{type:'image', url: 'https://picsum.photos/800/600?random=34', thumbUrl: 'https://picsum.photos/200/150?random=34'}], keyActivities: ["Photography Walks", "Short Film Contests", "Editing Workshops", "Annual Photo Exhibition"], coordinatorId: "ce8", order: 4 },
    { id: "it", name: "Department of IT", iconUrl: "💻", shortDesc: "Powering creativity through innovation.", fullDesc: "The IT department is the backbone of our club's digital presence. We manage the website, social media tech, and explore digital art forms. We're the place where technology and creativity intersect to amplify our cultural impact.", coverImage: 'https://picsum.photos/800/600?random=35', gallery: [{type:'image', url: 'https://picsum.photos/800/600?random=35', thumbUrl: 'https://picsum.photos/200/150?random=35'}], keyActivities: ["Website Management", "Graphic Design for Events", "Tech Workshops", "Digital Archiving"], coordinatorId: "ce6", order: 5 },
    { id: "finance-marketing", name: "Finance & Marketing", iconUrl: "📈", shortDesc: "Strategy, sustainability, and storytelling that sells.", fullDesc: "This department handles the business side of culture. We manage budgets, secure sponsorships, and create marketing campaigns for our events. It's where strategic thinking meets creative promotion to ensure our club thrives.", coverImage: 'https://picsum.photos/800/600?random=36', gallery: [{type:'image', url: 'https://picsum.photos/800/600?random=36', thumbUrl: 'https://picsum.photos/200/150?random=36'}], keyActivities: ["Sponsorship Management", "Event Marketing Campaigns", "Budgeting and Financial Planning", "Merchandise Management"], coordinatorId: "ce7", order: 6 },
    { id: "hr", name: "Human Resource Management", iconUrl: "👥", shortDesc: "Building teams that make culture possible.", fullDesc: "The HRM department is the heart of our community. We manage member recruitment, engagement, and development. We ensure a positive and inclusive environment where every member can grow and contribute to our shared cultural mission.", coverImage: 'https://picsum.photos/800/600?random=37', gallery: [{type:'image', url: 'https://picsum.photos/800/600?random=37', thumbUrl: 'https://picsum.photos/200/150?random=37'}], keyActivities: ["Recruitment Drives", "Member Onboarding", "Team Building Activities", "Leadership Development Programs"], coordinatorId: "ce9", order: 7 },
  ],
  achievements: [
    { id: "a1", title: "National Folk Dance Champions", description: "Won first place in the inter-college national folk dance competition.", date: "2023-05-20", imageUrl: "https://picsum.photos/600/400?random=20", category: "Dance", order: 0 },
    { id: "a2", title: "Best Theatre Production Award", description: "Awarded for our original play 'The Echoing Silence' at the University Theatre Festival.", date: "2022-11-15", imageUrl: "https://picsum.photos/600/400?random=21", category: "Drama", order: 1 },
    { id: "a3", title: "Regional Debate Tournament Winners", description: "Our debate team secured the top position in the regional championship.", date: "2023-02-10", imageUrl: "https://picsum.photos/600/400?random=22", category: "Debate", order: 2 },
    { id: "a4", title: "Annual Music Fest 'Rhapsody'", description: "Successfully organized our flagship music festival, featuring renowned artists.", date: "2021-12-01", imageUrl: "https://picsum.photos/600/400?random=23", category: "Music", order: 3 },
  ],
   events: [
    { id: "e1", title: "Annual Cultural Night 2024", shortDescription: "A grand celebration of music, dance, and drama showcasing the best talents of our club.", fullDescription: "Join us for an evening of spectacular performances as we celebrate a year of creativity and passion. The Annual Cultural Night is our flagship event, featuring stunning solo and group performances from all our departments, including Musica, Timbre, and Artstation. It's a night to remember, filled with art, culture, and community.", date: "2024-11-25", time: "18:00", startTime24: "18:00", location: "Main Auditorium, Dhaka College", imageUrl: "https://picsum.photos/600/400?random=40", isUpcoming: true, registrationLink: "#", customButtons: [{ text: "View Program Schedule", link: "#", icon: "list" }, { text: "Get Directions", link: "#", icon: "map" }], segments: [
        { title: "Opening Ceremony (6:00 PM - 6:30 PM)", items: [
            { primary: "Welcome Speech", secondary: "Sadikul Islam, President" },
            { primary: "Guest of Honor Address", secondary: "Prof. Monira Begum" }
        ]},
        { title: "Performances (6:30 PM - 8:30 PM)", items: [
            { primary: "Musical Performance", secondary: "Musica Department" },
            { primary: "Dramatic Play", secondary: "Timbre Department" },
            { primary: "Spoken Word Poetry", secondary: "WordSpace Department" }
        ]}
    ], order: 0},
    { id: "e2", title: "Photography Workshop: The Art of Seeing", shortDescription: "Learn the fundamentals of composition and lighting from a professional.", fullDescription: "This intensive one-day workshop, led by award-winning photographer Anis Rahman, will cover the fundamentals of composition, lighting, and storytelling in photography. Participants will engage in hands-on sessions and a guided photo walk. Suitable for all skill levels, from beginners to advanced enthusiasts.", date: "2024-10-15", time: "10:00", startTime24: "10:00", location: "Room 301, Arts Building", imageUrl: "https://picsum.photos/600/400?random=41", isUpcoming: true, registrationLink: "#", order: 1 },
    { id: "e3", title: "Poetry Slam Competition", shortDescription: "Unleash your inner poet and compete for the title of the best spoken word artist on campus.", fullDescription: "WordSpace presents its annual Poetry Slam! Come and perform your original work or simply enjoy the powerful performances from our talented poets. Compete for the title of the best spoken word artist on campus. Exciting prizes to be won!", date: "2024-09-30", time: "19:00", startTime24: "19:00", location: "College Cafeteria", imageUrl: "https://picsum.photos/600/400?random=42", isUpcoming: true, registrationLink: "#", order: 2 },
    { id: "e4", title: "Theatre Production: 'The Last Stand'", shortDescription: "Our drama wing's ambitious production exploring themes of courage and sacrifice.", fullDescription: "'The Last Stand' is a historical drama that received standing ovations for its powerful script and breathtaking performances. The play, written and directed by our own students, explores themes of courage, sacrifice, and hope during a pivotal moment in history.", date: "2024-05-10", time: "19:30", startTime24: "19:30", location: "Main Auditorium, Dhaka College", imageUrl: "https://picsum.photos/600/400?random=43", isUpcoming: false, order: 3 },
    { id: "e5", title: "Folk Music Festival 'Bauliana'", shortDescription: "A day-long festival celebrating the rich heritage of Bengali folk music.", fullDescription: "A day-long festival celebrating the rich heritage of Bengali folk music, featuring performances by students and guest artists. The event showcased a variety of folk traditions and was a massive success, drawing a large audience from across the city.", date: "2024-02-21", time: "11:00", startTime24: "11:00", location: "College Field", imageUrl: "https://picsum.photos/600/400?random=44", isUpcoming: false, segments: [
        { title: "Group Performance", items: [
            { primary: "1st Place", secondary: "Dhaka College Baul Sangha", tertiary: "For their soulful rendition of Lalon Geeti." },
            { primary: "2nd Place", secondary: "The Folk Fusion Project", tertiary: "For their innovative blend of traditional and contemporary folk music." }
        ]},
        { title: "Solo Performance", items: [
            { primary: "1st Place", secondary: "Anila Chowdhury", tertiary: "For her captivating performance of Bhatiali songs." },
            { primary: "2nd Place", secondary: "Robi Das", tertiary: "For his powerful Bhawaiya performance." },
        ]}
    ], order: 4},
  ],
  leaders: {
    moderators: [
      { id: "m1", name: "Prof. Monira Begum", position: "Head of Sociology Department", imageUrl: "https://i.imgur.com/7D72t2v.png", bio: "Providing expert guidance to our club members and fostering an environment of creative exploration and academic excellence.", socials: [{ name: "Facebook", url: "#", icon: "facebook" }, { name: "LinkedIn", url: "#", icon: "linkedin" }], order: 0 },
      { id: "m2", name: "Adnan Hossain", position: "Assistant Professor, English", imageUrl: "https://i.imgur.com/tG3aI3E.png", bio: "Mentoring students in literary and cultural activities.", order: 1 },
      { id: "m3", name: "Khohinur Akhter", position: "Lecturer, English", imageUrl: "https://i.imgur.com/tG3aI3E.png", bio: "Fostering a love for language and performance.", order: 2 },
      { id: "m4", name: "Shrabani Dhar", position: "Assistant Professor, Management", imageUrl: "https://i.imgur.com/tG3aI3E.png", bio: "Guiding students in organizational and leadership skills.", order: 3 },
    ],
    currentExecutives: [
      { id: "ce1", name: "Sadikul Islam", position: "President", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "Leading the club with a vision to elevate its cultural impact and foster a collaborative environment for all members.", socials: [{ name: "Facebook", url: "#", icon: "facebook" }, { name: "LinkedIn", url: "#", icon: "linkedin" }], order: 0 },
      { id: "ce2", name: "Md. Shahu Arafa Raiyan", position: "General Secretary", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "", order: 1 },
      { id: "ce3", name: "Millat Morsalin Tanim Ba...", position: "Vice President", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "", order: 2 },
      { id: "ce4", name: "Arafat Rahman", position: "Operating Secretary", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "", order: 3 },
      { id: "ce5", name: "Hemayetul Islam Fardeen", position: "Joint Secretary", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "", order: 4 },
      { id: "ce6", name: "Sadid Hasan Dhurbak", position: "IT Secretary", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "", department: 'it', order: 5 },
      { id: "ce7", name: "Tahosin Ahamed Somo", position: "Financial Secretary", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "", department: 'finance-marketing', order: 6 },
      { id: "ce8", name: "Jubawer Roshid Jim", position: "Film School and Photography - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "", department: 'film-photo', order: 7 },
      { id: "ce9", name: "Zakareya Sani", position: "Human Resource Management - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "", department: 'hr', order: 8 },
      { id: "ce10", name: "Md. Shihab Ahammed", position: "Musica - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "", department: 'musica', order: 9 },
      { id: "ce11", name: "Md Saidul Islam", position: "Timbre - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "", department: 'timbre', order: 10 },
      { id: "ce12", name: "Murshed Nasif", position: "Film School & Photography - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "", department: 'film-photo', order: 11 },
      { id: "ce13", name: "MD. Ashfaq Zaman", position: "Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "", order: 12 },
      { id: "ce14", name: "Utsa Barai", position: "Artstation - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "", department: 'artstation', order: 13 },
      { id: "ce15", name: "Junayed Ahmed Fahim", position: "Artstation - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "", department: 'artstation', order: 14 },
      { id: "ce16", name: "Simanta Chondhro Suthr...", position: "Wordspace - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "", department: 'wordspace', order: 15 },
      { id: "ce17", name: "Tahmid Abrar Bin Sadat", position: "Musica - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "", department: 'musica', order: 16 },
      { id: "ce18", name: "Musfiqur Rahman Khan ...", position: "Human Resource Management - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "", department: 'hr', order: 17 },
      { id: "ce19", name: "Shimul Ghosh Joy", position: "Musica - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "", department: 'musica', order: 18 },
      { id: "ce20", name: "Zakareya Sani", position: "Human Resource Management - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "", department: 'hr', order: 19 },
      { id: "ce21", name: "Nur-E-Tadin", position: "Wordspace - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "", department: 'wordspace', order: 20 },
    ],
    pastExecutives: [
        { id: "pe24-1", name: "Aliya Bhatt", position: "President", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "Introduced the inter-departmental cultural competition, fostering healthy rivalry and collaboration among departments.", tenureYears: "2023-2024", dcccId: "24-001", bloodGroup: "O+", religion: "Hinduism", socials: [{ name: "Facebook", url: "#", icon: "facebook" }, { name: "LinkedIn", url: "#", icon: "linkedin" }], order: 0 },
        { id: "pe24-2", name: "Varun Dhawan", position: "General Secretary", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "Spearheaded the initiative to digitize the club's extensive archives and streamline the membership process online.", tenureYears: "2023-2024", dcccId: "24-002", bloodGroup: "B+", religion: "Hinduism", order: 1 },
        { id: "pe24-3", name: "Kiara Advani", position: "Treasurer", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "Successfully secured record-breaking sponsorship for the annual cultural festival, enabling a larger and more impactful event.", tenureYears: "2023-2024", dcccId: "24-003", bloodGroup: "A+", religion: "Hinduism", order: 2 },
        { id: "pe24-4", name: "Sidharth Malhotra", position: "Vice President (Drama)", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "Directed an award-winning original play that received critical acclaim at the National University Theatre Festival.", tenureYears: "2023-2024", dcccId: "24-004", bloodGroup: "AB+", religion: "Hinduism", order: 3 },
        { id: "pe1", name: "Kamal Hossain", position: "President", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "Under his leadership, the club won its first-ever national award for cultural excellence, marking a significant milestone.", tenureYears: "2022-2023", dcccId: "22-001", bloodGroup: "O-", religion: "Islam", order: 4 },
        { id: "pe2", name: "Ayesha Siddika", position: "General Secretary", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "Pioneered the club's flagship annual cultural festival 'Utsav', which has since become a celebrated tradition.", tenureYears: "2022-2023", dcccId: "22-002", bloodGroup: "A-", religion: "Islam", order: 5 },
        { id: "pe22-3", name: "Jamal Bhuiyan", position: "Head of Music", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "Organized a groundbreaking fusion music concert that featured collaborations with international student artists for the first time.", tenureYears: "2022-2023", dcccId: "22-003", bloodGroup: "B-", religion: "Islam", order: 6 },
        { id: "pe21-1", name: "Shakib Al Hasan", position: "President", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "Expanded the club's activities to include a new wing for digital arts and new media, embracing modern forms of creativity.", tenureYears: "2021-2022", dcccId: "21-001", bloodGroup: "O+", religion: "Islam", order: 7 },
        { id: "pe21-2", name: "Mushfiqur Rahim", position: "General Secretary", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "Initiated a successful community outreach program that used art workshops to engage with local schools and underprivileged children.", tenureYears: "2021-2022", dcccId: "21-002", bloodGroup: "A+", religion: "Islam", order: 8 },
    ],
  },
  join: {
    title: "Become a Part of Our Family",
    description: "Ready to unleash your creative potential? Join the Dhaka College Cultural Club and embark on an unforgettable journey of art, culture, and friendship.",
    buttonText: "Register Now",
    buttonLink: "#", // Link to external form
  },
  footer: {
    aboutText: "An official club of Dhaka College.",
    logo1Url: "https://dhakacollegeculturalclub.com/logo.png",
    logo2Url: "https://res.cloudinary.com/dabfeqgsj/image/upload/v1762394067/clg-club_x11cj5.png",
    email: "pr@dhakacollegeculturalclub.com",
    phone: "+880 1308 563408",
    address: "Dhaka College, New Market, Dhaka-1205, Bangladesh",
    socialLinks: [
      { name: "Facebook", url: "#", icon: "facebook" },
      { name: "Instagram", url: "#", icon: "instagram" },
      { name: "LinkedIn", url: "#", icon: "linkedin" },
      { name: "Email", url: "mailto:pr@dhakacollegeculturalclub.com", icon: "email" },
    ],
    copyrightText: "Dhaka College Cultural Club. All Rights Reserved.",
    adminPanelLink: { text: "Administrative Panel", url: "#/login" }
  },
  theme: {
    backgroundColor: '#f9fafb',
    nodeColor: 'rgba(37, 99, 235, 0.7)',
    highlightColor: 'rgba(96, 165, 250, 1)',
    lineColor: 'rgba(37, 99, 235, 0.3)',
    lineHighlightColor: 'rgba(59, 130, 246, 0.8)',
    nodeDensity: 10000,
    nodeSize: 2.5,
    mouseRepelStrength: 3,
    clickEffectEnabled: true,
  }
};


// --- AUTHENTICATION ---
const auth = getAuth(firebaseApp);
export const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const signOut = () => firebaseSignOut(auth);
export const onAuthStateChanged = (callback: (user: User | null) => void) => firebaseOnAuthStateChanged(auth, callback);
export type { User };


// --- NEW FIRESTORE STRUCTURE ---
const db = getFirestore(firebaseApp);

// Collection References
const configCol = collection(db, "config");
const departmentsCol = collection(db, "departments");
const achievementsCol = collection(db, "achievements");
const eventsCol = collection(db, "events");

// Old Document Reference for Migration
const oldAppContentDocRef = doc(db, "app-content", "main-data");


// --- MIGRATION LOGIC ---
const migrateDataToCollections = async () => {
    console.log("Checking for old data structure for migration...");
    const oldDocSnap = await getDoc(oldAppContentDocRef);

    if (!oldDocSnap.exists()) {
        console.log("Old data structure not found. Migration not needed or already done.");
        // Check if DB is completely empty
        const departmentsSnap = await getDocs(departmentsCol);
        if(departmentsSnap.empty) {
            console.log("Database is empty. Seeding with initial data...");
            return seedDatabaseWithMockData();
        }
        return;
    }

    console.log("Old data found. Starting migration...");
    const data = oldDocSnap.data() as AppData;
    const batch = writeBatch(db);

    // 1. Config Docs
    batch.set(doc(configCol, "hero"), data.hero);
    batch.set(doc(configCol, "about"), data.about);
    batch.set(doc(configCol, "join"), data.join);
    batch.set(doc(configCol, "footer"), data.footer);
    batch.set(doc(configCol, "theme"), data.theme);
    batch.set(doc(configCol, "leaders"), data.leaders);

    // 2. Collection Docs
    data.departments.forEach((item, index) => batch.set(doc(departmentsCol, item.id), { ...item, order: item.order ?? index }));
    data.achievements.forEach((item, index) => batch.set(doc(achievementsCol, item.id), { ...item, order: item.order ?? index }));
    data.events.forEach((item, index) => batch.set(doc(eventsCol, item.id), { ...item, order: item.order ?? index }));

    // 3. Delete old doc
    batch.delete(oldAppContentDocRef);

    await batch.commit();
    console.log("Migration completed successfully!");
};

const seedDatabaseWithMockData = async () => {
    const data = MOCK_DATA;
    const batch = writeBatch(db);
    batch.set(doc(configCol, "hero"), data.hero);
    batch.set(doc(configCol, "about"), data.about);
    batch.set(doc(configCol, "join"), data.join);
    batch.set(doc(configCol, "footer"), data.footer);
    batch.set(doc(configCol, "theme"), data.theme);
    batch.set(doc(configCol, "leaders"), data.leaders);
    data.departments.forEach((item, index) => batch.set(doc(departmentsCol, item.id), { ...item, order: item.order ?? index }));
    data.achievements.forEach((item, index) => batch.set(doc(achievementsCol, item.id), { ...item, order: item.order ?? index }));
    data.events.forEach((item, index) => batch.set(doc(eventsCol, item.id), { ...item, order: item.order ?? index }));
    await batch.commit();
    console.log("Database seeded with mock data.");
}

// --- DATA FETCHING ---
let appDataCache: AppData | null = null;
let appDataPromise: Promise<AppData> | null = null;

export const getAppData = (forceRefresh: boolean = false): Promise<AppData> => {
    if (appDataCache && !forceRefresh) {
        return Promise.resolve(appDataCache);
    }
    
    if (appDataPromise && !forceRefresh) {
        return appDataPromise;
    }

    appDataPromise = (async () => {
        try {
            await migrateDataToCollections();

            const [
                heroSnap, aboutSnap, joinSnap, footerSnap, themeSnap, leadersSnap,
                departmentsSnap, achievementsSnap, eventsSnap
            ] = await Promise.all([
                getDoc(doc(configCol, "hero")),
                getDoc(doc(configCol, "about")),
                getDoc(doc(configCol, "join")),
                getDoc(doc(configCol, "footer")),
                getDoc(doc(configCol, "theme")),
                getDoc(doc(configCol, "leaders")),
                getDocs(query(departmentsCol, orderBy("order"))),
                getDocs(query(achievementsCol, orderBy("order"))),
                getDocs(query(eventsCol, orderBy("order"))),
            ]);

            const assembledData: AppData = {
                hero: heroSnap.data() as AppData['hero'],
                about: aboutSnap.data() as AppData['about'],
                join: joinSnap.data() as AppData['join'],
                footer: footerSnap.data() as AppData['footer'],
                theme: themeSnap.data() as AppData['theme'],
                leaders: leadersSnap.data() as AppData['leaders'],
                departments: departmentsSnap.docs.map(d => d.data() as Department),
                achievements: achievementsSnap.docs.map(d => d.data() as Achievement),
                events: eventsSnap.docs.map(d => d.data() as Event),
            };
            
            appDataCache = assembledData;
            return appDataCache;
        } catch (error) {
            console.error("Error getting document:", error);
            // Fallback to mock data if there's a critical error
            return MOCK_DATA; 
        } finally {
            appDataPromise = null;
        }
    })();
    
    return appDataPromise;
};

// --- GRANULAR CUD (Create, Update, Delete) & REORDER FUNCTIONS ---

// Generic update function for singleton config docs
export const updateConfigDoc = async (docName: 'hero' | 'about' | 'join' | 'footer' | 'theme' | 'leaders', data: any) => {
    const docRef = doc(configCol, docName);
    await setDoc(docRef, data, { merge: true });
};

// Generic functions for collections
const getCollectionRef = (collectionName: 'departments' | 'events' | 'achievements') => {
    if (collectionName === 'departments') return departmentsCol;
    if (collectionName === 'events') return eventsCol;
    return achievementsCol;
};

export const addCollectionDoc = async (collectionName: 'departments' | 'events' | 'achievements', data: any) => {
    const colRef = getCollectionRef(collectionName);
    const docRef = doc(colRef, data.id); // Use provided ID for the new doc
    await setDoc(docRef, data);
};

export const updateCollectionDoc = async (collectionName: 'departments' | 'events' | 'achievements', docId: string, data: any) => {
    const colRef = getCollectionRef(collectionName);
    await setDoc(doc(colRef, docId), data);
};

export const deleteCollectionDoc = async (collectionName: 'departments' | 'events' | 'achievements', docId: string) => {
    const colRef = getCollectionRef(collectionName);
    await deleteDoc(doc(colRef, docId));
};

export const reorderCollection = async (collectionName: 'departments' | 'events' | 'achievements', orderedItems: any[]) => {
    const colRef = getCollectionRef(collectionName);
    const batch = writeBatch(db);
    orderedItems.forEach((item, index) => {
        const docRef = doc(colRef, item.id);
        batch.update(docRef, { order: index });
    });
    await batch.commit();
}


// --- EXISTING GETTERS (for public pages) ---
export const getDepartments = (): Promise<Department[]> => getAppData().then(data => data.departments);
export const getDepartmentById = (id: string): Promise<Department | undefined> => getAppData().then(data => data.departments.find(d => d.id === id));
export const getAchievements = (): Promise<Achievement[]> => getAppData().then(data => data.achievements);
export const getEvents = (): Promise<Event[]> => getAppData().then(data => data.events);
export const getEventById = (id: string): Promise<Event | undefined> => getAppData().then(data => data.events.find(e => e.id === id));
export const getCurrentExecutives = (): Promise<Executive[]> => getAppData().then(data => data.leaders.currentExecutives);
export const getLeaderById = (id: string): Promise<Person | undefined> => {
    return getAppData().then(data => {
        const allLeaders = [...data.leaders.currentExecutives, ...data.leaders.pastExecutives, ...data.leaders.moderators];
        return allLeaders.find(l => l.id === id);
    });
}