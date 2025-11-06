
import React from 'react';
import { NavLink } from 'react-router-dom';
import { getAppData } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import type { FooterData } from '../types';

const SocialIcon = ({ icon }: { icon: string }) => {
    // A simple way to get SVG paths for icons without full library
    const icons: { [key: string]: string } = {
        facebook: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
        instagram: "M12 2a10 10 0 110 20 10 10 0 010-20zm0 2a8 8 0 100 16 8 8 0 000-16zm4.5-2.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z",
        youtube: "M21.582 7.306a2.474 2.474 0 00-1.752-1.752C18.25 5 12 5 12 5s-6.25 0-7.83.554a2.474 2.474 0 00-1.752 1.752C2 8.886 2 12 2 12s0 3.114.418 4.694a2.474 2.474 0 001.752 1.752C5.75 19 12 19 12 19s6.25 0 7.83-.554a2.474 2.474 0 001.752-1.752C22 15.114 22 12 22 12s0-3.114-.418-4.694zM9.5 14.5v-5l4.5 2.5-4.5 2.5z"
    };
    return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d={icons[icon] || ''} />
        </svg>
    )
}

const Footer: React.FC = () => {
    const { data: appData } = useData(getAppData);
    const footerData = appData?.footer;

    if (!footerData) return null;

    return (
        <footer className="bg-gray-950 border-t border-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div className="md:col-span-2">
                        <h3 className="text-xl font-bold text-teal-400 mb-4">Dhaka College Cultural Club</h3>
                        <p className="text-gray-400 pr-8">{footerData.text}</p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {footerData.quickLinks.map(link => (
                                <li key={link.name}>
                                    <NavLink to={link.url} className="text-gray-400 hover:text-teal-400 transition-colors">
                                        {link.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>{footerData.address}</li>
                            <li>{footerData.email}</li>
                            <li>{footerData.phone}</li>
                        </ul>
                        <div className="flex space-x-4 mt-6">
                           {footerData.socialLinks.map(social => (
                             <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors">
                                <span className="sr-only">{social.name}</span>
                                <SocialIcon icon={social.icon} />
                            </a>
                           ))}
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Dhaka College Cultural Club. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
