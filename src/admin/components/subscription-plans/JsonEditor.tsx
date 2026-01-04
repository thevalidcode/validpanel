import { type FC, useState, useRef, useEffect } from "react";
import { Code2 } from "lucide-react";

interface JsonEditorProps {
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  label?: string;
  disabled?: boolean;
}

const JsonEditor: FC<JsonEditorProps> = ({
  value,
  onChange,
  label = "Features",
  disabled = false,
}) => {
  const [jsonString, setJsonString] = useState(JSON.stringify(value, null, 2));
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setJsonString(JSON.stringify(value, null, 2));
    setError(null);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJsonString(text);

    try {
      const parsed = JSON.parse(text);
      onChange(parsed);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonString);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonString(formatted);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  return (
    <div>
      <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
        <span className="text-gray-400">
          <Code2 className="w-4 h-4" />
        </span>
        {label}
      </label>
      <div className="relative mt-1">
        <textarea
          ref={textareaRef}
          value={jsonString}
          title="features"
          onChange={handleChange}
          disabled={disabled}
          className={`w-full h-64 font-mono text-xs p-3 rounded-lg border ${
            error ? "border-red-300" : "border-gray-300"
          } bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 ${
            error ? "focus:ring-red-500" : "focus:ring-primary"
          } focus:border-transparent resize-none transition disabled:opacity-60 disabled:cursor-not-allowed`}
          spellCheck="false"
        />
        <button
          type="button"
          onClick={handleFormat}
          disabled={disabled || !!error}
          className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          Format
        </button>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default JsonEditor;
