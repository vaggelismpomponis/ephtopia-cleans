"use client";

import { useRef } from "react";
import { Upload, FileText, X } from "lucide-react";

interface CvUploadFieldProps {
  cvFile: File | null;
  cvError: string;
  onFileSelect: (file: File | null) => void;
}

export function CvUploadField({
  cvFile,
  cvError,
  onFileSelect,
}: CvUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onFileSelect(file);
  };

  const handleClear = () => {
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <label
        htmlFor="app-cv-input"
        className="block text-sm font-medium text-navy mb-1.5"
      >
        Βιογραφικό Σημείωμα (CV)
      </label>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="sr-only"
        id="app-cv-input"
      />
      {!cvFile ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full min-h-24 border border-dashed border-border rounded-lg p-4 text-center text-sm text-muted hover:border-teal-dark hover:bg-warm-white transition-colors cursor-pointer"
        >
          <Upload
            className="w-5 h-5 mx-auto mb-2 text-teal-dark"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <span className="font-semibold text-navy block">
            Επισύναψη αρχείου CV
          </span>
          <span className="block text-xs text-muted mt-0.5">
            PDF, DOC, DOCX — έως 5MB
          </span>
        </button>
      ) : (
        <div className="flex items-center gap-3 border border-border bg-warm-white rounded-lg px-3.5 py-2.5 min-h-11">
          <FileText
            className="w-4 h-4 text-teal-dark shrink-0"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <span className="text-sm font-medium text-navy truncate flex-1 min-w-0">
            {cvFile.name}
          </span>
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 min-h-9 min-w-9 inline-flex items-center justify-center rounded-md hover:bg-white text-muted hover:text-destructive transition-colors cursor-pointer"
            aria-label="Αφαίρεση αρχείου"
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>
      )}
      {cvError && (
        <p className="mt-1.5 text-xs text-destructive" role="alert">
          {cvError}
        </p>
      )}
    </div>
  );
}

