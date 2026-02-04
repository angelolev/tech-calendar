export interface Registry {
  id: string;
  name: string;
  link?: string;
  whatsapp?: string;
  date: Date;
  created_by?: string;
  created_at?: Date;
  updated_at?: Date;
  interested_users?: Profile[];
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
}

export interface EventInterest {
  id: string;
  user_id: string;
  event_id: string;
  created_at: Date;
  profiles?: Profile;
}

export interface DayCardProps {
  date: Date;
  isCurrentMonth: boolean;
  registries: Registry[];
  onDayClick: (date: Date) => void;
  onRegistryClick?: (registry: Registry) => void;
  animationDelay?: number;
}
