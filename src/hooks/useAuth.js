'use client';

import { useAuthContext } from '@/contexts/AuthContext';

export function useAuth() {
  const {
    user, profile, loading, isAuthenticated, rol,
    login, register, logout, refreshProfile
  } = useAuthContext();

  return {
    user,
    profile,
    loading,
    isAuthenticated,
    rol,
    isAdmin: rol === 'admin',
    isGestor: rol === 'gestor',
    isCasual: rol === 'casual',
    login,
    register,
    logout,
    refreshProfile
  };
}