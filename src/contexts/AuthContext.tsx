import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'citizen' | 'asha' | 'coordinator' | 'doctor';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  availableRoles: UserRole[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (name: string, email: string, phone: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('healthhub_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('healthhub_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo user for testing with multiple roles
      const demoUser: User = {
        id: `demo-${role}`,
        name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        email,
        phone: '+91 9876543210',
        role,
        availableRoles: ['citizen', 'asha', 'coordinator', 'doctor'] // Demo user has all roles
      };
      
      setUser(demoUser);
      localStorage.setItem('healthhub_user', JSON.stringify(demoUser));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${demoUser.name}!`,
      });
      
      setLoading(false);
      return true;
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }
  };

  const signup = async (name: string, email: string, phone: string, password: string, role: UserRole): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        phone,
        role,
        availableRoles: [role] // New users start with single role
      };
      
      setUser(newUser);
      localStorage.setItem('healthhub_user', JSON.stringify(newUser));
      
      toast({
        title: "Account Created",
        description: `Welcome to HealthHub, ${name}!`,
      });
      
      setLoading(false);
      return true;
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }
  };

  const switchRole = (newRole: UserRole) => {
    if (user && user.availableRoles.includes(newRole)) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem('healthhub_user', JSON.stringify(updatedUser));
      
      toast({
        title: "Role Switched",
        description: `Switched to ${newRole.charAt(0).toUpperCase() + newRole.slice(1)} role`,
      });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('healthhub_user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      switchRole,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};