import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { BrandSeal } from "@/components/BrandSeal";

function navClass(active: boolean) {
  return `relative text-sm font-semibold transition after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:origin-left after:rounded-full after:bg-[#667d53] after:transition ${active ? "text-stone-950 after:scale-x-100" : "text-stone-600 after:scale-x-0 hover:text-[#536645] hover:after:scale-x-100"}`;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const navigate = (path: string) => {
    setOpen(false);
    setLocation(path);
  };
  const isBoard = location === "/board" || location.startsWith("/help/") || location.startsWith("/new/");

  return <header className="sticky top-0 z-30 border-b border-stone-200/75 bg-[#fbfaf6]/90 backdrop-blur-md"><div className="container flex h-[4.8rem] items-center justify-between px-5 sm:px-7"><Link href="/" className="flex items-center gap-2.5 text-stone-950" aria-label="NeighborLift home"><BrandSeal className="h-9 w-9 text-white" /><span className="font-display text-xl font-extrabold tracking-[-0.05em]">NeighborLift</span></Link><nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation"><Link href="/board" aria-current={isBoard ? "page" : undefined} className={navClass(isBoard)}>Browse help</Link><a href="/#how-it-works" className={navClass(false)}>How it works</a><Link href="/profile" aria-current={location === "/profile" ? "page" : undefined} className={navClass(location === "/profile")}>My activity</Link><Button onClick={() => navigate("/new/offer")} className="rounded-full bg-stone-900 px-5 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#536645] active:scale-[0.97]">Offer support</Button></nav><button onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-xl text-stone-800 transition hover:bg-[#edf1e8] active:scale-95 md:hidden" aria-expanded={open} aria-label="Toggle navigation">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button></div>{open && <div className="border-t border-stone-200 bg-[#fbfaf6] px-4 py-4 md:hidden"><div className="mx-auto flex max-w-xl flex-col gap-1"><button onClick={() => navigate("/board")} className={`mobile-nav-link ${isBoard ? "mobile-nav-link-active" : ""}`}>Browse help</button><a href="/#how-it-works" onClick={() => setOpen(false)} className="mobile-nav-link">How it works</a><button onClick={() => navigate("/profile")} className={`mobile-nav-link ${location === "/profile" ? "mobile-nav-link-active" : ""}`}>My activity</button><button onClick={() => navigate("/new/offer")} className="mt-1 rounded-xl bg-stone-900 px-3 py-3 text-left text-sm font-bold text-white transition active:scale-[0.99]">Offer support</button></div></div>}</header>;
}
