import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Profile } from '../types';

export function useEventInterest(eventId: string) {
  const { user } = useAuth();
  const [isInterested, setIsInterested] = useState(false);
  const [interestedUsers, setInterestedUsers] = useState<Profile[]>([]);
  const [interestCount, setInterestCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    fetchInterestedUsers();

    if (user) {
      checkInterest();
    }
  }, [eventId, user]);

  const fetchInterestedUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('event_interests')
        .select(`
          id,
          user_id,
          created_at,
          profiles:user_id (
            id,
            full_name,
            avatar_url,
            email,
            role
          )
        `)
        .eq('event_id', eventId);

      if (error) throw error;

      // Extract profiles from the nested structure
      const profiles = (data || [])
        .map((interest: any) => interest.profiles)
        .filter(Boolean) as Profile[];

      setInterestedUsers(profiles);
      setInterestCount(profiles.length);
    } catch (error) {
      console.error('Error fetching interested users:', error);
    }
  };

  const checkInterest = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('event_interests')
        .select('id')
        .eq('user_id', user.id)
        .eq('event_id', eventId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      setIsInterested(!!data);
    } catch (error) {
      console.error('Error checking interest:', error);
    }
  };

  const toggleInterest = async () => {
    if (!user) {
      throw new Error('Debes iniciar sesión para mostrar interés');
    }

    setIsLoading(true);
    try {
      if (isInterested) {
        // Remove interest
        const { error } = await supabase
          .from('event_interests')
          .delete()
          .eq('user_id', user.id)
          .eq('event_id', eventId);

        if (error) throw error;
        setIsInterested(false);
      } else {
        // Add interest
        const { error } = await supabase
          .from('event_interests')
          .insert({
            user_id: user.id,
            event_id: eventId,
          });

        if (error) throw error;
        setIsInterested(true);
      }

      // Refresh the list of interested users
      await fetchInterestedUsers();
    } catch (error) {
      console.error('Error toggling interest:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isInterested,
    interestedUsers,
    interestCount,
    isLoading,
    toggleInterest,
    refreshInterestedUsers: fetchInterestedUsers,
  };
}
