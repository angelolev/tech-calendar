import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayCard, RegistryModal, RegistryDetailsModal } from "./components";
import { Registry } from "./types";
import { supabase } from "./lib/supabase";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Helper to parse ISO date strings in local timezone (avoid UTC shift)
const parseISODateLocal = (isoString: string): Date => {
  const [year, month, day] = isoString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

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
          // Convert Supabase date strings to Date objects (local timezone)
          const formattedEvents: Registry[] = events.map((event) => ({
            id: event.id,
            name: event.name,
            link: event.link,
            date: parseISODateLocal(event.date),
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
      // Convert date to ISO string in local timezone (avoid UTC shift)
      const year = newRegistry.date.getFullYear();
      const month = String(newRegistry.date.getMonth() + 1).padStart(2, "0");
      const day = String(newRegistry.date.getDate()).padStart(2, "0");
      const dateISO = `${year}-${month}-${day}`;

      const { data, error } = await supabase
        .from("events")
        .insert([
          {
            name: newRegistry.name,
            link: newRegistry.link || undefined,
            date: dateISO,
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
            date: parseISODateLocal(data[0].date),
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
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-light mb-3 tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            Calendario de Eventos Tech
          </h1>
          <p className="text-sm tracking-wide uppercase" style={{ color: 'var(--color-text-secondary)', letterSpacing: '0.15em' }}>
            Coding Latam
          </p>
        </div>

        <div
          className="rounded-[32px] p-8 md:p-12 animate-scale-in backdrop-blur-sm"
          style={{
            background: 'rgba(42, 49, 66, 0.7)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid rgba(67, 78, 120, 0.3)'
          }}
        >
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-light" style={{ color: 'var(--color-text-primary)' }}>
              Calendar
            </h2>
            <div className="flex items-center gap-6">
              <button
                onClick={handlePrevMonth}
                className="p-3 rounded-full transition-all duration-300"
                style={{
                  color: 'var(--color-text-primary)',
                  background: 'var(--color-lavender-soft)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) rotate(-10deg)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                  e.currentTarget.style.background = 'var(--color-lavender)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.background = 'var(--color-lavender-soft)';
                }}
              >
                <ChevronLeft size={20} />
              </button>
              <h3 className="text-xl font-light tracking-wide min-w-[200px] text-center" style={{ color: 'var(--color-text-primary)' }}>
                {currentDate.toLocaleString("es", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <button
                onClick={handleNextMonth}
                className="p-3 rounded-full transition-all duration-300"
                style={{
                  color: 'var(--color-text-primary)',
                  background: 'var(--color-lavender-soft)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) rotate(10deg)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                  e.currentTarget.style.background = 'var(--color-lavender)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.background = 'var(--color-lavender-soft)';
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-6 mb-6">
            {DAYS_OF_WEEK.map((day, idx) => (
              <div
                key={day}
                className="text-center font-medium text-xs uppercase tracking-widest py-2"
                style={{
                  color: 'var(--color-text-muted)',
                  animationDelay: `${idx * 0.05}s`
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center py-20" style={{ color: 'var(--color-text-secondary)' }}>
              <div className="inline-block w-12 h-12 border-4 rounded-full animate-spin"
                style={{
                  borderColor: 'rgba(67, 78, 120, 0.3)',
                  borderTopColor: '#5a6aa8'
                }}
              />
              <p className="mt-4 text-sm tracking-wide">Cargando eventos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-4">
              {days.map((date, idx) => (
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
                  animationDelay={idx * 0.02}
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
