import { cn } from "@/lib/utils";

export function BrandSeal({ className }: { className?: string }) {
  return <span className={cn("brand-seal", className)} aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path d="M8.5 17.5c2.8-4 5-6.3 7.5-6.3s4.7 2.3 7.5 6.3c-2.8 4-5 6.3-7.5 6.3s-4.7-2.3-7.5-6.3Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M11.2 13.7 8.5 10.9M20.8 13.7l2.7-2.8M16 11.2V7.8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/><circle cx="16" cy="17.5" r="2.1" fill="currentColor"/></svg></span>;
}
