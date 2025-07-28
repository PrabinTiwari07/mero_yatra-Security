import { createContext, useContext, useEffect, useState } from 'react';
import { PASSWORD_POLICY } from '../utils/passwordSecurity';

const SecurityContext = createContext();

export const useSecurity = () => {
    const context = useContext(SecurityContext);
    if (!context) {
        throw new Error('useSecurity must be used within a SecurityProvider');
    }
    return context;
};

export const SecurityProvider = ({ children }) => {
    const [loginAttempts, setLoginAttempts] = useState({});
    const [accountLockouts, setAccountLockouts] = useState({});
    const [passwordHistory, setPasswordHistory] = useState({});
    const [securitySettings, setSecuritySettings] = useState(PASSWORD_POLICY);
    const [isLoaded, setIsLoaded] = useState(false);
    const [updateTick, setUpdateTick] = useState(0); // Force updates for lockout countdown

    // Load security data from localStorage on mount
    useEffect(() => {
        try {
            const savedLoginAttempts = localStorage.getItem('loginAttempts');
            const savedAccountLockouts = localStorage.getItem('accountLockouts');
            const savedPasswordHistory = localStorage.getItem('passwordHistory');

            if (savedLoginAttempts) {
                setLoginAttempts(JSON.parse(savedLoginAttempts));
            }
            if (savedAccountLockouts) {
                setAccountLockouts(JSON.parse(savedAccountLockouts));
            }
            if (savedPasswordHistory) {
                setPasswordHistory(JSON.parse(savedPasswordHistory));
            }
        } catch (error) {
            console.error('Error loading security data from localStorage:', error);
            // Clear corrupted data
            localStorage.removeItem('loginAttempts');
            localStorage.removeItem('accountLockouts');
            localStorage.removeItem('passwordHistory');
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save to localStorage whenever state changes
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem('loginAttempts', JSON.stringify(loginAttempts));
            } catch (error) {
                console.error('Error saving loginAttempts to localStorage:', error);
            }
        }
    }, [loginAttempts, isLoaded]);

    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem('accountLockouts', JSON.stringify(accountLockouts));
            } catch (error) {
                console.error('Error saving accountLockouts to localStorage:', error);
            }
        }
    }, [accountLockouts, isLoaded]);

    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
            } catch (error) {
                console.error('Error saving passwordHistory to localStorage:', error);
            }
        }
    }, [passwordHistory, isLoaded]);

    // Global timer for lockout countdown updates
    useEffect(() => {
        const interval = setInterval(() => {
            setUpdateTick(prev => prev + 1);
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, []);

    // Track failed login attempts
    const recordFailedLogin = (email) => {
        const now = new Date().toISOString();
        const attempts = loginAttempts[email] || [];

        // Remove attempts older than 24 hours
        const recentAttempts = attempts.filter(attempt => {
            const attemptTime = new Date(attempt);
            const hoursDiff = (new Date() - attemptTime) / (1000 * 60 * 60);
            return hoursDiff < 24;
        });

        const newAttempts = [...recentAttempts, now];

        setLoginAttempts(prev => ({
            ...prev,
            [email]: newAttempts
        }));

        // Check if account should be locked
        if (newAttempts.length >= securitySettings.lockoutThreshold) {
            lockAccount(email);
            return true; // Account locked
        }

        return false; // Account not locked
    };

    // Lock an account
    const lockAccount = (email) => {
        const lockoutTime = new Date();
        lockoutTime.setMinutes(lockoutTime.getMinutes() + securitySettings.lockoutDuration);

        setAccountLockouts(prev => ({
            ...prev,
            [email]: lockoutTime.toISOString()
        }));
    };

    // Check if account is locked
    const isAccountLocked = (email) => {
        if (!isLoaded || !email) return { locked: false };

        const lockoutTime = accountLockouts[email];
        if (!lockoutTime) return { locked: false };

        try {
            const now = new Date();
            const lockout = new Date(lockoutTime);

            // Validate the lockout time
            if (isNaN(lockout.getTime())) {
                // Invalid date, remove it
                setAccountLockouts(prev => {
                    const updated = { ...prev };
                    delete updated[email];
                    return updated;
                });
                return { locked: false };
            }

            if (now < lockout) {
                const remainingMinutes = Math.ceil((lockout - now) / (1000 * 60));
                return {
                    locked: true,
                    remainingTime: remainingMinutes > 0 ? remainingMinutes : 1 // Ensure at least 1 minute is shown
                };
            } else {
                // Lockout expired, remove it
                setAccountLockouts(prev => {
                    const updated = { ...prev };
                    delete updated[email];
                    return updated;
                });
                return { locked: false };
            }
        } catch (error) {
            console.error('Error checking account lockout:', error);
            return { locked: false };
        }
    };

    // Clear failed login attempts (on successful login)
    const clearFailedAttempts = (email) => {
        setLoginAttempts(prev => {
            const updated = { ...prev };
            delete updated[email];
            return updated;
        });

        setAccountLockouts(prev => {
            const updated = { ...prev };
            delete updated[email];
            return updated;
        });
    };

    // Get remaining login attempts
    const getRemainingAttempts = (email) => {
        if (!isLoaded || !email) return securitySettings.lockoutThreshold;

        const attempts = loginAttempts[email] || [];
        const recentAttempts = attempts.filter(attempt => {
            try {
                const attemptTime = new Date(attempt);
                if (isNaN(attemptTime.getTime())) return false;
                const hoursDiff = (new Date() - attemptTime) / (1000 * 60 * 60);
                return hoursDiff < 24;
            } catch (error) {
                return false;
            }
        });

        return Math.max(0, securitySettings.lockoutThreshold - recentAttempts.length);
    };

    // Password history management
    const addPasswordToHistory = (email, passwordHash) => {
        setPasswordHistory(prev => {
            const userHistory = prev[email] || [];
            const updatedHistory = [passwordHash, ...userHistory].slice(0, securitySettings.passwordHistoryCount);

            return {
                ...prev,
                [email]: updatedHistory
            };
        });
    };

    // Check if password was used recently
    const isPasswordInHistory = (email, passwordHash) => {
        const userHistory = passwordHistory[email] || [];
        return userHistory.includes(passwordHash);
    };

    // Session management
    const [sessionData, setSessionData] = useState({
        lastActivity: null,
        sessionTimeout: 30 * 60 * 1000, // 30 minutes in milliseconds
        warningTime: 5 * 60 * 1000, // Show warning 5 minutes before timeout
    });

    // Update last activity time
    const updateActivity = () => {
        setSessionData(prev => ({
            ...prev,
            lastActivity: new Date().toISOString()
        }));
    };

    // Check if session is about to expire
    const getSessionStatus = () => {
        if (!sessionData.lastActivity) return { active: false };

        const now = new Date();
        const lastActivity = new Date(sessionData.lastActivity);
        const timeSinceActivity = now - lastActivity;

        if (timeSinceActivity > sessionData.sessionTimeout) {
            return { active: false, expired: true };
        }

        if (timeSinceActivity > (sessionData.sessionTimeout - sessionData.warningTime)) {
            const remainingTime = sessionData.sessionTimeout - timeSinceActivity;
            return {
                active: true,
                warning: true,
                remainingMinutes: Math.ceil(remainingTime / (1000 * 60))
            };
        }

        return { active: true };
    };

    // Security event logging
    const [securityEvents, setSecurityEvents] = useState([]);

    const logSecurityEvent = (event, details = {}) => {
        const securityEvent = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            event,
            details,
            userAgent: navigator.userAgent,
            ip: 'client-side' // In real app, this would come from server
        };

        setSecurityEvents(prev => [securityEvent, ...prev].slice(0, 100)); // Keep last 100 events
    };

    // Debug helper (can be removed in production)
    const debugSecurityState = () => {
        console.log('Security Debug Info:', {
            isLoaded,
            loginAttempts,
            accountLockouts,
            localStorage: {
                loginAttempts: localStorage.getItem('loginAttempts'),
                accountLockouts: localStorage.getItem('accountLockouts')
            }
        });
    };

    const value = {
        // Login attempt tracking
        recordFailedLogin,
        clearFailedAttempts,
        getRemainingAttempts,
        isAccountLocked,
        lockAccount,

        // Password history
        addPasswordToHistory,
        isPasswordInHistory,

        // Session management
        updateActivity,
        getSessionStatus,
        sessionData,

        // Security events
        logSecurityEvent,
        securityEvents,

        // Settings
        securitySettings,
        setSecuritySettings,

        // Loading state
        isLoaded,

        // Update tick for real-time countdown
        updateTick,

        // Debug helper
        debugSecurityState
    };

    return (
        <SecurityContext.Provider value={value}>
            {children}
        </SecurityContext.Provider>
    );
};

export default SecurityContext;
