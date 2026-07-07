
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounce?: number;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value: externalValue,
  onChange,
  placeholder = 'Search...',
  debounce = 300,
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState(externalValue || '');
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalValue(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(val), debounce);
  }, [onChange, debounce]);

  const handleClear = useCallback(() => {
    setInternalValue('');
    if (timerRef.current) clearTimeout(timerRef.current);
    onChange('');
  }, [onChange]);

  useEffect(() => {
    if (externalValue !== undefined) setInternalValue(externalValue);
  }, [externalValue]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      <input
        type="text"
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-6 pr-8 py-2 bg-transparent text-sm focus:outline-none font-medium"
      />
      {internalValue && (
        <button
          onClick={handleClear}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
