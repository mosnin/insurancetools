"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal, StaggerItem, Stagger } from "@/components/motion";
import type { CategoryFAQItem } from "@/lib/category-content";

interface CategoryFAQProps {
  faqs: CategoryFAQItem[];
}

export function CategoryFAQ({ faqs }: CategoryFAQProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mt-12">
      <Reveal>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
      </Reveal>
      <Stagger className="space-y-2">
        {faqs.map((faq, i) => (
          <StaggerItem key={i}>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-slate-50 transition-colors"
                aria-expanded={open === i}
              >
                <span className="font-medium text-slate-900 text-sm pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                  <p className="pt-3">{faq.answer}</p>
                </div>
              )}
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
