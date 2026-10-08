
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/supabase/error-emitter';
import { SupabasePermissionError } from '@/supabase/errors';
import { useToast } from '@/hooks/use-toast';

export function SupabaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: SupabasePermissionError) => {
      console.error('Supabase Permission Error:', error);
      toast({
        title: 'Permission Denied',
        description: `You don't have permission to ${error.context.operation} ${error.context.path}`,
        variant: 'destructive',
      });
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
