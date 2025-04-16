import { CalendarCheck, Link, MessageCircleMore, X } from "lucide-react";
import { Registry } from "../../types";

interface RegistryDetailsModalProps {
  registry: Registry;
  onClose: () => void;
}

export function RegistryDetailsModal({
  registry,
  onClose,
}: RegistryDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative border border-gray-700 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-200 cursor-pointer"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-200">
          {registry.name.toUpperCase()}
        </h2>
        <div className="mb-4">
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <CalendarCheck size={16} /> Fecha del evento:{" "}
            {registry.date.toLocaleDateString()}
          </p>
        </div>
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-2">
            Detalles del evento
          </h3>
          <div className="space-y-2">
            {registry.link && (
              <p className="text-gray-200">
                <span className="text-gray-400">Link al evento:</span>{" "}
                <a
                  href={registry.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline flex items-center gap-2"
                >
                  <Link size={16} /> {registry.link}
                </a>
              </p>
            )}
            {registry.whatsapp && (
              <p className="text-gray-200">
                <span className="text-gray-400">Grupo de whatsapp:</span>{" "}
                <a
                  href={registry.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline flex items-center gap-2"
                >
                  <MessageCircleMore size={16} /> {registry.whatsapp}
                </a>
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-purple-700 rounded-md hover:bg-purple-800"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
