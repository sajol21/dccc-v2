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
}

export interface Department {
  id: string;
  name: string;
  iconUrl: string;
  shortDesc: string;
  fullDesc: string;
  gallery: { type: 'image' | 'video'; url: string; thumbUrl: string }[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string; // ISO format string
  imageUrl: string;
  category: string;
}

interface Person {
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
  text: string;
  email: string;
  phone: string;
  address: string;
  socialLinks: { name: string; url: string; icon: string }[];
  quickLinks: { name:string; url: string }[];
}

export interface AppData {
    hero: HeroData;
    about: AboutData;
    departments: Department[];
    achievements: Achievement[];
    leaders: LeadersData;
    join: JoinData;
    footer: FooterData;
}