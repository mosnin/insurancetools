import { ProcessingOrb } from "@/components/brand";

/**
 * Route level loading UI. Shown while Next.js resolves a navigation between
 * tool pages, which is the main place on this site where a visitor waits on
 * anything at all.
 */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <ProcessingOrb state="shaping" size={64} speed={1.65} label="Loading calculator" />
    </div>
  );
}
