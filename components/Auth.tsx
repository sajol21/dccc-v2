
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
    signIn as firebaseSignIn, 
    signOut as firebaseSignOut, 
    onAuthStateChanged,
    type User
} from '../services/firebaseService';
import Loader from './Loader';

interface AuthContextType {
    user: User | null;
    isAdmin: boolean;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<any>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_UID = 'kZTv1lTYKUPN1qFb9L8XwKYkwdA2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                const adminStatus = currentUser.uid === ADMIN_UID;
                setUser(currentUser);
                setIsAdmin(adminStatus);
            } else {
                setUser(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const value = useMemo(() => ({
        user,
        isAdmin,
        loading,
        signIn: firebaseSignIn,
        signOut: firebaseSignOut
    }), [user, isAdmin, loading]);

    return (
        <AuthContext.Provider value={value}>
            {loading ? <div className="h-screen flex items-center justify-center"><Loader /></div> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};