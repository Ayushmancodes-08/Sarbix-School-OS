'use client';

import {
  createContext,
  ReactNode,
  useContext,
} from 'react';

type SupabaseContextType = {
  supabase: any;
};

const SupabaseContext = createContext<SupabaseContextType>({
  supabase: null,
});

type SupabaseProviderProps = {
  children: ReactNode;
  supabase: any;
};

export function SupabaseProvider({
  children,
  supabase,
}: SupabaseProviderProps) {
  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const { supabase } = useContext(SupabaseContext);
  return supabase;
}
