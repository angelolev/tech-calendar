import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Registry } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function useEventActions() {
  const { user, isAdmin } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const deleteEvent = async (eventId: string) => {
    if (!isAdmin) {
      throw new Error('Solo administradores pueden eliminar eventos');
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  const updateEvent = async (
    eventId: string,
    updates: Partial<Omit<Registry, 'id' | 'created_at'>>
  ) => {
    if (!isAdmin) {
      throw new Error('Solo administradores pueden actualizar eventos');
    }

    setIsUpdating(true);
    try {
      // Convert Date to ISO string if present
      const updateData: any = { ...updates };
      if (updateData.date instanceof Date) {
        const year = updateData.date.getFullYear();
        const month = String(updateData.date.getMonth() + 1).padStart(2, '0');
        const day = String(updateData.date.getDate()).padStart(2, '0');
        updateData.date = `${year}-${month}-${day}`;
      }

      const { data, error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const createEvent = async (newEvent: Omit<Registry, 'id'>) => {
    if (!isAdmin) {
      throw new Error('Solo administradores pueden crear eventos');
    }

    if (!user) {
      throw new Error('Debes estar autenticado para crear eventos');
    }

    setIsCreating(true);
    try {
      // Convert Date to ISO string
      const year = newEvent.date.getFullYear();
      const month = String(newEvent.date.getMonth() + 1).padStart(2, '0');
      const day = String(newEvent.date.getDate()).padStart(2, '0');
      const dateISO = `${year}-${month}-${day}`;

      const { data, error } = await supabase
        .from('events')
        .insert([{
          name: newEvent.name,
          link: newEvent.link || undefined,
          whatsapp: newEvent.whatsapp || undefined,
          date: dateISO,
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    deleteEvent,
    updateEvent,
    createEvent,
    isDeleting,
    isUpdating,
    isCreating,
  };
}
