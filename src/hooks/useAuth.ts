import { useState, useEffect, createContext, useContext } from 'react';
import type { User, AuthState, LoginCredentials } from '../types/auth';

const AuthContext = createContext<{
  auth: AuthState;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
  sendOTP: (email: string) => Promise<boolean>;
} | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const useAuthState = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  // Demo users with proper role-based permissions
  const demoUsers: Record<string, User> = {
    'agent_demo@example.com': {
      id: 'ag1',
      email: 'agent_demo@example.com',
      name: 'John Smith',
      role: 'Travel Agent',
      permissions: ['book_cruise', 'book_hotel', 'view_bookings', 'manage_passengers'],
      region: 'Delhi',
      isActive: true,
      otpRequired: true
    },
    'admin_demo@example.com': {
      id: 'ba1',
      email: 'admin_demo@example.com',
      name: 'Sarah Johnson',
      role: 'Basic Admin',
      permissions: ['manage_agents', 'view_bookings', 'manage_inventory', 'resolve_complaints'],
      team: 'North India Operations',
      region: 'Delhi, Punjab, Haryana',
      isActive: true
    },
    'superadmin_demo@example.com': {
      id: 'sa1',
      email: 'superadmin_demo@example.com',
      name: 'Michael Chen',
      role: 'Super Admin',
      permissions: ['*'], // All permissions
      isActive: true
    }
  };

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('yorker_user');
    const sessionExpiry = localStorage.getItem('yorker_session_expiry');
    
    if (savedUser && sessionExpiry) {
      const expiry = parseInt(sessionExpiry);
      if (Date.now() < expiry) {
        setAuth({
          user: JSON.parse(savedUser),
          isAuthenticated: true,
          isLoading: false,
          sessionExpiry: expiry
        });
      } else {
        // Session expired
        localStorage.removeItem('yorker_user');
        localStorage.removeItem('yorker_session_expiry');
        alert('Your session has expired. Please login again.');
        setAuth(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuth(prev => ({ ...prev, isLoading: false }));
    }

    // Auto-logout timer
    const checkSession = setInterval(() => {
      const expiry = localStorage.getItem('yorker_session_expiry');
      if (expiry && Date.now() >= parseInt(expiry)) {
        alert('Your session has expired. Please login again.');
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkSession);
  }, []);

  // Session warning (5 minutes before expiry)
  useEffect(() => {
    if (auth.sessionExpiry) {
      const warningTime = auth.sessionExpiry - (5 * 60 * 1000); // 5 minutes before
      const timeUntilWarning = warningTime - Date.now();
      
      if (timeUntilWarning > 0) {
        const warningTimer = setTimeout(() => {
          if (window.confirm('Your session will expire in 5 minutes. Do you want to extend it?')) {
            // Extend session by refreshing
            const user = auth.user;
            if (user) {
              const newExpiry = Date.now() + (user.role === 'Travel Agent' ? 4 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000);
              localStorage.setItem('yorker_session_expiry', newExpiry.toString());
              setAuth(prev => ({ ...prev, sessionExpiry: newExpiry }));
            }
          }
        }, timeUntilWarning);
        
        return () => clearTimeout(warningTimer);
      }
    }
  }, [auth.sessionExpiry, auth.user]);
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const user = demoUsers[credentials.email];
      
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // For agents, require OTP verification
      if (user.role === 'Travel Agent' && !credentials.otp) {
        throw new Error('OTP required for agents');
      }
      
      // For agents, validate OTP
      if (user.role === 'Travel Agent' && credentials.otp && credentials.otp !== '123456') {
        throw new Error('Invalid OTP');
      }

      // Validate demo passwords
      const validPasswords: Record<string, string> = {
        'agent_demo@example.com': 'demo123',
        'admin_demo@example.com': 'admin123',
        'superadmin_demo@example.com': 'super123'
      };

      if (validPasswords[credentials.email] !== credentials.password) {
        throw new Error('Invalid password');
      }

      // Set session (8 hours for admins, 4 hours for agents)
      const sessionDuration = user.role === 'Travel Agent' ? 4 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000;
      const sessionExpiry = Date.now() + sessionDuration;

      // Update user with last login
      const authenticatedUser = {
        ...user,
        lastLogin: new Date().toISOString()
      };

      localStorage.setItem('yorker_user', JSON.stringify(authenticatedUser));
      localStorage.setItem('yorker_session_expiry', sessionExpiry.toString());

      setAuth({
        user: authenticatedUser,
        isAuthenticated: true,
        isLoading: false,
        sessionExpiry
      });

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('yorker_user');
    localStorage.removeItem('yorker_session_expiry');
    setAuth({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const sendOTP = async (email: string): Promise<boolean> => {
    // Simulate OTP sending
    console.log('Sending OTP to:', email);
    // In production, this would call the actual OTP service
    return true;
  };

  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    // Demo OTP is always '123456'
    return otp === '123456';
  };

  return {
    auth,
    login,
    logout,
    sendOTP,
    verifyOTP
  };
};

export { AuthContext };