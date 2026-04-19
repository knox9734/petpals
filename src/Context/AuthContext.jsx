import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser]       = useState(null);
    const [loading, setLoading] = useState(true); // true while restoring session

    // Restore session from localStorage on first load
    useEffect(() => {
        const stored = localStorage.getItem("user");
        const token  = localStorage.getItem("access");
        if (stored && token) {
            setUser(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    const saveSession = (userData, tokens) => {
        localStorage.setItem("user",    JSON.stringify(userData));
        localStorage.setItem("access",  tokens.access);
        localStorage.setItem("refresh", tokens.refresh);
        setUser(userData);
    };

    const clearSession = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
    };

    // Returns user object on success, throws on failure
    const register = async ({ fname, lname, email, password, confirm_password }) => {
        const data = await authAPI.register({
            first_name:       fname,
            last_name:        lname,
            email,
            password,
            confirm_password,
        });
        saveSession(data.user, data.tokens);
        return data.user;
    };

    // Returns user object on success, throws on failure
    const login = async ({ email, password }) => {
        const data = await authAPI.login({ email, password });
        saveSession(data.user, data.tokens);
        return data.user;
    };

    const logout = async () => {
        const refresh = localStorage.getItem("refresh");
        const access  = localStorage.getItem("access");
        try {
            if (refresh) await authAPI.logout(refresh, access);
        } catch (_) {
            // best-effort — clear locally regardless
        }
        clearSession();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);