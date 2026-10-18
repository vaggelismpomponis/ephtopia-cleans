'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import type { CleaningStatus } from '@/lib/types/cleanings';
import { CLEANING_STATUS_CONFIG } from '@/lib/types/cleanings';

interface StatusDropdownProps {
  status: CleaningStatus;
  onChange: (newStatus: CleaningStatus) => void;
  disabled?: boolean;
  className?: string;
}

const STATUS_DESCRIPTIONS: Record<CleaningStatus, string> = {
  scheduled: 'Προγραμματισμένος καθαρισμός',
  in_progress: 'Συνεργείο στον χώρο αυτή τη στιγμή',
  completed: 'Ολοκληρώθηκε & έτοιμο για check-in',
  cancelled: 'Ακυρώθηκε ο καθαρισμός',
};

export function StatusDropdown({
  status,
  onChange,
  disabled = false,
  className = '',
}: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentConfig = CLEANING_STATUS_CONFIG[status];

  // Calculate position when opening
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownWidth = 240;
    
    // Check if dropdown would overflow the right side of the screen
    let left = rect.left;
    if (left + dropdownWidth > window.innerWidth - 12) {
      left = window.innerWidth - dropdownWidth - 12;
    }
    if (left < 12) left = 12;

    // Check if it should open upwards if near bottom
    const openUpward = rect.bottom + 220 > window.innerHeight && rect.top > 220;
    const top = openUpward ? rect.top - 210 : rect.bottom + 6;

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
      updatePosition();
    }
    setIsOpen(!isOpen);
  };

  // Close on outside click
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

  const allStatuses: CleaningStatus[] = [
    'scheduled',
    'in_progress',
    'completed',
    'cancelled',
  ];

  return (
    <>
      {/* Trigger Button Badge */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-98 select-none ${
          currentConfig.bg
        } ${currentConfig.text} ${currentConfig.border} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-95'
        } ${className}`}
      >
        <span className={`w-2 h-2 rounded-full ${currentConfig.dot} shrink-0`} />
        <span>{currentConfig.label}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 text-current opacity-70 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Floating Custom Dropdown Portal */}
      {typeof window !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && coords && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, scale: 0.94, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                style={{
                  position: 'fixed',
                  top: coords.top,
                  left: coords.left,
                  width: coords.width,
                  zIndex: 99999,
                }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white/98 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl p-1.5 space-y-1 text-slate-900"
              >
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                  Αλλαγή Κατάστασης
                </div>

                {allStatuses.map((st) => {
                  const cfg = CLEANING_STATUS_CONFIG[st];
                  const isSelected = st === status;

                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(st);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                        isSelected
                          ? `${cfg.bg} ${cfg.text} shadow-2xs border ${cfg.border}`
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot} shrink-0`} />
                        <div className="min-w-0">
                          <div className="leading-tight">{cfg.label}</div>
                          <div className="text-[10px] font-medium text-slate-400 mt-0.5 leading-tight truncate">
                            {STATUS_DESCRIPTIONS[st]}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-teal shrink-0" />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
