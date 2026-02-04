import { useState, useEffect } from "react";
import { CalendarCheck, Link, X, Edit, Trash2 } from "lucide-react";
import { Registry } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { useEventActions } from "../../hooks/useEventActions";
import { useEventInterest } from "../../hooks/useEventInterest";
import { InterestButton } from "../InterestButton";
import { AvatarStack } from "../AvatarStack";

interface RegistryDetailsModalProps {
  registry: Registry;
  onClose: () => void;
  onEdit?: (registry: Registry) => void;
  onDelete?: (registryId: string) => void;
}

export function RegistryDetailsModal({
  registry,
  onClose,
  onEdit,
  onDelete,
}: RegistryDetailsModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { isAdmin } = useAuth();
  const { deleteEvent, isDeleting } = useEventActions();
  const { interestedUsers } = useEventInterest(registry.id);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este evento?')) return;

    try {
      await deleteEvent(registry.id);
      onDelete?.(registry.id);
      handleClose();
    } catch (error) {
      alert('Error al eliminar el evento. Intenta de nuevo.');
    }
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
        className="w-full max-w-lg relative"
        style={{
          background: "rgba(42, 49, 66, 0.95)",
          borderRadius: "28px",
          padding: "40px",
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
          className="text-3xl font-light mb-2"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "'Source Serif 4', Georgia, serif",
          }}
        >
          {registry.name}
        </h2>

        <div className="flex items-center gap-2 mb-6 pb-6" style={{ borderBottom: "1px solid rgba(67, 78, 120, 0.3)" }}>
          <CalendarCheck size={18} style={{ color: "var(--color-text-secondary)" }} />
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            {registry.date.toLocaleDateString("es", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Interest Button */}
        <div className="mb-6">
          <InterestButton eventId={registry.id} />
        </div>

        {/* Interested Users Section */}
        {interestedUsers.length > 0 && (
          <div className="mb-8 pb-6" style={{ borderBottom: "1px solid rgba(67, 78, 120, 0.3)" }}>
            <h3
              className="text-xs uppercase tracking-wider mb-3"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Usuarios interesados ({interestedUsers.length})
            </h3>
            <div className="flex items-center gap-3">
              <AvatarStack users={interestedUsers} maxVisible={10} size="md" />
            </div>
          </div>
        )}

        <div className="space-y-6 mb-8">
          <h3
            className="text-xs uppercase tracking-wider mb-4"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Detalles del evento
          </h3>

          {registry.link && (
            <div className="group">
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>
                Link al evento
              </p>
              <a
                href={registry.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300"
                style={{
                  color: "var(--color-text-primary)",
                  background: "var(--color-blue-mist)",
                  textDecoration: "none",
                  border: "1px solid rgba(67, 78, 120, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(8px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Link size={18} />
                <span className="truncate text-sm">{registry.link}</span>
              </a>
            </div>
          )}
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex gap-3 pt-4 mb-4 pb-4" style={{ borderTop: "1px solid rgba(67, 78, 120, 0.3)" }}>
            <button
              onClick={() => onEdit?.(registry)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 font-medium"
              style={{
                background: "var(--color-lavender)",
                color: "var(--color-text-primary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "var(--shadow-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Edit size={16} />
              <span>Editar</span>
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 font-medium"
              style={{
                background: "#d94a4a",
                color: "var(--color-text-primary)",
                opacity: isDeleting ? 0.5 : 1,
                cursor: isDeleting ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isDeleting) {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "var(--shadow-glow)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isDeleting) {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              <Trash2 size={16} />
              <span>{isDeleting ? 'Eliminando...' : 'Eliminar'}</span>
            </button>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            onClick={handleClose}
            className="px-8 py-3 rounded-2xl text-sm font-medium transition-all duration-300"
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
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
