import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SellerStatus {
  loading: boolean;
  isSeller: boolean;
  hasApplication: boolean;
  applicationStatus: 'pending' | 'approved' | 'rejected' | 'requested_info' | null;
  storeId: string | null;
  hasStore: boolean;
}

export function useSellerStatus(): SellerStatus {
  const { user, hasRole } = useAuth();
  const [status, setStatus] = useState<SellerStatus>({
    loading: true,
    isSeller: false,
    hasApplication: false,
    applicationStatus: null,
    storeId: null,
    hasStore: false,
  });

  useEffect(() => {
    if (!user) {
      setStatus({
        loading: false,
        isSeller: false,
        hasApplication: false,
        applicationStatus: null,
        storeId: null,
        hasStore: false,
      });
      return;
    }

    checkSellerStatus();
  }, [user]);

  const checkSellerStatus = async () => {
    try {
      // Check if user has seller role
      const isSeller = hasRole('seller');

      // Check for seller application
      const { data: applications } = await supabase
        .from('seller_applications')
        .select('status')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1);

      // Check for store
      const { data: stores } = await supabase
        .from('stores')
        .select('id')
        .eq('user_id', user?.id)
        .limit(1);

      setStatus({
        loading: false,
        isSeller,
        hasApplication: (applications?.length || 0) > 0,
        applicationStatus: applications?.[0]?.status || null,
        storeId: stores?.[0]?.id || null,
        hasStore: (stores?.length || 0) > 0,
      });
    } catch (error) {
      console.error('Error checking seller status:', error);
      setStatus({
        loading: false,
        isSeller: false,
        hasApplication: false,
        applicationStatus: null,
        storeId: null,
        hasStore: false,
      });
    }
  };

  return status;
}
