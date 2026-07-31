import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-slate-500">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" aria-hidden="true" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-slate-700 transition-colors">
              {item.name}
            </Link>
          ) : (
            <span className="text-slate-900 font-medium">{item.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
