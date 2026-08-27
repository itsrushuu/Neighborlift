import { HeartHandshake, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const navigate = (path: string) => {
    setOpen(false);
    setLocation(path);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/75 bg-[#fbfaf6]/90 backdrop-blur-md">
      <div className="container flex h-[4.8rem] items-center justify-between px-5 sm:px-7">
        <Link href="/" className="flex items-center gap-2.5 text-stone-950" aria-label="NeighborLift home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#536645] text-white shadow-sm"><HeartHandshake className="h-5 w-5" /></span>
          <span className="font-display text-xl font-extrabold tracking-[-0.04em]">NeighborLift</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          <Link href="/board" className="text-sm font-semibold text-stone-700 transition hover:text-[#536645]">Browse help</Link>
          <a href="/#how-it-works" className="text-sm font-semibold text-stone-700 transition hover:text-[#536645]">How it works</a>
          <Link href="/profile" className="text-sm font-semibold text-stone-700 transition hover:text-[#536645]">My activity</Link>
          <Button onClick={() => navigate("/new/offer")} className="rounded-full bg-stone-900 px-5 font-bold text-white hover:bg-[#536645]">Offer support</Button>
        </nav>
        <button onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-lg text-stone-800 hover:bg-stone-100 md:hidden" aria-expanded={open} aria-label="Toggle navigation">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && <div className="border-t border-stone-200 bg-[#fbfaf6] px-4 py-4 md:hidden"><div className="flex flex-col gap-2"><button onClick={() => navigate("/board")} className="rounded-lg px-3 py-3 text-left text-sm font-bold text-stone-800 hover:bg-stone-100">Browse help</button><button onClick={() => navigate("/profile")} className="rounded-lg px-3 py-3 text-left text-sm font-bold text-stone-800 hover:bg-stone-100">My activity</button><button onClick={() => navigate("/new/offer")} className="rounded-lg bg-stone-900 px-3 py-3 text-left text-sm font-bold text-white">Offer support</button></div></div>}
    </header>
  );
}
