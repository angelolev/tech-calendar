import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Registry } from "../../types";
import { DatePicker, formatDateToISOLocal } from "../DatePicker";

// Helper to parse ISO date in local timezone
const parseISODateLocal = (isoString: string): Date => {
  const [year, month, day] = isoString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

interface RegistryModalProps {
  selectedDate: Date;
  onClose: () => void;
  onSave: (registry: Omit<Registry, "id">) => void;
}

export function RegistryModal({
  selectedDate,
  onClose,
  onSave,
}: RegistryModalProps) {
  const [eventName, setEventName] = useState("");
  const [eventLink, setEventLink] = useState("");
  const [eventDate, setEventDate] = useState(
    formatDateToISOLocal(selectedDate)
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      name: eventName,
      link: eventLink || undefined,
      date: parseISODateLocal(eventDate),
    });
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(8px)",
        opacity: isVisible ? 1 : 0,
        transition: "all 0.3s ease-out",
      }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md relative"
        style={{
          background: "rgba(42, 49, 66, 0.95)",
          borderRadius: "28px",
          padding: "32px",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid rgba(67, 78, 120, 0.4)",
          transform: isVisible ? "scale(1) translateY(0)" : "scale(0.9) translateY(20px)",
          transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute right-6 top-6 p-2 rounded-full transition-all duration-300"
          style={{
            color: "var(--color-text-primary)",
            background: "var(--color-lavender-soft)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "rotate(90deg) scale(1.1)";
            e.currentTarget.style.background = "var(--color-lavender)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "rotate(0deg) scale(1)";
            e.currentTarget.style.background = "var(--color-lavender-soft)";
          }}
        >
          <X size={18} />
        </button>

        <h2
          className="text-2xl font-light mb-6"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "'Source Serif 4', Georgia, serif",
          }}
        >
          Agregar Evento
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="eventName"
              className="block text-xs uppercase tracking-wider mb-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Nombre del evento
            </label>
            <input
              type="text"
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl transition-all duration-300 focus:outline-none"
              style={{
                background: "var(--color-lavender-soft)",
                color: "var(--color-text-primary)",
                border: "1px solid rgba(67, 78, 120, 0.3)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = "1px solid var(--color-text-secondary)";
                e.currentTarget.style.boxShadow = "var(--shadow-glow)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = "1px solid rgba(139, 126, 158, 0.2)";
                e.currentTarget.style.boxShadow = "none";
              }}
              required
            />
          </div>

          <div>
            <label
              htmlFor="eventLink"
              className="block text-xs uppercase tracking-wider mb-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Link del evento (opcional)
            </label>
            <input
              type="url"
              id="eventLink"
              value={eventLink}
              onChange={(e) => setEventLink(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl transition-all duration-300 focus:outline-none"
              style={{
                background: "var(--color-lavender-soft)",
                color: "var(--color-text-primary)",
                border: "1px solid rgba(67, 78, 120, 0.3)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = "1px solid var(--color-text-secondary)";
                e.currentTarget.style.boxShadow = "var(--shadow-glow)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = "1px solid rgba(139, 126, 158, 0.2)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <DatePicker
            value={eventDate}
            onChange={setEventDate}
            label="Fecha del evento"
            required
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300"
              style={{
                color: "var(--color-text-secondary)",
                background: "var(--color-lavender-soft)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-lavender)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-lavender-soft)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300"
              style={{
                color: "var(--color-text-primary)",
                background: "linear-gradient(135deg, #434E78 0%, #5a6aa8 100%)",
                boxShadow: "var(--shadow-md)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "var(--shadow-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
              }}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
