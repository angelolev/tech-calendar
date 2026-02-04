export interface Registry {
  id: string;
  name: string;
  link?: string;
  date: Date;
}

export interface DayCardProps {
  date: Date;
  isCurrentMonth: boolean;
  registries: Registry[];
  onDayClick: (date: Date) => void;
  onRegistryClick?: (registry: Registry) => void;
  animationDelay?: number;
}
