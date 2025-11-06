import type { AppData, Department, Achievement } from '../types';

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
    fullText: "The Dhaka College Cultural Club has a rich history of nurturing talent and promoting cultural exchange. For over six decades, we have been a vibrant platform for students to express themselves, learn new skills, and collaborate on exciting projects. Our mission is to preserve our cultural heritage while embracing contemporary art forms, creating a dynamic and inclusive community for all.",
    imageUrl: "https://picsum.photos/1200/800?random=1",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    foundedYear: 1956,
    visionTagline: "Art is not what you see, but what you make others see.",
  },
  motive: {
    title: "Our Motive & Vision",
    points: [
      { iconUrl: "🌟", text: "To be a beacon of cultural excellence, fostering creativity and artistic expression in every student." },
      { iconUrl: "🤝", text: "To build an inclusive community where diverse talents converge, collaborate, and create." },
      { iconUrl: "💡", text: "To preserve and promote our rich cultural heritage while embracing contemporary art forms and innovation." },
      { iconUrl: "🌱", text: "To provide a platform for personal growth, leadership development, and lifelong friendships." },
      { iconUrl: "🌍", text: "To make a positive impact on the community through culturally enriching events and outreach programs." },
    ]
  },
  departments: [
    { id: "wordspace", name: "WordSpace", iconUrl: "✍️", shortDesc: "Where words breathe, and voices find rhythm.", fullDesc: "WordSpace is the literary heart of our club. We nurture poets, writers, and orators, providing a platform for creative expression through workshops, open mics, poetry slams, and publications. Join us to explore the power of language and share your unique voice.", gallery: [{type:'image', url: 'https://picsum.photos/800/600?random=30', thumbUrl: 'https://picsum.photos/200/150?random=30'}] },
    { id: "musica", name: "Musica", iconUrl: "🎸", shortDesc: "The rhythm that defines our spirit.", fullDesc: "Musica is dedicated to every facet of music. From vocal training to instrumental practice, we host jam sessions, form bands, and organize concerts. Whether you're a seasoned musician or a budding artist, Musica is where you'll find your harmony.", gallery: [{type:'image', url: 'https://picsum.photos/800/600?random=31', thumbUrl: 'https://picsum.photos/200/150?random=31'}] },
    { id: "artstation", name: "Artstation", iconUrl: "🎨", shortDesc: "Where imagination meets the canvas.", fullDesc: "Artstation is a haven for visual artists. We explore painting, sketching, digital art, and sculpture. Through workshops, exhibitions, and collaborative projects, we help our members refine their skills and bring their creative visions to life.", gallery: [{type:'image', url: 'https://picsum.photos/800/600?random=32', thumbUrl: 'https://picsum.photos/200/150?random=32'}] },
    { id: "timbre", name: "Timbre", iconUrl: "🎭", shortDesc: "The pulse of performance and emotion.", fullDesc: "Timbre is our drama and theatre department. We delve into acting, directing, scriptwriting, and stage production. Join us to create compelling performances, tell powerful stories, and experience the magic of the stage.", gallery: [{type:'image', url: 'https://picsum.photos/800/600?random=33', thumbUrl: 'https://picsum.photos/200/150?random=33'}]},
    { id: "film-photo", name: "Film School and Photography", iconUrl: "🎬", shortDesc: "Stories in motion, moments immortalized.", fullDesc: "This department is for the storytellers behind the lens. We cover everything from cinematography and editing to photographic composition. We produce short films, documentaries, and host photo walks and exhibitions to capture the world around us.", gallery: [{type:'image', url: 'https://picsum.photos/800/600?random=34', thumbUrl: 'https://picsum.photos/200/150?random=34'}]},
    { id: "it", name: "Department of IT", iconUrl: "💻", shortDesc: "Powering creativity through innovation.", fullDesc: "The IT department is the backbone of our club's digital presence. We manage the website, social media tech, and explore digital art forms. We're the place where technology and creativity intersect to amplify our cultural impact.", gallery: [{type:'image', url: 'https://picsum.photos/800/600?random=35', thumbUrl: 'https://picsum.photos/200/150?random=35'}]},
    { id: "finance-marketing", name: "Finance & Marketing", iconUrl: "📈", shortDesc: "Strategy, sustainability, and storytelling that sells.", fullDesc: "This department handles the business side of culture. We manage budgets, secure sponsorships, and create marketing campaigns for our events. It's where strategic thinking meets creative promotion to ensure our club thrives.", gallery: [{type:'image', url: 'https://picsum.photos/800/600?random=36', thumbUrl: 'https://picsum.photos/200/150?random=36'}]},
    { id: "hr", name: "Human Resource Management", iconUrl: "👥", shortDesc: "Building teams that make culture possible.", fullDesc: "The HRM department is the heart of our community. We manage member recruitment, engagement, and development. We ensure a positive and inclusive environment where every member can grow and contribute to our shared cultural mission.", gallery: [{type:'image', url: 'https://picsum.photos/800/600?random=37', thumbUrl: 'https://picsum.photos/200/150?random=37'}]},
  ],
  achievements: [
    { id: "a1", title: "National Folk Dance Champions", description: "Won first place in the inter-college national folk dance competition.", date: "2023-05-20", imageUrl: "https://picsum.photos/600/400?random=20", category: "Dance" },
    { id: "a2", title: "Best Theatre Production Award", description: "Awarded for our original play 'The Echoing Silence' at the University Theatre Festival.", date: "2022-11-15", imageUrl: "https://picsum.photos/600/400?random=21", category: "Drama" },
    { id: "a3", title: "Regional Debate Tournament Winners", description: "Our debate team secured the top position in the regional championship.", date: "2023-02-10", imageUrl: "https://picsum.photos/600/400?random=22", category: "Debate" },
    { id: "a4", title: "Annual Music Fest 'Rhapsody'", description: "Successfully organized our flagship music festival, featuring renowned artists.", date: "2021-12-01", imageUrl: "https://picsum.photos/600/400?random=23", category: "Music" },
  ],
  leaders: {
    moderators: [
      { id: "m1", name: "Prof. Monira Begum", position: "Head of Sociology Department", imageUrl: "https://i.imgur.com/7D72t2v.png", bio: "Providing expert guidance to our club members." },
      { id: "m2", name: "Adnan Hossain", position: "Assistant Professor, English", imageUrl: "https://i.imgur.com/tG3aI3E.png", bio: "Mentoring students in literary and cultural activities." },
      { id: "m3", name: "Khohinur Akhter", position: "Lecturer, English", imageUrl: "https://i.imgur.com/tG3aI3E.png", bio: "Fostering a love for language and performance." },
      { id: "m4", name: "Shrabani Dhar", position: "Assistant Professor, Management", imageUrl: "https://i.imgur.com/tG3aI3E.png", bio: "Guiding students in organizational and leadership skills." },
    ],
    currentExecutives: [
      { id: "ce1", name: "Sadikul Islam", position: "President", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "" },
      { id: "ce2", name: "Md. Shahu Arafa Raiyan", position: "General Secretary", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "" },
      { id: "ce3", name: "Millat Morsalin Tanim Ba...", position: "Vice President", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "" },
      { id: "ce4", name: "Arafat Rahman", position: "Operating Secretary", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "" },
      { id: "ce5", name: "Hemayetul Islam Fardeen", position: "Joint Secretary", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "" },
      { id: "ce6", name: "Sadid Hasan Dhurbak", position: "IT Secretary", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "" },
      { id: "ce7", name: "Tahosin Ahamed Somo", position: "Financial Secretary", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "" },
      { id: "ce8", name: "Jubawer Roshid Jim", position: "Film School & Photography - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "" },
      { id: "ce9", name: "Zakareya Sani", position: "Human Resource Management - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "" },
      { id: "ce10", name: "Md. Shihab Ahammed", position: "Musica - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "" },
      { id: "ce11", name: "Md Saidul Islam", position: "Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "" },
      { id: "ce12", name: "Murshed Nasif", position: "Film School & Photography - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "" },
      { id: "ce13", name: "MD. Ashfaq Zaman", position: "Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "" },
      { id: "ce14", name: "Utsa Barai", position: "Artstation - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "" },
      { id: "ce15", name: "Junayed Ahmed Fahim", position: "Artstation - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "" },
      { id: "ce16", name: "Simanta Chondhro Suthr...", position: "Wordspace - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "" },
      { id: "ce17", name: "Tahmid Abrar Bin Sadat", position: "Musica - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "" },
      { id: "ce18", name: "Musfiqur Rahman Khan ...", position: "Human Resource Management - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "" },
      { id: "ce19", name: "Shimul Ghosh Joy", position: "Musica - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "" },
      { id: "ce20", name: "Zakareya Sani", position: "Human Resource Management - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "" },
      { id: "ce21", name: "Nur-E-Tadin", position: "Wordspace - Executive", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "" },
    ],
    pastExecutives: [
        { id: "pe24-1", name: "Aliya Bhatt", position: "President", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "Introduced the inter-departmental cultural competition, fostering healthy rivalry and collaboration among departments.", tenureYears: "2023-2024", dcccId: "24-001", bloodGroup: "O+", religion: "Hinduism" },
        { id: "pe24-2", name: "Varun Dhawan", position: "General Secretary", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "Spearheaded the initiative to digitize the club's extensive archives and streamline the membership process online.", tenureYears: "2023-2024", dcccId: "24-002", bloodGroup: "B+", religion: "Hinduism" },
        { id: "pe24-3", name: "Kiara Advani", position: "Treasurer", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "Successfully secured record-breaking sponsorship for the annual cultural festival, enabling a larger and more impactful event.", tenureYears: "2023-2024", dcccId: "24-003", bloodGroup: "A+", religion: "Hinduism" },
        { id: "pe24-4", name: "Sidharth Malhotra", position: "Vice President (Drama)", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "Directed an award-winning original play that received critical acclaim at the National University Theatre Festival.", tenureYears: "2023-2024", dcccId: "24-004", bloodGroup: "AB+", religion: "Hinduism" },
        { id: "pe1", name: "Kamal Hossain", position: "President", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "Under his leadership, the club won its first-ever national award for cultural excellence, marking a significant milestone.", tenureYears: "2022-2023", dcccId: "22-001", bloodGroup: "O-", religion: "Islam" },
        { id: "pe2", name: "Ayesha Siddika", position: "General Secretary", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "Pioneered the club's flagship annual cultural festival 'Utsav', which has since become a celebrated tradition.", tenureYears: "2022-2023", dcccId: "22-002", bloodGroup: "A-", religion: "Islam" },
        { id: "pe22-3", name: "Jamal Bhuiyan", position: "Head of Music", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "Organized a groundbreaking fusion music concert that featured collaborations with international student artists for the first time.", tenureYears: "2022-2023", dcccId: "22-003", bloodGroup: "B-", religion: "Islam" },
        { id: "pe21-1", name: "Shakib Al Hasan", position: "President", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "Expanded the club's activities to include a new wing for digital arts and new media, embracing modern forms of creativity.", tenureYears: "2021-2022", dcccId: "21-001", bloodGroup: "O+", religion: "Islam" },
        { id: "pe21-2", name: "Mushfiqur Rahim", position: "General Secretary", imageUrl: "https://i.imgur.com/s6n5F8v.png", bio: "Initiated a successful community outreach program that used art workshops to engage with local schools and underprivileged children.", tenureYears: "2021-2022", dcccId: "21-002", bloodGroup: "A+", religion: "Islam" },
    ],
  },
  join: {
    title: "Become a Part of Our Family",
    description: "Ready to unleash your creative potential? Join the Dhaka College Cultural Club and embark on an unforgettable journey of art, culture, and friendship.",
    buttonText: "Register Now",
    buttonLink: "#", // Link to external form
  },
  footer: {
    text: "Dhaka College Cultural Club - Fostering Creativity since 1956.",
    email: "contact@dccc.edu",
    phone: "+880 123 456 789",
    address: "Dhaka College, New Market, Dhaka-1205",
    socialLinks: [
        { name: "Facebook", url: "#", icon: "facebook" },
        { name: "Instagram", url: "#", icon: "instagram" },
        { name: "YouTube", url: "#", icon: "youtube" },
    ],
    quickLinks: [
        { name: "Home", url: "#/" },
        { name: "About", url: "#/about" },
        { name: "Motive", url: "#/motive" },
        { name: "Departments", url: "#/departments" },
        { name: "Achievements", url: "#/achievements" },
        { name: "Leaders", url: "#/leaders" },
    ]
  }
};

const simulateDelay = <T,>(data: T): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), 500));


export const getAppData = (): Promise<AppData> => simulateDelay(MOCK_DATA);
export const getDepartments = (): Promise<Department[]> => simulateDelay(MOCK_DATA.departments);
export const getDepartmentById = (id: string): Promise<Department | undefined> => simulateDelay(MOCK_DATA.departments.find(d => d.id === id));
export const getAchievements = (): Promise<Achievement[]> => simulateDelay(MOCK_DATA.achievements);