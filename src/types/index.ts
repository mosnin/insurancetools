export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  keywords: string[];
  relatedTools: string[];
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  tools: Tool[];
}

export interface FAQItem {
  question: string;
  answer: string;
}
