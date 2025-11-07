import React from 'react';
import { Link } from 'react-router-dom';
import { getAppData } from '../services/firebaseService';
import { useData } from '../hooks/useData';

const SocialIcon: React.FC<{ icon: string }> = ({ icon }) => {
    const icons: { [key: string]: string } = {
        facebook: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
        instagram: "M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm0 18a8 8 0 118-8 8.009 8.009 0 01-8 8zm0-13a5 5 0 105 5 5.006 5.006 0 00-5-5zm0 8a3 3 0 113-3 3.003 3.003 0 01-3 3zm5.5-7.5a1 1 0 100-2 1 1 0 000 2z",
        linkedin: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
        email: "M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"
    };
    return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d={icons[icon] || ''} />
        </svg>
    );
};

const Footer: React.FC = () => {
    const { data: appData } = useData(getAppData);
    const footerData = appData?.footer;

    if (!footerData) {
        return (
            <footer className="bg-gray-100 border-t">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-gray-500">
                    <p>
                        &copy; {new Date().getFullYear()} Dhaka College Cultural Club. All Rights Reserved.
                        <Link to="/login" className="hover:text-indigo-500 transition-colors ml-2 pl-2 border-l border-gray-400">
                            Admin Panel
                        </Link>
                    </p>
                </div>
            </footer>
        );
    }

    return (
        <footer className="bg-gray-100 border-t text-gray-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col items-center text-center">
                    {/* Logos */}
                    <div className="flex items-center gap-4 mb-4">
                        <img src={footerData.logo2Url} alt="Dhaka College Logo" className="h-12" />
                    </div>
                    <p className="max-w-md mb-4 text-sm">{footerData.aboutText}</p>

                    {/* Contact Info */}
                    <div className="mb-4 text-sm">
                        <p>{footerData.address}</p>
                        <a href={`mailto:${footerData.email}`} className="text-indigo-600 hover:underline">{footerData.email}</a>
                        {' | '}
                        <a href={`tel:${footerData.phone.replace(/\s/g, '')}`} className="text-indigo-600 hover:underline">{footerData.phone}</a>
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center space-x-6 mb-4">
                        {footerData.socialLinks.map(social => (
                            <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600 transition-colors" aria-label={social.name}>
                                <SocialIcon icon={social.icon} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
            {/* Copyright and Admin Link */}
            <div className="border-t border-gray-200">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-gray-500">
                    <p>
                        &copy; {new Date().getFullYear()} {footerData.copyrightText}
                        <Link to={footerData.adminPanelLink.url.replace('#', '')} className="hover:text-indigo-500 transition-colors ml-2 pl-2 border-l border-gray-400">
                            {footerData.adminPanelLink.text}
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;