import { useEffect } from 'react';
import { X } from 'lucide-react';
import MapView from './MapView';

/**
 * Full-screen modal overlay that renders the MapView.
 * @param {{ routes: any[], latitude: number, longitude: number, onClose: () => void }} props
 */
export default function MapModal({ routes, latitude, longitude, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{ background: 'var(--breathe-bg-primary)' }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-5 py-3 shrink-0"
        style={{ borderBottom: '1px solid var(--breathe-border)' }}
      >
        <span className="text-sm font-semibold" style={{ color: 'var(--breathe-text-primary)' }}>
          Route Map
        </span>
        <button
          onClick={onClose}
          aria-label="Close map"
          className="p-2 rounded-full transition-colors hover:opacity-70"
          style={{ color: 'var(--breathe-text-secondary)' }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Map fills remaining space */}
      <div className="flex-1 relative">
        <MapView latitude={latitude} longitude={longitude} routes={routes} />
      </div>
    </div>
  );
}
