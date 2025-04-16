import React, { useState } from "react";
import { X } from "lucide-react";
import { Registry } from "../../types";

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
    selectedDate.toISOString().split("T")[0]
  );
  const [eventGroupLink, setEventGroupLink] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      name: eventName,
      link: eventLink,
      whatsapp: eventGroupLink,
      date: new Date(eventDate),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative border border-gray-700 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-200 cursor-pointer"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-200">
          Agregar Evento
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="eventName"
              className="block text-sm font-medium text-gray-300"
            >
              Nombre del evento
            </label>
            <input
              type="text"
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="py-1 px-2 mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="eventLink"
              className="block text-sm font-medium text-gray-300"
            >
              Link del evento
            </label>
            <input
              type="url"
              id="eventLink"
              value={eventLink}
              onChange={(e) => setEventLink(e.target.value)}
              className="py-1 px-2 mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="eventDate"
              className="block text-sm font-medium text-gray-300"
            >
              Fecha del evento
            </label>
            <input
              type="date"
              id="eventDate"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="py-1 px-2 mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="eventGroupLink"
              className="block text-sm font-medium text-gray-300"
            >
              Link del grupo de whatsapp
            </label>
            <input
              type="url"
              id="eventGroupLink"
              value={eventGroupLink}
              onChange={(e) => setEventGroupLink(e.target.value)}
              className="py-1 px-2 mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-purple-700 rounded-md hover:bg-purple-800"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
