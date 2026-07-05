import { Link } from "@tanstack/react-router";
import { Blocks, Github, Linkedin } from "lucide-react";
import { SITE } from "@/constants/site";

export function Footer() {
  const { author, program, name, version } = SITE;

  return (
    <footer className="mt-24 border-t border-hairline bg-surface/40">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-14 md:grid-cols-3 md:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand text-white">
              <Blocks size={18} aria-hidden />
            </span>
            <span className="font-display text-lg font-bold text-ink">
              Chain<span className="text-gradient">Lens</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-mute leading-relaxed">
            An interactive guide to Web3 fundamentals and the Arbitrum Layer 2.
            Learn by clicking, mining, and comparing — not by reading walls of text.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-dim">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { to: "/", label: "Home" },
              { to: "/concepts", label: "Concepts" },
              { to: "/prices", label: "Live Prices" },
              { to: "/simulator", label: "Block Simulator" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-mute transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-base rounded-sm"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-dim">Built by</h4>
          <p className="mt-4 text-sm font-medium text-ink">{author.name}</p>
          <p className="text-sm text-mute">{program}</p>
          <a
            href={author.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${author.name} on GitHub`}
            className="mt-3 inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
          >
            <Github size={16} aria-hidden />
            github.com/{author.github}
          </a>
          <a
            href={author.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${author.name} on LinkedIn`}
            className="mt-2 inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
          >
            <Linkedin size={16} aria-hidden />
            linkedin.com/in/neel-prajapati-ai
          </a>
        </div>
      </div>

      <div className="border-t border-hairline">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-dim md:flex-row md:px-8">
          <p>
            © {new Date().getFullYear()} {name}. Built for {program}.
          </p>
          <p className="font-mono">
            v{version} · Layer 2, unlocked.
          </p>
        </div>
      </div>
    </footer>
  );
}
