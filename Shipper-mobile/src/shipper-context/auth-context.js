// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const storedId = await AsyncStorage.getItem('userId');
                const storedToken = await AsyncStorage.getItem('token');
                if (storedId) setUserId(storedId);
                if (storedToken) setToken(storedToken);
            } catch (e) {
                console.warn('Auth load error', e);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const signIn = async ({ id, token: newToken }, persist = true) => {
        setUserId(id ?? null);
        setToken(newToken ?? null);
        if (persist) {
            try {
                if (id) await AsyncStorage.setItem('userId', String(id));
                if (newToken) await AsyncStorage.setItem('token', newToken);
            } catch (e) {
                console.warn('Auth persist error', e);
            }
        }
    };

    const signOut = async () => {
        setUserId(null);
        setToken(null);
        try {
            await AsyncStorage.removeItem('userId');
            await AsyncStorage.removeItem('token');
        } catch (e) {
            console.warn('Auth clear error', e);
        }
    };

    return (
        <AuthContext.Provider value={{ userId, token, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
