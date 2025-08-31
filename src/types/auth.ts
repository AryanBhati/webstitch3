export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Travel Agent' | 'Basic Admin' | 'Super Admin';
  permissions: string[];
  region?: string;
  team?: string;
  isActive: boolean;
  lastLogin?: string;
  otpRequired?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionExpiry?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  otp?: string;
}

export interface OTPVerification {
  email: string;
  otp: string;
}