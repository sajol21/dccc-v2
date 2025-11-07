
export interface HeroData {
  headline: string;
  tagline: string;
  ctaButtons: { text: string; link: string }[];
}

export interface AboutData {
  shortText: string;
  fullText: string;
  imageUrl: string;
  videoUrl?: string;
  foundedYear: number;
  visionTagline: string;
  stats: { value: string; label: string }[];
}

export interface Department {
  id: string;
  name: string;
  iconUrl: string;
  shortDesc: string;
  fullDesc: string;
  coverImage: string;
  gallery: { type: 'image' | 'video'; url: string; thumbUrl: string }[];
  keyActivities: string[];
  coordinatorId: string; // ID of an Executive
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string; // ISO format string
  imageUrl: string;
  category: string;
}

export interface Event {
  id:string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  date: string; // ISO format string
  time: string; // e.g., "6:00 PM"
  startTime24?: string; // e.g., "18:00" for calendar links
  location: string;
  imageUrl: string;
  isUpcoming: boolean;
  registrationLink?: string;
  segments?: { title: string; items: { primary: string; secondary: string; tertiary?: string }[] }[];
  customButtons?: { text: string; link: string; icon: string }[];
}

export interface Person {
  id: string;
  name: string;
  position: string;
  imageUrl: string;
  bio: string;
  dcccId?: string;
  phone?: string;
  email?: string;
  socials?: { name: string; url: string; icon: string }[];
  bloodGroup?: string;
  religion?: string;
}


export interface Moderator extends Person {}

export interface Executive extends Person {
  department?: string; // For current executives
  tenureYears?: string; // For past executives
}

export interface LeadersData {
  moderators: Moderator[];
  currentExecutives: Executive[];
  pastExecutives: Executive[];
}

export interface JoinData {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface FooterData {
  aboutText: string;
  logo1Url: string;
  logo2Url: string;
  email: string;
  phone: string;
  address: string;
  socialLinks: { name: string; url: string; icon: string }[];
  copyrightText: string;
  adminPanelLink: { text: string; url: string };
}

export interface ThemeData {
    backgroundColor: string;
    nodeColor: string;
    highlightColor: string;
    lineColor: string;
    lineHighlightColor: string;
    nodeDensity: number;
    nodeSize: number;
    mouseRepelStrength: number;
    clickEffectEnabled: boolean;
}

export interface AppData {
    hero: HeroData;
    about: AboutData;
    departments: Department[];
    achievements: Achievement[];
    events: Event[];
    leaders: LeadersData;
    join: JoinData;
    footer: FooterData;
    theme: ThemeData;
}