'use client';

import { useState, useEffect, useRef } from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function SectionEditorLayout({ children }: { children: React.ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleContentSaved = () => {
      setIsRefreshing(true);
      setRefreshKey((prev) => prev + 1);
      setTimeout(() => setIsRefreshing(false), 800);
    };

    const handleLivePreviewUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { ...customEvent.detail, type: 'LIVE_PREVIEW_UPDATE', contentType: customEvent.detail.type },
          '*'
        );
      }
    };

    window.addEventListener('content-saved', handleContentSaved);
    window.addEventListener('live-preview-update', handleLivePreviewUpdate);
    return () => {
      window.removeEventListener('content-saved', handleContentSaved);
      window.removeEventListener('live-preview-update', handleLivePreviewUpdate);
    };
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 h-full min-h-[calc(100dvh-120px)]">
      <div className="w-full lg:w-[45%] xl:w-[40%] shrink-0">
        <div className="lg:pr-2 h-full">{children}</div>
      </div>

      <div className="w-full lg:w-[55%] xl:w-[60%] flex flex-col bg-white border border-border rounded-xl overflow-hidden h-[720px] lg:h-auto lg:sticky lg:top-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-warm-white">
          <div className="text-xs font-bold uppercase tracking-widest text-teal-dark">
            Live Preview
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleManualRefresh}
              className="inline-flex items-center gap-1.5 min-h-9 px-3 py-1.5 text-xs font-medium text-navy bg-white border border-border rounded-lg hover:border-navy/40 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-teal-dark' : ''}`} strokeWidth={1.75} />
              <span>Ανανέωση</span>
            </button>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 min-h-9 px-3 py-1.5 text-xs font-medium text-navy bg-white border border-border rounded-lg hover:border-navy/40 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Άνοιγμα</span>
            </Link>
          </div>
        </div>

        <div className="flex-1 bg-warm-white relative">
          <iframe
            ref={iframeRef}
            key={refreshKey}
            src={`/?preview=${refreshKey}`}
            className="absolute inset-0 w-full h-full border-0"
            title="Live Preview"
          />
        </div>
      </div>
    </div>
  );
}
