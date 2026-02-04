import { useState } from "react";
import { Calendar } from "lucide-react";
import { DatePickerProps } from "./types";
import { CalendarPopover } from "./CalendarPopover";

// Helper function to parse ISO date strings in local timezone
const parseISODateLocal = (isoString: string): Date => {
  if (!isoString) return new Date();
  const [year, month, day] = isoString.split("-").map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed in JavaScript
};

// Helper function to format Date to ISO string in local timezone (without UTC conversion)
export const formatDateToISOLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function DatePicker({
  value,
  onChange,
  label,
  required = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = parseISODateLocal(dateString);
    return date.toLocaleString("es", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleSelectDate = (date: Date) => {
    const isoString = formatDateToISOLocal(date);
    onChange(isoString);
    setIsOpen(false);
  };

  return (
    <div>
      {label && (
        <label
          className="block text-xs uppercase tracking-wider mb-2"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {/* Hidden input for form validation */}
        <input
          type="hidden"
          value={value}
          required={required}
        />

        {/* Visible input for display only */}
        <input
          type="text"
          value={formatDate(value)}
          onClick={() => setIsOpen(true)}
          readOnly
          className="w-full px-4 py-3 pr-12 rounded-2xl transition-all duration-300 focus:outline-none cursor-pointer"
          style={{
            background: "var(--color-lavender-soft)",
            color: "var(--color-text-primary)",
            border: "1px solid rgba(67, 78, 120, 0.3)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.border =
              "1px solid var(--color-text-secondary)";
            e.currentTarget.style.boxShadow = "var(--shadow-glow)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = "1px solid rgba(67, 78, 120, 0.3)";
            e.currentTarget.style.boxShadow = "none";
          }}
          placeholder="Seleccionar fecha"
        />

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-300"
          style={{
            color: "var(--color-text-secondary)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
            e.currentTarget.style.color = "var(--color-lavender)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
            e.currentTarget.style.color = "var(--color-text-secondary)";
          }}
        >
          <Calendar size={20} />
        </button>
      </div>

      {isOpen && (
        <CalendarPopover
          selectedDate={value ? parseISODateLocal(value) : new Date()}
          onSelectDate={handleSelectDate}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
