import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'admin' | 'faculty' | 'counsellor' | 'parent' | 'placement';
  phone?: string;
  institutionName?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role?: User['role']) => Promise<boolean>;
  signup: (details: Omit<User, 'id'>) => Promise<boolean>;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: () => {
    try {
      const storedUser = localStorage.getItem('adhoc_user');
      const storedToken = localStorage.getItem('adhoc_token');
      if (storedUser && storedToken) {
        set({
          user: JSON.parse(storedUser),
          token: storedToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to parse auth from localStorage', error);
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email: string, role?: User['role']) => {
    set({ isLoading: true });
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock login setup - derive name from email prefix
    const derivedName = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ');
    const fullName = derivedName
      ? derivedName.charAt(0).toUpperCase() + derivedName.slice(1)
      : 'Akshad Mishra';
    
    // Default to student if not provided
    const userRole = role || 'student';
    
    const user: User = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      email,
      fullName,
      role: userRole,
      phone: '+91 99999 88888',
      institutionName: 'Geethanjali College of Engineering and Technology (GCET)',
    };

    const token = 'mock-jwt-token-xyz';

    localStorage.setItem('adhoc_user', JSON.stringify(user));
    localStorage.setItem('adhoc_token', token);

    set({ user, token, isAuthenticated: true, isLoading: false });
    return true;
  },

  signup: async (details: Omit<User, 'id'>) => {
    set({ isLoading: true });
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const user: User = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      ...details,
    };

    const token = 'mock-jwt-token-xyz';

    localStorage.setItem('adhoc_user', JSON.stringify(user));
    localStorage.setItem('adhoc_token', token);

    set({ user, token, isAuthenticated: true, isLoading: false });
    return true;
  },

  logout: () => {
    localStorage.removeItem('adhoc_user');
    localStorage.removeItem('adhoc_token');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },
}));
