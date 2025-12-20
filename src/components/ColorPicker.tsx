import { type ChangeEvent } from "react";

function ColorPicker({
  selectedColor,
  setSelectedColor,
}: {
  selectedColor: string | null;
  setSelectedColor: (color: string) => void;
}) {
  const colors: string[] = [
    "#8B5CF6",
    "#7C3AED",
    "#6366F1",
    "#3B82F6",
    "#2563EB",
    "#9333EA",
    "#C026D3",
    "#DB2777",
    "#DC2626",
  ];

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSelectedColor(e.target.value);
  };
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {colors.map((color, index) => (
        <div
          key={index}
          onClick={() => setSelectedColor(color)}
          className={`w-10 h-10 rounded-lg cursor-pointer transition-all duration-150 ease-in-out ${
            selectedColor === color
              ? "ring-4 ring-purple-200 scale-105"
              : "hover:scale-105"
          }`}
          style={{ backgroundColor: color }}
        />
      ))}

      {/* Custom Color Picker */}
      <label
        htmlFor="customColor"
        className="flex items-center justify-center w-10 h-10 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 transition"
      >
        <input
          id="customColor"
          type="color"
          onChange={handleColorChange}
          className="opacity-0 absolute w-10 h-10 cursor-pointer"
        />
        <span className="text-gray-400 text-xl">＋</span>
      </label>
    </div>
  );
}

export default ColorPicker;
