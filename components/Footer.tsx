
import React from 'react';
import { getAppData } from '../services/firebaseService';
import { useData } from '../hooks/useData';

const SocialIcon = ({ icon }: { icon: string }) => {
    const icons: { [key: string]: string } = {
        facebook: "M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47 14 5.5 16 5.5H17.5V2.14C17.174 2.097 15.943 2 14.643 2C11.928 2 10 3.657 10 6.7V9.5H7V13.5H10V22H14V13.5Z",
        instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.644-.069 4.85-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98C23.986 15.667 24 15.259 24 12s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z",
        linkedin: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
        email: "M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"
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
