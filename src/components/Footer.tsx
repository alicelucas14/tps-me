import { Crown } from "lucide-react";

const Socials = [
  { name: "X", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  { name: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.849.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.849.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
  { name: "YouTube", path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
  { name: "Discord", path: "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" },
];

interface FooterLink {
  label: string;
  href: string;
  target?: string;
}

const links: Record<string, FooterLink[]> = {
  Product: [
    { label: "Instant Download", href: "#download" },
    { label: "Our Games", href: "/our-games" },
    { label: "VIP Loyalty Club", href: "/loyalty-programs" },
    { label: "Tournaments", href: "/leaderboards-and-tournaments" },
  ],
  Resources: [
    { label: "Player's Guide", href: "/players-guide" },
    { label: "Blog & Chronicles", href: "/blog" },
    { label: "Teen Patti Variations", href: "/teen-patti-games" },
    { label: "HTML Sitemap", href: "/sitemap" },
  ],
  "AI & Search": [
    { label: "XML Sitemap", href: "/sitemap.xml", target: "_blank" },
    { label: "AI Search Guide (llms.txt)", href: "/llms.txt", target: "_blank" },
    { label: "Robots Policy (robots.txt)", href: "/robots.txt", target: "_blank" },
    { label: "Contact Us", href: "/contact-us" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Bonus & Promotions", href: "/welcome-bonuses" },
    { label: "About Us", href: "/about-us" },
    { label: "Player FAQ", href: "#faq" },
  ],
};

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#030507]">
      <div className="mx-auto w-full max-w-7xl px-6 pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-800 shadow-lg">
                <Crown className="h-5 w-5 text-[#f5c242]" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-semibold tracking-tight text-white">
                  Teen Patti <span className="gradient-text-gold">Stars</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                  Premium Edition
                </span>
              </div>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-white/50">
              India's most refined real-money Teen Patti experience. Trusted by
              50 lakh+ players across the country. Built with obsession in
              Bangalore.
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-2">
              {Socials.map((s) => (
                <a
                  key={s.name}
                  href="#"
                  aria-label={s.name}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 transition-all hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {Object.entries(links).map(([title, items]) => (
              <div key={title}>
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/80">
                  {title}
                </h4>
                <ul className="space-y-2.5">
                  {items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target={item.target}
                        rel={item.target ? "noreferrer" : undefined}
                        className="text-sm text-white/50 transition-colors hover:text-white"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Legal & disclaimers */}
        <div className="mt-16 rounded-2xl border border-white/5 bg-white/[0.015] p-6">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70">
              18+ Only
            </span>
            <span className="rounded-md border border-emerald-400/20 bg-emerald-400/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              RNG Certified
            </span>
            <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70">
              SSL Secured
            </span>
            <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70">
              Curacao Licensed
            </span>
            <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              AI SEO Indexed (llms.txt)
            </span>
          </div>
          <p className="text-xs leading-relaxed text-white/40">
            <span className="font-semibold text-white/60">Disclaimer:</span>{" "}
            Teen Patti Stars involves an element of financial risk and may be
            addictive. Please play responsibly and at your own risk. This game
            is restricted to users 18 years and above. Real-money gaming is
            prohibited in the states of Telangana, Andhra Pradesh, Tamil Nadu,
            Karnataka, Odisha, and Assam. By using this platform, you confirm
            that you are of legal age and not a resident of restricted
            jurisdictions. T&C apply.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 md:flex-row md:items-center">
          <div className="text-xs text-white/40">
            © 2026 Teen Patti Stars Technologies Pvt. Ltd. All rights reserved.
            CIN: U72900KA2021PTC147283
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
            <a href="/#/sitemap" className="hover:text-white">
              HTML Sitemap
            </a>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <a href="/sitemap.xml" target="_blank" className="hover:text-emerald-400">
              XML Sitemap
            </a>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <a href="/llms.txt" target="_blank" className="hover:text-amber-400">
              llms.txt (AI)
            </a>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <a href="/#admin" className="hover:text-emerald-400 font-medium">
              Admin HQ
            </a>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-emerald-300">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
