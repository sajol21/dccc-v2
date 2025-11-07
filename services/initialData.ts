import type { AppData } from "../types";

export const initialData: AppData = {
  hero: {
    headlineLine1: "Dhaka College",
    headlineLine2: "Cultural Club",
    tagline: "Where Creativity Meets Tradition. Join us to explore your talents in music, dance, drama, and more.",
    ctaButtons: [
      { text: "Explore Departments", link: "#/departments" },
    ],
    backgroundImageUrl: "https://images.unsplash.com/photo-1531306728370-e436762b87b0?q=80&w=2070&auto=format&fit=crop",
  },
  about: {
    shortText: "Founded in 1956, the Dhaka College Cultural Club is the heart of artistic and cultural expression at Dhaka College, nurturing talent and fostering a vibrant community of student artists.",
    fullText: "Since its inception, the Dhaka College Cultural Club (DCCC) has been a guiding light for students passionate about culture and the arts. Our mission is to provide a platform for students to explore, develop, and showcase their talents. We organize a wide range of activities, including workshops, competitions, and performances, across our diverse departments. We believe in the power of culture to unite people and enrich lives, and we are dedicated to preserving our rich heritage while embracing modern forms of expression.",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-students-in-a-university-classroom-4197-large.mp4",
    foundedYear: 1956,
    visionTagline: "Nurturing the next generation of cultural leaders and artists.",
    stats: [
      { value: "65+", label: "Years of Legacy" },
      { value: "10+", label: "Creative Departments" },
      { value: "500+", label: "Active Members" },
      { value: "100+", label: "Events Hosted" },
    ],
  },
  departments: [
    {
      id: "dept_music_1",
      name: "Music",
      iconUrl: "🎵",
      shortDesc: "Vocal and instrumental training and performances.",
      fullDesc: "The Music Department is the soul of DCCC, offering training in various genres including classical, folk, and contemporary music. Members get opportunities to perform at college events and external competitions.",
      coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop",
      gallery: [],
      keyActivities: ["Vocal Training", "Instrument Workshops", "Stage Performances", "Annual Concert"],
      coordinatorId: ""
    },
    {
      id: "dept_dance_2",
      name: "Dance",
      iconUrl: "💃",
      shortDesc: "Exploring classical, folk, and modern dance forms.",
      fullDesc: "From traditional to contemporary, the Dance Department celebrates movement and expression. We provide professional training and a stage for students to showcase their talent.",
      coverImage: "https://images.unsplash.com/photo-1524594152303-9fdc56da042e?q=80&w=2070&auto=format&fit=crop",
      gallery: [],
      keyActivities: ["Classical Dance", "Folk Dance", "Choreography Workshops", "Annual Dance Show"],
      coordinatorId: ""
    },
    {
      id: "dept_wordspace_3",
      name: "WordSpace",
      iconUrl: "✍️",
      shortDesc: "Where words breathe, and voices find rhythm.",
      fullDesc: "WordSpace is dedicated to the literary arts. We host poetry slams, creative writing workshops, and recitation sessions to help members hone their craft and find their voice.",
      coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1973&auto=format&fit=crop",
      gallery: [],
      keyActivities: ["Poetry Slams", "Creative Writing", "Recitation Events", "Literary Magazine"],
      coordinatorId: ""
    },
    {
      id: "dept_musica_4",
      name: "Musica",
      iconUrl: "🎶",
      shortDesc: "The rhythm that defines our spirit.",
      fullDesc: "Musica is the heart of DCCC's musical endeavors. From vocal training to instrumental jams, we provide a platform for all music lovers to collaborate, create, and perform.",
      coverImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop",
      gallery: [],
      keyActivities: ["Vocal Coaching", "Band Practice", "Songwriting Sessions", "Live Concerts"],
      coordinatorId: ""
    },
    {
      id: "dept_artstation_5",
      name: "Artstation",
      iconUrl: "🎨",
      shortDesc: "Where imagination meets the canvas.",
      fullDesc: "Artstation is a haven for visual artists. We organize painting workshops, art exhibitions, and collaborative projects to foster creativity and technical skill.",
      coverImage: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071&auto=format&fit=crop",
      gallery: [],
      keyActivities: ["Painting & Sketching", "Digital Art", "Exhibitions", "Art Fairs"],
      coordinatorId: ""
    },
    {
      id: "dept_timbre_6",
      name: "Timbre",
      iconUrl: "🎭",
      shortDesc: "The pulse of performance and emotion.",
      fullDesc: "Timbre is our drama and performing arts department. We stage plays, conduct acting workshops, and explore the depths of theatrical expression.",
      coverImage: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=2070&auto=format&fit=crop",
      gallery: [],
      keyActivities: ["Theatre Production", "Acting Workshops", "Street Plays", "Improv Nights"],
      coordinatorId: ""
    },
    {
      id: "dept_film_photo_7",
      name: "Film School and Photography",
      iconUrl: "🎬",
      shortDesc: "Stories in motion, moments immortalized.",
      fullDesc: "This department is for storytellers who use cameras. We cover everything from scriptwriting and cinematography to photojournalism and post-production.",
      coverImage: "https://images.unsplash.com/photo-1521714161819-15534968fc5f?q=80&w=2070&auto=format&fit=crop",
      gallery: [],
      keyActivities: ["Photography Walks", "Short Film Making", "Editing Workshops", "Film Screenings"],
      coordinatorId: ""
    },
    {
      id: "dept_it_8",
      name: "Department of IT",
      iconUrl: "💻",
      shortDesc: "Powering creativity through innovation.",
      fullDesc: "The IT department is the technical backbone of DCCC. We manage the club's digital presence, develop innovative solutions, and support all technical aspects of our events.",
      coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
      gallery: [],
      keyActivities: ["Website Management", "Live Streaming", "Graphic Design Support", "Tech Workshops"],
      coordinatorId: ""
    },
    {
      id: "dept_finance_marketing_9",
      name: "Finance & Marketing",
      iconUrl: "📈",
      shortDesc: "Strategy, sustainability, and storytelling that sells.",
      fullDesc: "This department handles the financial health and public promotion of the club. We manage budgets, secure sponsorships, and run marketing campaigns to amplify our reach.",
      coverImage: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop",
      gallery: [],
      keyActivities: ["Budgeting", "Sponsorship Outreach", "Social Media Marketing", "Event Promotion"],
      coordinatorId: ""
    },
    {
      id: "dept_hr_10",
      name: "Human Resource Management",
      iconUrl: "👥",
      shortDesc: "Building teams that make culture possible.",
      fullDesc: "The HRM department is responsible for member recruitment, engagement, and development. We ensure a positive and productive environment for everyone in the club.",
      coverImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2070&auto=format&fit=crop",
      gallery: [],
      keyActivities: ["Recruitment Drives", "Member Onboarding", "Team Building", "Conflict Resolution"],
      coordinatorId: ""
    }
  ],
  achievements: [
    {
      id: "ach_national_winner_1",
      title: "National Cultural Competition Winner",
      description: "Our drama team won the first prize at the National Inter-College Cultural Competition for their outstanding play.",
      date: "2023-11-15",
      imageUrl: "https://images.unsplash.com/photo-1582192230689-322e206fdf27?q=80&w=2070&auto=format&fit=crop",
      category: "Drama"
    }
  ],
  events: [
    {
      id: "event_annual_fest_1",
      title: "Annual Cultural Fest 2024",
      shortDescription: "Join us for our biggest event of the year, celebrating talent from all our departments with spectacular performances.",
      fullDescription: "The Annual Cultural Fest is a grand celebration of art and culture at Dhaka College. This two-day event features mesmerizing performances from our music, dance, and drama departments, along with exhibitions from our art and literature wings. It's an event not to be missed!",
      date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
      time: "5:00 PM",
      startTime24: "17:00",
      location: "Dhaka College Auditorium",
      imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd51725?q=80&w=2070&auto=format&fit=crop",
      isUpcoming: true,
      registrationLink: "#"
    },
    {
      id: "event_past_concert_2",
      title: "Spring Concert 2023",
      shortDescription: "A melodious evening where our music department showcased their vocal and instrumental talents.",
      fullDescription: "The Spring Concert was a huge success, with our talented musicians enchanting the audience with a mix of classical, folk, and modern tunes. The event was a testament to the hard work and dedication of our members.",
      date: "2023-04-20",
      time: "6:00 PM",
      startTime24: "18:00",
      location: "Dhaka College Auditorium",
      imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop",
      isUpcoming: false,
    }
  ],
  leaders: {
    moderators: [
      { 
        id: "mod_1", 
        name: "Prof. John Doe", 
        position: "Convenor", 
        imageUrl: "", // Left blank to test default image
        bio: "Professor of Bengali Literature and a passionate patron of the arts." 
      }
    ],
    currentExecutives: [
      { 
        id: "exec_1", 
        name: "Jane Smith", 
        position: "President", 
        dcccId: "23-001",
        type: "Presidency",
        imageUrl: "https://randomuser.me/api/portraits/women/1.jpg", 
        bio: "Leading the club with a vision for creativity and collaboration.", 
        department: "dept_music_1",
        phone: "01234567890",
        bloodGroup: "B+",
        socials: [ {name: 'Facebook', url: '#', icon: 'facebook'} ]
      },
      { 
        id: "exec_2", 
        name: "Peter Jones", 
        position: "General Secretary", 
        dcccId: "23-002",
        type: "Secretariat",
        imageUrl: "", // Left blank to test default image
        bio: "Manages club operations and member coordination.", 
        department: "dept_dance_2",
        phone: "01234567891",
        bloodGroup: "A+",
        socials: []
      }
    ],
    pastExecutives: [
      { 
        id: "past_exec_1", 
        name: "Alex Johnson", 
        position: "Former President", 
        dcccId: "22-001",
        type: "Presidency",
        imageUrl: "https://randomuser.me/api/portraits/men/2.jpg", 
        bio: "Led the club to new heights during his tenure.", 
        tenureYears: "2022-2023",
        phone: "",
        bloodGroup: "",
        socials: []
      }
    ]
  },
  join: {
    title: "Become a Part of Our Family",
    description: "Ready to explore your creative potential? Join DCCC and embark on a journey of self-discovery and artistic expression.",
    buttonText: "Register Now",
    buttonLink: "#",
    backgroundImageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop"
  },
  footer: {
    aboutText: "Dhaka College Cultural Club is a student-run organization dedicated to promoting cultural activities and nurturing artistic talent at Dhaka College.",
    logo1Url: "https://dhakacollegeculturalclub.com/logo.png",
    logo2Url: "https://dhakacollege.edu.bd/assets/images/logo.png",
    email: "info@dccc.com",
    phone: "+880 123 456 789",
    address: "Dhaka College, New Market, Dhaka-1205",
    socialLinks: [
      { name: "Facebook", url: "#", icon: "facebook" },
      { name: "Instagram", url: "#", icon: "instagram" }
    ],
    copyrightText: "Dhaka College Cultural Club. All Rights Reserved.",
    adminPanelLink: { text: "Admin Panel", url: "#/login" }
  },
  theme: {
    backgroundColor: "#f9fafb",
    nodeColor: "#4b5563",
    highlightColor: "#4f46e5",
    lineColor: "rgba(107, 114, 128, 0.2)",
    lineHighlightColor: "rgba(79, 70, 229, 0.5)",
    nodeDensity: 9000,
    nodeSize: 1.5,
    mouseRepelStrength: 2,
    clickEffectEnabled: true,
  }
};