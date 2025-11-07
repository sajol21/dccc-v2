import React from 'react';
import { Link } from 'react-router-dom';
import { getAppData } from '../services/firebaseService';
import { useData } from '../hooks/useData';

const Footer: React.FC = () => {
    const { data: appData } = useData(getAppData);
    const footerData = appData?.footer;

    if (!footerData) {
        return (
            <footer className="bg-gray-100 border-t">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-500">
                    &copy; {new Date().getFullYear()} Dhaka College Cultural Club. All Rights Reserved.
                </div>
            </footer>
        );
    }

    return (
        <footer className="bg-gray-100 border-t text-gray-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col items-center text-center">
                    {/* Logos */}
                    <div className="flex items-center gap-4 mb-4">
                        <img src={footerData.logo1Url} alt="DCCC Logo" className="h-12" />
                        <img src={footerData.logo2Url} alt="Dhaka College Logo" className="h-12" />
                    </div>
                    <p className="max-w-md mb-6">{footerData.aboutText}</p>

                    {/* Contact Info */}
                    <div className="mb-6">
                        <p>{footerData.address}</p>
                        <p>Email: <a href={`mailto:${footerData.email}`} className="text-blue-600 hover:underline">{footerData.email}</a></p>
                        <p>Phone: <a href={`tel:${footerData.phone.replace(/\s/g, '')}`} className="text-blue-600 hover:underline">{footerData.phone}</a></p>
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center space-x-6 mb-8">
                        {footerData.socialLinks.map(social => (
                            <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">
                                {social.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
            {/* Copyright and Admin Link */}
            <div className="border-t border-gray-200">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
                    <p className="text-center sm:text-left mb-2 sm:mb-0">
                        &copy; {new Date().getFullYear()} {footerData.copyrightText}
                    </p>
                    <a href={footerData.adminPanelLink.url} className="hover:text-blue-500 transition-colors">{footerData.adminPanelLink.text}</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
