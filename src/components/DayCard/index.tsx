import { DayCardProps, Registry } from "../../types";

// Array of color combinations (background and text colors)
const colorCombinations = [
  { bg: "bg-purple-900", text: "text-purple-200" },
  { bg: "bg-blue-900", text: "text-blue-200" },
  { bg: "bg-green-900", text: "text-green-200" },
  { bg: "bg-red-900", text: "text-red-200" },
  { bg: "bg-yellow-900", text: "text-yellow-200" },
  { bg: "bg-pink-900", text: "text-pink-200" },
  { bg: "bg-indigo-900", text: "text-indigo-200" },
  { bg: "bg-teal-900", text: "text-teal-200" },
];

// Function to get a random color combination based on registry id
const getRandomColor = (id: string) => {
  // Use the registry id's first character code to deterministically select a color
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
}: DayCardProps) {
  const handleRegistryClick = (e: React.MouseEvent, registry: Registry) => {
    e.stopPropagation(); // Prevent triggering the day click
    onRegistryClick?.(registry);
  };

  return (
    <button
      onClick={() => onDayClick(date)}
      className={`h-24 p-2 border border-gray-700 cursor-pointer rounded-lg ${
        isCurrentMonth ? "bg-gray-800" : "bg-gray-900"
      } hover:bg-gray-700 transition-colors relative flex flex-col`}
    >
      <span
        className={`text-sm ${
          isCurrentMonth ? "text-gray-300" : "text-gray-500"
        }`}
      >
        {date.getDate()}
      </span>
      <div className="flex-1 overflow-y-auto">
        {registries.map((registry) => {
          const { bg, text } = getRandomColor(registry.id.toString());
          return (
            <div
              key={registry.id}
              className={`text-xs ${bg} ${text} p-1 rounded mt-1 text-left truncate cursor-pointer`}
              onClick={(e) => handleRegistryClick(e, registry)}
            >
              {registry.name}
            </div>
          );
        })}
      </div>
    </button>
  );
}
