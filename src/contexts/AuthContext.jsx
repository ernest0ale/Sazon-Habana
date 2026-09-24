'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/supabase-client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const supabase = getSupabaseBrowserClient();

  // Cargar sesión inicial
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
          const { data: prof } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (mounted) setProfile(prof || null);
        }
      } catch (err) {
        console.error('Error cargando sesión:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_OUT' || !session?.user) {
          setUser(null);
          setProfile(null);
          return;
        }

        setUser(session.user);
        const { data: prof } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (mounted) setProfile(prof || null);
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [supabase]);

  const login = useCallback(async (identificador, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ identificador, password })
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error || 'Error al iniciar sesión.' };

    // Refrescar sesión del cliente tras login server-side
    await supabase.auth.refreshSession();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      const { data: prof } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', session.user.id)
        .single();
      setProfile(prof || null);
    }
    return { ok: true };
  }, [supabase]);

  const register = useCallback(async (payload) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error || 'Error al registrarse.' };

    await supabase.auth.refreshSession();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      const { data: prof } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', session.user.id)
        .single();
      setProfile(prof || null);
    }
    return { ok: true };
  }, [supabase]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {}
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const { data: prof } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', user.id)
      .single();
    setProfile(prof || null);
  }, [user, supabase]);

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    rol: profile?.rol || null,
    login,
    register,
    logout,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext debe usarse dentro de <AuthProvider>.');
  return ctx;
}