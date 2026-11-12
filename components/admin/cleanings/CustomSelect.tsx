'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search } from 'lucide-react';

export interface CustomSelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  colorDot?: string;
  description?: string;
  badge?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md';
  variant?: 'default' | 'filter' | 'ghost';
  searchable?: boolean;
  searchPlaceholder?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Επιλέξτε...',
  disabled = false,
  className = '',
  size = 'md',
  variant = 'default',
  searchable = false,
  searchPlaceholder = 'Αναζήτηση...',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Filter options if search enabled
  const filteredOptions = searchQuery.trim()
    ? options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          opt.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownWidth = Math.max(rect.width, 220);

    let left = rect.left;
    if (left + dropdownWidth > window.innerWidth - 12) {
      left = window.innerWidth - dropdownWidth - 12;
    }
    if (left < 12) left = 12;

    const dropdownEstimatedHeight = Math.min(filteredOptions.length * 44 + (searchable ? 50 : 20), 280);
    const openUpward = rect.bottom + dropdownEstimatedHeight > window.innerHeight && rect.top > dropdownEstimatedHeight;
    const top = openUpward ? rect.top - dropdownEstimatedHeight - 6 : rect.bottom + 6;

    setCoords({
      top,
      left,
      width: dropdownWidth,
    });
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    if (!isOpen) {
      setSearchQuery('');
      updatePosition();
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen]);

  // Size styles
  const sizeClasses =
    size === 'sm'
      ? 'px-3 py-1.5 text-xs rounded-xl'
      : 'px-3.5 py-2.5 text-xs sm:text-sm rounded-xl';

  // Variant styles
  const variantClasses =
    variant === 'filter'
      ? 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold'
      : variant === 'ghost'
      ? 'bg-transparent hover:bg-slate-100 text-slate-700 font-semibold'
      : 'bg-white hover:bg-slate-50/80 border border-slate-200 text-slate-800 font-medium focus:border-teal';

  return (
    <>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={`w-full flex items-center justify-between gap-2 text-left transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-99 select-none ${sizeClasses} ${variantClasses} ${
          isOpen ? 'ring-2 ring-teal/20 border-teal' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {selectedOption?.icon && (
            <span className="shrink-0 text-slate-500">{selectedOption.icon}</span>
          )}
          {selectedOption?.colorDot && (
            <span className={`w-2 h-2 rounded-full shrink-0 ${selectedOption.colorDot}`} />
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
              {selectedOption.badge}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-teal' : ''
          }`}
        />
      </button>

      {/* Floating Menu Portal */}
      {typeof window !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && coords && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                style={{
                  position: 'fixed',
                  top: coords.top,
                  left: coords.left,
                  width: coords.width,
                  zIndex: 99999,
                }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white border border-border rounded-xl shadow-xs overflow-hidden p-1.5 space-y-1 text-navy max-h-72 flex flex-col"
              >
                {/* Search Header if searchable */}
                {searchable && (
                  <div className="p-1 border-b border-slate-100 mb-1">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal"
                      />
                    </div>
                  </div>
                )}

                {/* Options List */}
                <div className="overflow-y-auto space-y-0.5 flex-1 pr-0.5">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((opt) => {
                      const isSelected = opt.value === value;

                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onChange(opt.value);
                            setIsOpen(false);
                          }}
                          className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                            isSelected
                              ? 'bg-teal/10 text-teal font-bold'
                              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {opt.icon && (
                              <span className="shrink-0 text-slate-500">{opt.icon}</span>
                            )}
                            {opt.colorDot && (
                              <span className={`w-2 h-2 rounded-full shrink-0 ${opt.colorDot}`} />
                            )}
                            <div className="min-w-0">
                              <div className="truncate leading-tight">{opt.label}</div>
                              {opt.description && (
                                <div className="text-[10px] text-slate-400 font-normal truncate mt-0.5">
                                  {opt.description}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {opt.badge && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                {opt.badge}
                              </span>
                            )}
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-teal shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-400">
                      Δεν βρέθηκαν επιλογές
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
