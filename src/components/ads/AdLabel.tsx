"use client";

/**
 * Small "Advertisement" caption required for ad policy compliance.
 * Only ever rendered by slot components once they have already confirmed
 * AdSense is configured, so it disappears along with the ad it labels.
 */
export function AdLabel({ className = "" }: { className?: string }) {
  return (
    <span
      className={`block text-center text-[10px] uppercase tracking-wide text-slate-400 mb-1 ${className}`}
    >
      Advertisement
    </span>
  );
}
