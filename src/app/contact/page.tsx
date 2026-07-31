"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MessageSquare, Lightbulb, Bug, ArrowRight } from "lucide-react";

const CONTACT_REASONS = [
  { value: "tool-request", label: "Request a new tool" },
  { value: "bug", label: "Report a bug or error" },
  { value: "partnership", label: "Partnership or sponsorship" },
  { value: "press", label: "Press or media inquiry" },
  { value: "feedback", label: "General feedback" },
  { value: "other", label: "Something else" },
];

const reasons = [
  {
    icon: <Lightbulb className="w-5 h-5 text-blue-600" />,
    title: "Request a Tool",
    body: "Have a calculator or insurance tool you'd like to see? We prioritize requests from our community.",
  },
  {
    icon: <Bug className="w-5 h-5 text-blue-600" />,
    title: "Report an Issue",
    body: "Found a calculation error or something that doesn't work right? We take accuracy seriously.",
  },
  {
    icon: <MessageSquare className="w-5 h-5 text-blue-600" />,
    title: "Partnerships",
    body: "Interested in sponsorships, affiliate arrangements, or content collaboration? Let's talk.",
  },
  {
    icon: <Mail className="w-5 h-5 text-blue-600" />,
    title: "General",
    body: "Anything else on your mind. We read every message.",
  },
];

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", reason: "", message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Placeholder: wire to your form endpoint (Resend, Formspree, etc.)
    await new Promise((r) => setTimeout(r, 800));
    setStatus("sent");
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-100">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 mb-6">
            <Mail className="w-6 h-6 text-blue-600" aria-hidden="true" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            We read every message. Whether you&apos;ve found a bug, have a tool idea, or want to
            discuss a partnership, reach out.
          </p>
        </div>
      </section>

      {/* Reason cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
          What can we help you with?
        </h2>
        <p className="text-slate-600 leading-relaxed mb-8 max-w-2xl">
          Pick the closest match below, then use the form. Telling us which kind of message you
          are sending helps us route it to the right person and reply faster.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {reasons.map((r) => (
            <div key={r.title} className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="p-2 rounded-lg bg-blue-50 w-fit mb-3">{r.icon}</div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1">{r.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>

        {/* Form + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            {status === "sent" ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-green-50 rounded-2xl border border-green-100">
                <div className="text-4xl mb-4">✓</div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Message received!</h2>
                <p className="text-slate-600 mb-6">
                  We&apos;ll get back to you within 1 to 2 business days.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Back to home <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ): (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                      Your name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Jane Smith"
                      className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-slate-700 mb-1">
                    What&apos;s this about? <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="reason"
                    name="reason"
                    required
                    value={form.reason}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <option value="" disabled>Select a reason…</option>
                    {CONTACT_REASONS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us what's on your mind…"
                    className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-slate-400 resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {status === "sending" ? "Sending…": "Send Message"}
                  {status !== "sending" && <ArrowRight className="w-4 h-4" />}
                </button>

                <p className="text-xs text-slate-400 text-center">
                  We typically respond within 1 to 2 business days.
                </p>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 text-sm mb-3">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  { label: "Browse all tools", href: "/#explore" },
                  { label: "About Insurance Tools", href: "/about" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Use", href: "/terms" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                    >
                      <ArrowRight className="w-3 h-3" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
              <h3 className="font-semibold text-slate-900 text-sm mb-2">Want a specific tool?</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We prioritize tool requests from users. If there&apos;s a calculator you need that we
                don&apos;t have yet, tell us. It may be our next build.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
