'use client';

import { ReactNode, useEffect, useState } from 'react';
import { SupabaseProvider } from './provider';

export const createMockSupabase = () => {
  const queryBuilder = (table: string) => {
    let operation = 'select';
    let data: any = null;
    let filters: Array<{ field: string; operator: string; value: any }> = [];
    let isSingle = false;

    const builder: any = {
      select(fields = '*') {
        operation = 'select';
        return builder;
      },
      insert(payload: any) {
        operation = 'insert';
        data = payload;
        return builder;
      },
      update(payload: any) {
        operation = 'update';
        data = payload;
        return builder;
      },
      delete() {
        operation = 'delete';
        return builder;
      },
      eq(field: string, value: any) {
        filters.push({ field, operator: 'eq', value });
        return builder;
      },
      single() {
        isSingle = true;
        return builder;
      },
      then(resolve: any, reject: any) {
        fetch('/api/supabase-mock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ table, operation, data, filters, isSingle }),
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.error) {
              resolve({ data: null, error: result.error });
            } else {
              if (operation !== 'select') {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('db-updated'));
                }
              }
              resolve({ data: result.data, error: null });
            }
          })
          .catch((err) => resolve({ data: null, error: err }));
      },
    };

    return builder;
  };

  return {
    from: queryBuilder,
    channel: () => ({ 
      on: () => ({ 
        subscribe: () => ({}) 
      }) 
    }),
    removeChannel: () => {},
  };
};

type SupabaseClientProviderProps = {
  children: ReactNode;
};

export function SupabaseClientProvider({
  children,
}: SupabaseClientProviderProps) {
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    setSupabase(createMockSupabase());
  }, []);

  return (
    <SupabaseProvider supabase={supabase}>
      {children}
    </SupabaseProvider>
  );
}
