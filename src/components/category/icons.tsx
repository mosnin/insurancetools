import { CategoryIcon, type CategoryIconName } from "@/components/brand";

/**
 * Maps the `icon` string stored on each CategoryContent/Category record to
 * the house category mark. Records carry lucide component names ("Car",
 * "ShieldCheck", ...) since that's what the nav and tools registries use;
 * this translates those names to the drawn marks in
 * `src/components/brand/icons/CategoryIcon.tsx`. Category slugs are
 * accepted too, so new records can name a mark directly.
 */
const LEGACY_NAME_TO_MARK: Record<string, CategoryIconName> = {
  Car: "auto",
  Home: "home",
  HeartPulse: "life",
  Stethoscope: "health",
  Briefcase: "business",
  Building2: "renters",
  Plane: "travel",
  PawPrint: "pet",
  FileCheck2: "claims",
  Wallet: "deductibles",
  ShieldCheck: "coverage",
  MapPin: "state-requirements",
};

const SLUGS: CategoryIconName[] = [
  "auto",
  "home",
  "life",
  "health",
  "business",
  "renters",
  "travel",
  "pet",
  "claims",
  "deductibles",
  "coverage",
  "state-requirements",
];

export function resolveCategoryMark(name: string): CategoryIconName {
  if (SLUGS.includes(name as CategoryIconName)) return name as CategoryIconName;
  return LEGACY_NAME_TO_MARK[name] ?? "coverage";
}

export interface CategoryMarkProps {
  /** Either a legacy lucide name or a category slug. */
  name: string;
  size?: number;
  className?: string;
  title?: string;
}

export function CategoryMark({ name, size = 64, className, title }: CategoryMarkProps) {
  return (
    <CategoryIcon name={resolveCategoryMark(name)} size={size} className={className} title={title} />
  );
}
