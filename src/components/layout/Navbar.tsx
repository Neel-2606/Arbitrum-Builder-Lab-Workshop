import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Blocks, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/concepts", label: "Concepts" },
  { to: "/prices", label: "Live Prices" },
  { to: "/simulator", label: "Block Simulator" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();

  // Close mobile drawer on route change
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="glass sticky top-0 z-50 w-full">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 md:px-8">
        <Link to="/" className="group flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand text-white shadow-[0_6px_20px_-6px_var(--brand)]">
            <Blocks size={18} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            Chain<span className="text-gradient">Lens</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                activeProps={{
                  className: "text-ink",
                }}
                inactiveProps={{
                  className: "text-mute hover:text-ink",
                }}
                className="relative rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    transition={reduceMotion ? { duration: 0 } : undefined}
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-brand shadow-[0_0_12px_var(--brand)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <button
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-hairline text-ink"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            className="md:hidden border-t border-hairline bg-base/95 backdrop-blur"
          >
            <div className="mx-auto flex max-w-[1200px] flex-col gap-1 px-4 py-3">
              {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    activeProps={{
                      className: "bg-elevated text-ink border border-brand/40",
                    }}
                    inactiveProps={{
                      className: "text-mute hover:bg-elevated hover:text-ink",
                    }}
                    className="rounded-lg px-4 py-3 text-sm font-medium"
                  >
                    {l.label}
                  </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
