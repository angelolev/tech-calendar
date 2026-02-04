import { User } from 'lucide-react';
import { Profile } from '../../types';

interface AvatarStackProps {
  users: Profile[];
  maxVisible?: number;
  size?: 'sm' | 'md';
}

export function AvatarStack({ users, maxVisible = 3, size = 'md' }: AvatarStackProps) {
  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = users.length - maxVisible;

  const sizeClasses = {
    sm: { width: 24, height: 24, fontSize: 10 },
    md: { width: 32, height: 32, fontSize: 12 },
  };

  const { width, height, fontSize } = sizeClasses[size];

  if (users.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center">
      {visibleUsers.map((user, index) => (
        <div
          key={user.id}
          className="relative"
          style={{
            marginLeft: index > 0 ? '-8px' : '0',
            zIndex: visibleUsers.length - index,
          }}
          title={user.full_name || user.email}
        >
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name || 'User'}
              className="rounded-full object-cover"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                border: '2px solid var(--color-background-primary)',
              }}
            />
          ) : (
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                background: 'var(--color-lavender)',
                border: '2px solid var(--color-background-primary)',
              }}
            >
              <User
                size={fontSize}
                style={{ color: 'var(--color-text-primary)' }}
              />
            </div>
          )}
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className="rounded-full flex items-center justify-center font-medium"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            marginLeft: '-8px',
            background: 'var(--color-sage)',
            border: '2px solid var(--color-background-primary)',
            color: 'var(--color-text-primary)',
            fontSize: `${fontSize}px`,
            zIndex: 0,
          }}
          title={`+${remainingCount} más`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
