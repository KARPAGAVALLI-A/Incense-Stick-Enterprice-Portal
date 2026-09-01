import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
const SESSION_KEY = "ise_session";

// Password Strength Validator: Requires Alphabet + Number + Special Character + min 6 chars
export function validatePassword(password) {
  const hasAlpha = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const isMinLength = password.length >= 6;

  return {
    hasAlpha,
    hasNumber,
    hasSpecial,
    isMinLength,
    isValid: hasAlpha && hasNumber && hasSpecial && isMinLength
  };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }, [session]);

  // Login function accepting any email & explicitly chosen role
  function login(email, selectedRole = "admin") {
    if (!email || !email.includes("@")) return null;

    const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const role = selectedRole || "admin";

    setSession({ email, role, name });
    return role;
  }

  function logout() {
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        role: session?.role || null,
        email: session?.email || null,
        name: session?.name || null,
        login,
        logout,
        validatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
