import { createContext, useContext, useEffect, useState } from 'react';

const AUTH_STORAGE_KEY = 'evidence_ai_session_v1';
const PREFS_STORAGE_KEY = 'evidence_ai_prefs_v1';

const DEFAULT_USER = {
  id: 'USR-AC-001',
  name: 'Aswin',
  initials: 'AC',
  email: 'aswin@evidenceai.demo',
  role: 'Lead Digital Forensics Investigator',
  department: 'Cyber & Financial Forensics Unit',
  avatarColor: '#7656E8',
};

const DEFAULT_PREFERENCES = {
  emailNotifications: true,
  analysisNotifications: true,
  reportNotifications: true,
  language: 'English (US)',
  dateFormat: 'YYYY-MM-DD',
  theme: 'Light (Default)',
  twoFactorReminder: true,
  sessionTimeout: '30 minutes',
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.user || DEFAULT_USER;
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed.isAuthenticated);
      }
    } catch {
      // ignore storage errors
    }
    return false;
  });

  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem(PREFS_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_PREFERENCES;
  });

  const [lastSignInAt, setLastSignInAt] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.lastSignInAt || null;
      }
    } catch {
      // ignore
    }
    return null;
  });

  useEffect(() => {
    try {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // ignore
    }
  }, [preferences]);

  const signInDemo = ({ email, rememberMe = true } = {}) => {
    const nextUser = {
      ...user,
      email: email && email.trim() ? email.trim() : user.email,
    };
    const timestamp = new Date().toISOString();
    setUser(nextUser);
    setIsAuthenticated(true);
    setLastSignInAt(timestamp);

    if (rememberMe) {
      try {
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ isAuthenticated: true, user: nextUser, lastSignInAt: timestamp })
        );
      } catch {
        // ignore
      }
    } else {
      try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    return nextUser;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const updateProfile = (updates) => {
    const nextName = (updates.name || user.name).trim();
    const parts = nextName.split(/\s+/).filter(Boolean);
    const nextInitials =
      parts.length >= 2
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : nextName.slice(0, 2).toUpperCase() || 'AC';

    const nextUser = {
      ...user,
      ...updates,
      name: nextName,
      initials: updates.initials || nextInitials,
    };
    setUser(nextUser);
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ ...parsed, user: nextUser })
        );
      }
    } catch {
      // ignore
    }
  };

  const updatePreferences = (partial) => {
    setPreferences((prev) => ({ ...prev, ...partial }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        lastSignInAt,
        preferences,
        signInDemo,
        logout,
        updateProfile,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
