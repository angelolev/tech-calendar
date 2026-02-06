import { LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function AuthButton() {
  const { user, profile, isLoading, signInWithGoogle, signOut } = useAuth();

  if (isLoading) {
    return (
      <button
        className="px-4 py-2 rounded-2xl cursor-pointer"
        disabled
        style={{
          background: 'var(--color-lavender-soft)',
          color: 'var(--color-text-primary)',
          opacity: 0.5
        }}
      >
        Cargando...
      </button>
    );
  }

  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        className="flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300 cursor-pointer"
        style={{
          background: 'var(--color-lavender)',
          color: 'var(--color-text-primary)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <LogIn size={18} />
        <span>Iniciar sesión</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.full_name || 'User'}
            className="w-8 h-8 rounded-full object-cover"
            style={{ border: '2px solid var(--color-lavender)' }}
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'var(--color-lavender)' }}
          >
            <User size={16} style={{ color: 'var(--color-text-primary)' }} />
          </div>
        )}
        <div className="text-sm">
          <p style={{ color: 'var(--color-text-primary)' }}>
            {profile?.full_name || 'Usuario'}
          </p>
          {profile?.role === 'admin' && (
            <p
              className="text-xs uppercase tracking-wider"
              style={{
                color: 'var(--color-lavender)',
                fontSize: '0.65rem',
                fontWeight: 600
              }}
            >
              Admin
            </p>
          )}
        </div>
      </div>
      <button
        onClick={signOut}
        className="p-2 rounded-full transition-all duration-300 cursor-pointer"
        style={{
          background: 'var(--color-lavender-soft)',
          color: 'var(--color-text-primary)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.background = 'var(--color-lavender)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.background = 'var(--color-lavender-soft)';
        }}
        title="Cerrar sesión"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
}
