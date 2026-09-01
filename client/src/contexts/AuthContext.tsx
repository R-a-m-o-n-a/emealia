import React, {createContext, useContext, useEffect, useState} from 'react';
import {getUserId} from '../utils/user/getUserId';

interface AuthContextType {
    userId: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        getUserId().then((id) => setUserId(id));
    }, []);

    if (!userId) {
        return null; // todo check if things need to be adjusted to show splash screen here
    }

    return (
        <AuthContext.Provider value={{userId}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}