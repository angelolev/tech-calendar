import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayCard, RegistryModal, RegistryDetailsModal } from "./components";
import { Registry } from "./types";
import { supabase } from "./lib/supabase";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [registries, setRegistries] = useState<Registry[]>([]);
  const [selectedRegistry, setSelectedRegistry] = useState<Registry | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const { data: events, error } = await supabase
          .from("events")
          .select("*");

        if (error) {
          console.error("Error fetching events:", error);
          return;
        }

        if (events) {
          // Convert Supabase date strings to Date objects
          const formattedEvents: Registry[] = events.map((event) => ({
            id: event.id,
            name: event.name,
            link: event.link,
            whatsapp: event.whatsapp,
            date: new Date(event.date),
          }));

          setRegistries(formattedEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Save a new registry to Supabase
  const handleSaveRegistry = async (newRegistry: Omit<Registry, "id">) => {
    try {
      const { data, error } = await supabase
        .from("events")
        .insert([
          {
            name: newRegistry.name,
            link: newRegistry.link,
            whatsapp: newRegistry.whatsapp,
            date: newRegistry.date.toISOString().split("T")[0],
          },
        ])
        .select();

      if (error) {
        console.error("Error saving event:", error);
        return;
      }

      if (data && data[0]) {
        setRegistries([
          ...registries,
          {
            id: data[0].id,
            name: data[0].name,
            link: data[0].link,
            whatsapp: data[0].whatsapp,
            date: new Date(data[0].date),
          },
        ]);
      }
    } catch (error) {
      console.error("Error saving event:", error);
    }
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
    setSelectedDate(date);
  };

  const handleRegistryClick = (registry: Registry) => {
    setSelectedRegistry(registry);
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-100 text-center my-8">
          Calendario de Eventos Tech por Coding Latam
        </h1>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-gray-100">Calendar</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-700 rounded-full text-gray-300"
              >
                <ChevronLeft size={24} />
              </button>
              <h2 className="text-xl font-medium text-gray-200">
                {currentDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-700 rounded-full text-gray-300"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-4 mb-4">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="text-center font-medium text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-gray-400">
              Cargando eventos...
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-4">
              {days.map((date) => (
                <DayCard
                  key={date.toISOString()}
                  date={date}
                  isCurrentMonth={date.getMonth() === currentDate.getMonth()}
                  registries={registries.filter(
                    (registry) =>
                      registry.date.toDateString() === date.toDateString()
                  )}
                  onDayClick={handleDayClick}
                  onRegistryClick={handleRegistryClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedDate && (
        <RegistryModal
          selectedDate={selectedDate}
          onClose={() => setSelectedDate(null)}
          onSave={handleSaveRegistry}
        />
      )}

      {selectedRegistry && (
        <RegistryDetailsModal
          registry={selectedRegistry}
          onClose={() => setSelectedRegistry(null)}
        />
      )}
    </div>
  );
}

export default App;
