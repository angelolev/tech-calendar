import { Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEventInterest } from '../../hooks/useEventInterest';

interface InterestButtonProps {
  eventId: string;
}

export function InterestButton({ eventId }: InterestButtonProps) {
  const { user } = useAuth();
  const { isInterested, isLoading, toggleInterest } = useEventInterest(eventId);

  const handleClick = async () => {
    if (!user) {
      alert('Debes iniciar sesión para mostrar interés en este evento');
      return;
    }

    try {
      await toggleInterest();
    } catch (error) {
      alert('Error al actualizar interés. Intenta de nuevo.');
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!user || isLoading}
      className="flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 font-medium"
      style={{
        background: isInterested ? 'var(--color-lavender)' : 'var(--color-lavender-soft)',
        color: 'var(--color-text-primary)',
        opacity: !user || isLoading ? 0.5 : 1,
        cursor: !user || isLoading ? 'not-allowed' : 'pointer',
        border: isInterested ? '2px solid var(--color-lavender)' : '2px solid transparent',
      }}
      onMouseEnter={(e) => {
        if (user && !isLoading) {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
        }
      }}
      onMouseLeave={(e) => {
        if (user && !isLoading) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
      title={!user ? 'Inicia sesión para mostrar interés' : ''}
    >
      <Heart
        size={18}
        fill={isInterested ? 'currentColor' : 'none'}
      />
      <span>
        {isLoading
          ? 'Cargando...'
          : isInterested
          ? 'Me interesa'
          : 'Me interesa'}
      </span>
    </button>
  );
}
