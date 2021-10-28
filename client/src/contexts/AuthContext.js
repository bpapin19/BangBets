import React, {useContext, useState, useEffect} from 'react';
import { auth } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password);
    }

    function setClient() {
        return currentUser.updateProfile({
            displayName: "client"
        });
    }

    function setBookie() {
        return currentUser.updateProfile({
            displayName: "bookie"
        });
    }

    function logout() {
        return auth.signOut();
    }

    function updateUsername(username) {
        return currentUser.updateProfile({
            displayName: username
        });
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email);
    }

    function updateEmail(email) {
        return currentUser.updateEmail(email);
    }

    function updatePassword(password) {
        return currentUser.updatePassword(password);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        login,
        setClient,
        setBookie,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
        updateUsername
    }
    
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}