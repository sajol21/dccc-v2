
import React from 'react';
import { getAppData } from '../services/firebaseService';
import { useData } from '../hooks/useData';

const SocialIcon = ({ icon }: { icon: string }) => {
    const icons: { [key: string]: string } = {
        facebook: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
        instagram: "M12 2a10 10 0 110 20 10 10 0 010-20zm0 2a8 8 0 100 16 8 8 0 000-16zm4.5-2.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z",
        linkedin: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
        email: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v.39l8 5.61 8-5.61V6H4zm0 12h16V8l-8 5-8-5v10z"
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
        <footer className="bg-white border-t border-gray-200 text-gray-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* About */}
                    <div className="md:col-span-5 lg:col-span-6">
                        <div className="flex items-center gap-4 mb-4">
                            <img src={footerData.logo1Url} alt="Dhaka College Logo" className="h-16" />
                            <img src={footerData.logo2Url} alt="Cultural Club Logo" className="h-16" />
                        </div>
                        <p className="text-gray-600 mb-4">{footerData.aboutText}</p>
                         <div className="flex space-x-4">
                           {footerData.socialLinks.map(social => (
                             <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">
                                <span className="sr-only">{social.name}</span>
                                <SocialIcon icon={social.icon} />
                            </a>
                           ))}
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="md:col-span-1 lg:col-span-2"></div>

                    {/* Contact */}
                    <div className="md:col-span-3 lg:col-span-2">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Contact</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li><a href={`mailto:${footerData.email}`} className="hover:text-blue-600 transition-colors">{footerData.email}</a></li>
                            <li><a href={`tel:${footerData.phone.replace(/\s/g, '')}`} className="hover:text-blue-600 transition-colors">{footerData.phone}</a></li>
                        </ul>
                    </div>

                    {/* Address */}
                    <div className="md:col-span-3 lg:col-span-2">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Address</h3>
                        <p className="text-gray-600">{footerData.address}</p>
                    </div>
                </div>
            </div>
             <div className="border-t border-gray-200">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500">
                    <p>
                        &copy; {new Date().getFullYear()} {footerData.copyrightText} | <a href={footerData.adminPanelLink.url} className="hover:text-blue-600 transition-colors">{footerData.adminPanelLink.text}</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;