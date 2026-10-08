
'use client';

import { useEffect, useState } from 'react';

export function useUser() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check sessionStorage for authenticated state
    const authenticated = sessionStorage.getItem('authenticated');
    const userRole = sessionStorage.getItem('userRole');
    const studentId = sessionStorage.getItem('studentId');

    if (authenticated === 'true' && userRole) {
      setUser({
        role: userRole,
        studentId: studentId || undefined,
      });
    }

    setLoading(false);
  }, []);

  return { user, loading };
}
