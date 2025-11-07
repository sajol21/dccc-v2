
import React, { useState, useEffect } from 'react';
import { useToast } from '../ToastProvider';
import { getLeaders, saveLeaders, getDepartments } from '../../services/firebaseService';
import type { Department, Moderator, Executive, LeadersData } from '../../types';
import ImageUploadInput from './ImageUploadInput';
import Loader from '../Loader';

const inputStyles = "w-full rounded-md border-gray-300 shadow-sm bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition h-10 px-3";

const FormWrapper: React.FC<{title: string, description: string, children: React.ReactNode}> = ({title, description, children}) => (
     <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
        <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <main>
            {children}
        </main>
    </div>
);


const FormField: React.FC<{ label: string, children: React.ReactNode}> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
    </div>
);

const AddMember: React.FC = () => {
    const { addToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loadingDepartments, setLoadingDepartments] = useState(true);

    const initialFormState = {
        name: '',
        panelCategory: 'currentExecutives', // 'moderators', 'currentExecutives', 'pastExecutives'
        position: '',
        tenureYears: '2025',
        type: 'Executive', // 'Presidency', 'Secretariat', 'Executive'
        department: '',
        imageUrl: '',
        phone: '',
        dcccId: '',
        bloodGroup: '',
        religion: '',
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        getDepartments()
            .then(setDepartments)
            .catch(() => addToast('Failed to load departments', 'error'))
            .finally(() => setLoadingDepartments(false));
    }, [addToast]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUrlChange = (url: string) => {
        setFormData(prev => ({ ...prev, imageUrl: url }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.position) {
            addToast('Full Name and Position are required.', 'error');
            return;
        }
        setIsSaving(true);
        try {
            const leadersData: LeadersData = await getLeaders();
            const slugPart = formData.name.toLowerCase().replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, '-');
            const newMember: Moderator | Executive = {
                id: `${slugPart}-${Date.now()}`,
                name: formData.name,
                position: formData.position,
                imageUrl: formData.imageUrl,
                bio: '', // Bio can be edited later
                phone: formData.phone,
                dcccId: formData.dcccId ? `DCCC-${formData.dcccId}` : '',
                bloodGroup: formData.bloodGroup,
                religion: formData.religion,
                socials: [], // Socials can be edited later
                ...(formData.panelCategory !== 'moderators' && {
                    department: formData.department,
                    tenureYears: formData.tenureYears,
                    type: formData.type as 'Presidency' | 'Secretariat' | 'Executive',
                }),
            };

            const updatedLeadersData = { ...leadersData };
            const categoryKey = formData.panelCategory as keyof LeadersData;
            
            if (categoryKey === 'moderators') {
                updatedLeadersData.moderators = [...(leadersData.moderators || []), newMember as Moderator];
            } else if (categoryKey === 'currentExecutives') {
                updatedLeadersData.currentExecutives = [...(leadersData.currentExecutives || []), newMember as Executive];
            } else if (categoryKey === 'pastExecutives') {
                updatedLeadersData.pastExecutives = [...(leadersData.pastExecutives || []), newMember as Executive];
            }

            await saveLeaders(updatedLeadersData);
            addToast('✅ New member added successfully!');
            setFormData(initialFormState); // Reset form
        } catch (error) {
            console.error("Failed to add new member:", error);
            addToast('❌ Failed to add new member.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const religions = ["Islam", "Hinduism", "Christianity", "Buddhism", "Other"];
    const years = Array.from({ length: 10 }, (_, i) => (2030 - i).toString());
    const positions = [
        "President", "Vice President", "General Secretary", "Joint Secretary", 
        "Operating Secretary", "IT Secretary", "Financial Secretary", "Executive Member",
        "Convenor", "Moderator"
    ];

    return (
        <FormWrapper title="Add New Panel Member" description="Fill in the details to add a new member to the club's panel.">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6">
                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Member Role</h3>
                        <FormField label="Panel Category">
                             <select name="panelCategory" value={formData.panelCategory} onChange={handleChange} className={inputStyles}>
                                <option value="currentExecutives">Current Executive</option>
                                <option value="pastExecutives">Past Executive</option>
                                <option value="moderators">Moderator</option>
                            </select>
                        </FormField>

                        <FormField label="Position">
                            <select name="position" value={formData.position} onChange={handleChange} required className={inputStyles}>
                                <option value="">Select Position</option>
                                {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                            </select>
                        </FormField>

                        {formData.panelCategory !== 'moderators' && (
                             <>
                                <FormField label="Type / Province">
                                    <select name="type" value={formData.type} onChange={handleChange} className={inputStyles}>
                                        <option value="Executive">Executive</option>
                                        <option value="Secretariat">Secretariat</option>
                                        <option value="Presidency">Presidency</option>
                                    </select>
                                </FormField>
                                <FormField label="Department (if applicable)">
                                    {loadingDepartments ? <Loader/> : (
                                        <select name="department" value={formData.department} onChange={handleChange} className={inputStyles}>
                                            <option value="">Select Department</option>
                                            {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                                        </select>
                                    )}
                                </FormField>
                                <FormField label="Year / Tenure">
                                     <select name="tenureYears" value={formData.tenureYears} onChange={handleChange} className={inputStyles}>
                                        {years.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </FormField>
                            </>
                         )}
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-6">
                         <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal & Contact Details</h3>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="sm:col-span-2">
                                <FormField label="Full Name">
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputStyles} />
                                </FormField>
                            </div>
                             <div className="sm:col-span-2">
                                <ImageUploadInput label="Image URL" value={formData.imageUrl} onChange={handleImageUrlChange} />
                            </div>
                             <FormField label="Phone (Optional)">
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputStyles} />
                            </FormField>
                            <FormField label="DCCC ID">
                                <div className="flex items-center">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm h-10">DCCC-</span>
                                    <input type="text" name="dcccId" value={formData.dcccId} onChange={handleChange} className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 h-10" />
                                </div>
                            </FormField>
                            <FormField label="Blood Group (Optional)">
                                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className={inputStyles}>
                                    <option value="">Select Blood Group</option>
                                    {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                </select>
                            </FormField>
                            <FormField label="Religion (Optional)">
                                <select name="religion" value={formData.religion} onChange={handleChange} className={inputStyles}>
                                    <option value="">Select Religion</option>
                                    {religions.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </FormField>
                         </div>
                    </div>
                </div>

                <div className="pt-6 border-t mt-8">
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setFormData(initialFormState)} className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Reset
                        </button>
                        <button type="submit" disabled={isSaving} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 w-36">
                           {isSaving ? 'Saving...' : 'Add Member'}
                        </button>
                    </div>
                </div>
            </form>
        </FormWrapper>
    );
};

export default AddMember;