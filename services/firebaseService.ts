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
  departments: [
    { id: "music", name: "Music", iconUrl: "🎵", shortDesc: "From classical to contemporary, we explore the world of sound.", fullDesc: "The Music Department is dedicated to all things melodic. We organize workshops, jam sessions, and large-scale concerts. Whether you're a vocalist, an instrumentalist, or just a music lover, you'll find your rhythm here.", gallery: [{type:'image', url: 'https://picsum.photos/800/600?random=10', thumbUrl: 'https://picsum.photos/200/150?random=10'}, {type:'image', url: 'https://picsum.photos/800/600?random=11', thumbUrl: 'https://picsum.photos/200/150?random=11'}] },
    { id: "dance", name: "Dance", iconUrl: "💃", shortDesc: "Express yourself through the art of movement.", fullDesc: "Our Dance Department covers a wide range of styles, from traditional folk dances to modern hip-hop. We believe dance is a universal language, and we provide the stage for students to tell their stories.", gallery: [{type:'image', url: 'https://picsum.photos/800/600?random=12', thumbUrl: 'https://picsum.photos/200/150?random=12'}] },
    { id: "drama", name: "Drama & Theatre", iconUrl: "🎭", shortDesc: "Bringing stories to life on stage.", fullDesc: "From scriptwriting to acting and stage design, the Drama Department is a complete theatrical experience. We produce several plays throughout the year, challenging our members to push their creative boundaries.", gallery: [{type:'image', url: 'https://picsum.photos/800/600?random=13', thumbUrl: 'https://picsum.photos/200/150?random=13'}]},
    { id: "literature", name: "Literature & Debate", iconUrl: "📚", shortDesc: "The power of words, spoken and written.", fullDesc: "This department is for the thinkers, writers, and orators. We host poetry slams, debate competitions, and creative writing workshops, fostering a love for literature and critical thinking.", gallery: [{type:'image', url: 'https://picsum.photos/800/600?random=14', thumbUrl: 'https://picsum.photos/200/150?random=14'}]},
  ],
  achievements: [
    { id: "a1", title: "National Folk Dance Champions", description: "Won first place in the inter-college national folk dance competition.", date: "2023-05-20", imageUrl: "https://picsum.photos/600/400?random=20", category: "Dance" },
    { id: "a2", title: "Best Theatre Production Award", description: "Awarded for our original play 'The Echoing Silence' at the University Theatre Festival.", date: "2022-11-15", imageUrl: "https://picsum.photos/600/400?random=21", category: "Drama" },
    { id: "a3", title: "Regional Debate Tournament Winners", description: "Our debate team secured the top position in the regional championship.", date: "2023-02-10", imageUrl: "https://picsum.photos/600/400?random=22", category: "Debate" },
    { id: "a4", title: "Annual Music Fest 'Rhapsody'", description: "Successfully organized our flagship music festival, featuring renowned artists.", date: "2021-12-01", imageUrl: "https://picsum.photos/600/400?random=23", category: "Music" },
  ],
  leaders: {
    moderators: [
        { id: "m1", name: "Dr. Anisur Rahman", position: "Convenor", imageUrl: "https://picsum.photos/400/400?random=30", bio: "As a Professor in the Bengali Department, Dr. Rahman provides invaluable guidance, ensuring the club's activities align with our cultural and academic values.", email: "anisur.r@dcollege.edu", phone: "+8801711223344", dcccId: "M-001", bloodGroup: "O+", religion: "Islam" },
        { id: "m2", name: "Mrs. Farhana Islam", position: "Moderator", imageUrl: "https://picsum.photos/400/400?random=31", bio: "An Associate Professor of English, Mrs. Islam's passion for literature and the performing arts inspires our members to explore new creative horizons.", email: "farhana.i@dcollege.edu", phone: "+8801811223355", dcccId: "M-002", bloodGroup: "A+", religion: "Islam" },
        { id: "m3", name: "Mr. Karim Sheikh", position: "Moderator", imageUrl: "https://picsum.photos/400/400?random=37", bio: "Mr. Sheikh, an Assistant Professor of Music, mentors our musicians and vocalists, helping them hone their skills and stage presence.", email: "karim.s@dcollege.edu", phone: "+8801911223366", dcccId: "M-003", bloodGroup: "B+", religion: "Islam" },
        { id: "m4", name: "Ms. Salma Begum", position: "Moderator", imageUrl: "https://picsum.photos/400/400?random=38", bio: "A Lecturer in Fine Arts, Ms. Begum inspires creativity and visual storytelling, guiding our members in design and aesthetics.", email: "salma.b@dcollege.edu", phone: "+8801611223377", dcccId: "M-004", bloodGroup: "AB+", religion: "Islam" },
      ],
    currentExecutives: [
        { id: "ce1", name: "Rahim Ahmed", position: "President", imageUrl: "https://picsum.photos/400/400?random=32", bio: "A passionate musician and third-year student, Rahim aims to foster a collaborative environment where every member's creative voice can be heard and celebrated.", department: "Music", dcccId: "24-001", email: "rahim.ahmed@dccc.com", phone: "+8801555112233", socials: [{ name: "Facebook", url: "#", icon: "facebook" }, { name: "LinkedIn", url: "#", icon: "linkedin" }], bloodGroup: "A-", religion: "Islam" },
        { id: "ce2", name: "Fatima Khatun", position: "General Secretary", imageUrl: "https://picsum.photos/400/400?random=33", bio: "The organizational backbone of the club, Fatima ensures the smooth execution of all events and initiatives, from planning to final production.", department: "Drama", dcccId: "24-002", email: "fatima.k@dccc.com", phone: "+8801555112244", socials: [{ name: "Facebook", url: "#", icon: "facebook" }], bloodGroup: "B+", religion: "Islam" },
        { id: "ce3", name: "Sajib Das", position: "Treasurer", imageUrl: "https://picsum.photos/400/400?random=34", bio: "With a keen eye for detail, Sajib meticulously manages the club's finances, ensuring resources are allocated effectively for all activities.", department: "Literature", dcccId: "24-003", email: "sajib.d@dccc.com", phone: "+8801555112255", bloodGroup: "O+", religion: "Hinduism" },
        { id: "ce4", name: "Aria Chowdhury", position: "Vice President (Music)", imageUrl: "https://picsum.photos/400/400?random=40", bio: "Aria leads the Music Department, coordinating engaging workshops, jam sessions, and our much-anticipated annual concert.", department: "Music", dcccId: "24-004", bloodGroup: "AB-", religion: "Islam" },
        { id: "ce5", name: "Imran Khan", position: "Vice President (Drama)", imageUrl: "https://picsum.photos/400/400?random=41", bio: "Imran oversees all theatrical productions, guiding teams from script selection and casting to captivating final performances on stage.", department: "Drama", dcccId: "24-005", bloodGroup: "A+", religion: "Islam" },
        { id: "ce6", name: "Nusrat Jahan", position: "Head of Dance", imageUrl: "https://picsum.photos/400/400?random=42", bio: "Nusrat choreographs and manages our talented dance troupes, exploring everything from traditional folk to contemporary styles.", department: "Dance", dcccId: "24-006", bloodGroup: "O-", religion: "Islam" },
        { id: "ce7", name: "Rohan Islam", position: "Head of Literature", imageUrl: "https://picsum.photos/400/400?random=43", bio: "Rohan is the driving force behind our literary events, organizing stimulating debates, poetry slams, and creative writing circles.", department: "Literature", dcccId: "24-007", bloodGroup: "B-", religion: "Islam" },
        { id: "ce8", name: "Priya Sharma", position: "Event Coordinator", imageUrl: "https://picsum.photos/400/400?random=44", bio: "The mastermind behind our successful events, Priya handles planning and logistics to create unforgettable experiences for everyone.", department: "General", dcccId: "24-008", bloodGroup: "A+", religion: "Hinduism" },
        { id: "ce9", name: "Zayn Hasan", position: "Public Relations Officer", imageUrl: "https://picsum.photos/400/400?random=45", bio: "Zayn manages our social media presence and communications, keeping our members and the wider community informed and engaged.", department: "General", dcccId: "24-009", bloodGroup: "O+", religion: "Islam" },
        { id: "ce10", name: "Samira Akter", position: "Creative Director", imageUrl: "https://picsum.photos/400/400?random=46", bio: "Samira leads the design and aesthetic direction of the club, ensuring all our visual materials are stunning and cohesive.", department: "General", dcccId: "24-010", bloodGroup: "B+", religion: "Islam" },
        { id: "ce11", name: "Farhan Mahmud", position: "Executive Member", imageUrl: "https://picsum.photos/400/400?random=47", bio: "A versatile and dedicated member, Farhan provides crucial support across various club activities, particularly in the Music department.", department: "Music", dcccId: "24-011", bloodGroup: "AB+", religion: "Islam" },
        { id: "ce12", name: "Ishita Roy", position: "Executive Member", imageUrl: "https://picsum.photos/400/400?random=48", bio: "Ishita is a key contributor to event planning and execution, with a special focus on coordinating our dance showcases.", department: "Dance", dcccId: "24-012", bloodGroup: "A+", religion: "Hinduism" },
        { id: "ce13", name: "Tanvir Ahmed", position: "Executive Member", imageUrl: "https://picsum.photos/400/400?random=49", bio: "Tanvir provides essential logistics and on-ground support, ensuring our theatre productions run smoothly behind the scenes.", department: "Drama", dcccId: "24-013", bloodGroup: "O+", religion: "Islam" },
        { id: "ce14", name: "Adnan Kabir", position: "Executive Member", imageUrl: "https://picsum.photos/400/400?random=50", bio: "Adnan contributes to content creation for our literary magazine and helps document the club's various events and achievements.", department: "Literature", dcccId: "24-014", bloodGroup: "B+", religion: "Islam" },
        { id: "ce15", name: "Anika Tabassum", position: "Executive Member", imageUrl: "https://picsum.photos/400/400?random=51", bio: "Working closely with the PR team, Anika helps create engaging content and campaigns to boost our online presence.", department: "General", dcccId: "24-015", bloodGroup: "A-", religion: "Islam" },
        { id: "ce16", name: "Leo Das", position: "Technical Head", imageUrl: "https://picsum.photos/400/400?random=52", bio: "Leo is our tech guru, managing sound, lighting, and all technical aspects to ensure our shows are flawless.", department: "General", dcccId: "24-016", bloodGroup: "O-", religion: "Christianity" },
        { id: "ce17", name: "Meera Reddy", position: "Hospitality Manager", imageUrl: "https://picsum.photos/400/400?random=53", bio: "Meera excels at making our guests and artists feel welcome, managing all aspects of hospitality with grace and professionalism.", department: "General", dcccId: "24-017", bloodGroup: "B-", religion: "Hinduism" },
        { id: "ce18", name: "Kabir Singh", position: "Logistics Coordinator", imageUrl: "https://picsum.photos/400/400?random=54", bio: "Kabir is in charge of managing resources and equipment, ensuring everything is in the right place at the right time for our events.", department: "General", dcccId: "24-018", bloodGroup: "AB+", religion: "Sikhism" },
        { id: "ce19", name: "Sara Ali", position: "Membership Coordinator", imageUrl: "https://picsum.photos/400/400?random=55", bio: "As the first point of contact for new members, Sara fosters a welcoming environment and manages our member database.", department: "General", dcccId: "24-019", bloodGroup: "A+", religion: "Islam" },
        { id: "ce20", name: "Arjun Barman", position: "Workshop Coordinator", imageUrl: "https://picsum.photos/400/400?random=56", bio: "Arjun is dedicated to member development, organizing a wide range of skill-building workshops throughout the year.", department: "General", dcccId: "24-020", bloodGroup: "O+", religion: "Hinduism" },
        { id: "ce21", name: "Dia Mirza", position: "Alumni Relations", imageUrl: "https://picsum.photos/400/400?random=57", bio: "Dia plays a vital role in connecting with our former members, building a strong and supportive alumni network.", department: "General", dcccId: "24-021", bloodGroup: "B+", religion: "Islam" },
        { id: "ce22", name: "Rizwan Sheikh", position: "Photography Head", imageUrl: "https://picsum.photos/400/400?random=58", bio: "With a creative eye, Rizwan leads our photography team to capture the vibrant and unforgettable moments of our club's journey.", department: "General", dcccId: "24-022", bloodGroup: "A-", religion: "Islam" },
    ],
    pastExecutives: [
        { id: "pe23-1", name: "Aliya Bhatt", position: "President", imageUrl: "https://picsum.photos/400/400?random=60", bio: "Introduced the inter-departmental cultural competition, fostering healthy rivalry and collaboration among departments.", tenureYears: "2022-2023", dcccId: "23-001", bloodGroup: "O+", religion: "Hinduism" },
        { id: "pe23-2", name: "Varun Dhawan", position: "General Secretary", imageUrl: "https://picsum.photos/400/400?random=61", bio: "Spearheaded the initiative to digitize the club's extensive archives and streamline the membership process online.", tenureYears: "2022-2023", dcccId: "23-002", bloodGroup: "B+", religion: "Hinduism" },
        { id: "pe23-3", name: "Kiara Advani", position: "Treasurer", imageUrl: "https://picsum.photos/400/400?random=62", bio: "Successfully secured record-breaking sponsorship for the annual cultural festival, enabling a larger and more impactful event.", tenureYears: "2022-2023", dcccId: "23-003", bloodGroup: "A+", religion: "Hinduism" },
        { id: "pe23-4", name: "Sidharth Malhotra", position: "Vice President (Drama)", imageUrl: "https://picsum.photos/400/400?random=63", bio: "Directed an award-winning original play that received critical acclaim at the National University Theatre Festival.", tenureYears: "2022-2023", dcccId: "23-004", bloodGroup: "AB+", religion: "Hinduism" },
        { id: "pe1", name: "Kamal Hossain", position: "President", imageUrl: "https://picsum.photos/400/400?random=35", bio: "Under his leadership, the club won its first-ever national award for cultural excellence, marking a significant milestone.", tenureYears: "2021-2022", dcccId: "22-001", bloodGroup: "O-", religion: "Islam" },
        { id: "pe2", name: "Ayesha Siddika", position: "General Secretary", imageUrl: "https://picsum.photos/400/400?random=36", bio: "Pioneered the club's flagship annual cultural festival 'Utsav', which has since become a celebrated tradition.", tenureYears: "2021-2022", dcccId: "22-002", bloodGroup: "A-", religion: "Islam" },
        { id: "pe22-3", name: "Jamal Bhuiyan", position: "Head of Music", imageUrl: "https://picsum.photos/400/400?random=64", bio: "Organized a groundbreaking fusion music concert that featured collaborations with international student artists for the first time.", tenureYears: "2021-2022", dcccId: "22-003", bloodGroup: "B-", religion: "Islam" },
        { id: "pe21-1", name: "Shakib Al Hasan", position: "President", imageUrl: "https://picsum.photos/400/400?random=65", bio: "Expanded the club's activities to include a new wing for digital arts and new media, embracing modern forms of creativity.", tenureYears: "2020-2021", dcccId: "21-001", bloodGroup: "O+", religion: "Islam" },
        { id: "pe21-2", name: "Mushfiqur Rahim", position: "General Secretary", imageUrl: "https://picsum.photos/400/400?random=66", bio: "Initiated a successful community outreach program that used art workshops to engage with local schools and underprivileged children.", tenureYears: "2020-2021", dcccId: "21-002", bloodGroup: "A+", religion: "Islam" },
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