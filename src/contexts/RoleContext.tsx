import React, { createContext, useContext } from 'react';
import { useAuth, UserRole } from './AuthContext';

interface RoleContextType {
  currentRole: UserRole | null;
  getRoleColor: (role?: UserRole) => string;
  getRolePath: (role?: UserRole) => string;
  getRoleTheme: (role?: UserRole) => string;
}

const RoleContext = createContext<RoleContextType | null>(null);

const roleConfig = {
  citizen: {
    color: 'citizen',
    path: '/resources',
    theme: 'theme-citizen'
  },
  asha: {
    color: 'asha',
    path: '/asha',
    theme: 'theme-asha'
  },
  coordinator: {
    color: 'coordinator',
    path: '/coordinator',
    theme: 'theme-coordinator'
  },
  doctor: {
    color: 'doctor',
    path: '/doctor',
    theme: 'theme-doctor'
  }
};

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const getRoleColor = (role?: UserRole) => {
    const targetRole = role || user?.role;
    return targetRole ? roleConfig[targetRole].color : 'primary';
  };

  const getRolePath = (role?: UserRole) => {
    const targetRole = role || user?.role;
    return targetRole ? roleConfig[targetRole].path : '/';
  };

  const getRoleTheme = (role?: UserRole) => {
    const targetRole = role || user?.role;
    return targetRole ? roleConfig[targetRole].theme : '';
  };

  return (
    <RoleContext.Provider value={{
      currentRole: user?.role || null,
      getRoleColor,
      getRolePath,
      getRoleTheme
    }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
