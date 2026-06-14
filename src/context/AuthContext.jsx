import React, { createContext, useState, useEffect, useContext } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";
import { saveSession, getSession, clearSession } from "../utils/session";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loginTime, setLoginTime] = useState(null);
  const [expiryTime, setExpiryTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session.user);
      setLoginTime(session.loginTime);
      setExpiryTime(session.expiryTime);
    }
    setIsLoading(false);
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      const userData = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        photo: firebaseUser.photoURL,
      };

      saveSession(userData);

      const session = getSession();
      setUser(userData);
      setLoginTime(session.loginTime);
      setExpiryTime(session.expiryTime);

      toast.success("Logged in successfully");
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      clearSession();
      setUser(null);
      setLoginTime(null);
      setExpiryTime(null);
      toast.success("Logged out");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginTime, expiryTime, isLoading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);