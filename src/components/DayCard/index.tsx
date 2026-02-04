import { useState } from "react";
import { DayCardProps, Registry } from "../../types";
import { AvatarStack } from "../AvatarStack";

// Array of soft dark color combinations based on #434E78
const colorCombinations = [
  { bg: "#5a6aa8", text: "#dce3ff" }, // blue lavender
  { bg: "#78546d", text: "#f5d4ed" }, // mauve rose
  { bg: "#3d4f6f", text: "#c5d9f5" }, // deep blue
  { bg: "#4d6858", text: "#d4f0dc" }, // slate sage
  { bg: "#785d52", text: "#ffdcc8" }, // warm earth
  { bg: "#5d4e78", text: "#e8dcf5" }, // twilight
  { bg: "#6b6153", text: "#f5ead4" }, // dusty cream
  { bg: "#4a6b6b", text: "#d4f5f2" }, // teal mist
];

const getRegistryColor = (id: string) => {
  const charCode = id.charCodeAt(0);
  const index = charCode % colorCombinations.length;
  return colorCombinations[index];
};

export function DayCard({
  date,
  isCurrentMonth,
  registries,
  onDayClick,
  onRegistryClick,
  animationDelay = 0,
}: DayCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleRegistryClick = (e: React.MouseEvent, registry: Registry) => {
    e.stopPropagation();
    onRegistryClick?.(registry);
  };

  const isToday = new Date().toDateString() === date.toDateString();

  return (
    <button
      onClick={() => onDayClick(date)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-col cursor-pointer group"
      style={{
        height: "110px",
        padding: "12px",
        borderRadius: "20px",
        background: isCurrentMonth
          ? "var(--color-bg-card)"
          : "rgba(26, 21, 32, 0.4)",
        border: isToday
          ? "2px solid #5a6aa8"
          : "1px solid rgba(67, 78, 120, 0.3)",
        boxShadow: isHovered ? "var(--shadow-md)" : "var(--shadow-sm)",
        transform: isHovered ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        opacity: 0,
        animation: "fadeInUp 0.5s ease-out forwards",
        animationDelay: `${animationDelay}s`,
      }}
    >
      {isToday && (
        <div
          className="absolute inset-0 rounded-[20px] opacity-20"
          style={{
            background: "linear-gradient(135deg, var(--color-lavender) 0%, var(--color-rose) 100%)",
            pointerEvents: "none",
          }}
        />
      )}

      <span
        className="text-sm font-medium mb-2 relative z-10"
        style={{
          color: isCurrentMonth ? "var(--color-text-primary)" : "var(--color-text-muted)",
          fontWeight: isToday ? 600 : 400,
        }}
      >
        {date.getDate()}
      </span>

      <div className="flex-1 overflow-y-auto space-y-1.5 relative z-10">
        {registries.map((registry, idx) => {
          const colors = getRegistryColor(registry.id.toString());
          return (
            <div
              key={registry.id}
              className="text-xs px-2 py-1.5 rounded-xl text-left cursor-pointer transition-all duration-300"
              style={{
                background: colors.bg,
                color: colors.text,
                fontWeight: 500,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                transform: "scale(1)",
                opacity: 0,
                animation: "scaleIn 0.3s ease-out forwards",
                animationDelay: `${animationDelay + idx * 0.05}s`,
              }}
              onClick={(e) => handleRegistryClick(e, registry)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.05)";
              }}
            >
              <div className="truncate mb-1">{registry.name}</div>
              {registry.interested_users && registry.interested_users.length > 0 && (
                <div className="mt-1">
                  <AvatarStack users={registry.interested_users} maxVisible={2} size="sm" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </button>
  );
}
