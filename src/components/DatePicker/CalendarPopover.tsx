import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarPopoverProps } from "./types";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarPopover({
  selectedDate,
  onSelectDate,
  onClose,
}: CalendarPopoverProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const [isVisible, setIsVisible] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: Date[] = [];
    const startPadding = firstDay.getDay();

    // Add padding days from previous month
    for (let i = startPadding - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    // Add padding days from next month
    const endPadding = 42 - days.length; // 6 rows × 7 days = 42
    for (let i = 1; i <= endPadding; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleDayClick = (date: Date) => {
    onSelectDate(date);
    handleClose();
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-[60]"
      style={{
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(8px)",
        opacity: isVisible ? 1 : 0,
        transition: "all 0.3s ease-out",
      }}
    >
      <div
        ref={popoverRef}
        className="w-full max-w-[380px]"
        style={{
          background: "rgba(42, 49, 66, 0.95)",
          borderRadius: "28px",
          padding: "24px",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid rgba(67, 78, 120, 0.4)",
          transform: isVisible
            ? "scale(1) translateY(0)"
            : "scale(0.9) translateY(20px)",
          transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Month Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 rounded-full transition-all duration-300"
            style={{
              color: "var(--color-text-primary)",
              background: "var(--color-lavender-soft)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1) rotate(-10deg)";
              e.currentTarget.style.boxShadow = "var(--shadow-glow)";
              e.currentTarget.style.background = "var(--color-lavender)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1) rotate(0deg)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.background = "var(--color-lavender-soft)";
            }}
          >
            <ChevronLeft size={18} />
          </button>

          <h3
            className="text-lg font-light tracking-wide"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "'Source Serif 4', Georgia, serif",
            }}
          >
            {currentDate.toLocaleString("es", {
              month: "long",
              year: "numeric",
            })}
          </h3>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 rounded-full transition-all duration-300"
            style={{
              color: "var(--color-text-primary)",
              background: "var(--color-lavender-soft)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1) rotate(10deg)";
              e.currentTarget.style.boxShadow = "var(--shadow-glow)";
              e.currentTarget.style.background = "var(--color-lavender)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1) rotate(0deg)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.background = "var(--color-lavender-soft)";
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day Labels */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="text-center font-medium text-xs uppercase tracking-widest py-2"
              style={{
                color: "var(--color-text-muted)",
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, idx) => {
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isSelected =
              date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === today.toDateString();

            return (
              <button
                type="button"
                key={date.toISOString()}
                onClick={() => handleDayClick(date)}
                className="relative flex items-center justify-center cursor-pointer"
                style={{
                  height: "42px",
                  width: "42px",
                  borderRadius: "16px",
                  background: isSelected
                    ? "var(--color-lavender)"
                    : isCurrentMonth
                    ? "var(--color-bg-card)"
                    : "rgba(26, 21, 32, 0.4)",
                  border: isToday
                    ? "2px solid #5a6aa8"
                    : "1px solid rgba(67, 78, 120, 0.3)",
                  color: isSelected
                    ? "#ffffff"
                    : isCurrentMonth
                    ? "var(--color-text-primary)"
                    : "var(--color-text-muted)",
                  fontWeight: isToday ? 600 : 400,
                  fontSize: "0.875rem",
                  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  opacity: 0,
                  animation: "fadeInUp 0.5s ease-out forwards",
                  animationDelay: `${idx * 0.02}s`,
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                    e.currentTarget.style.background =
                      "var(--color-bg-card-hover)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.background = isCurrentMonth
                      ? "var(--color-bg-card)"
                      : "rgba(26, 21, 32, 0.4)";
                  }
                }}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
