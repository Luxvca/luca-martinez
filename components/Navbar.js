"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { navigationLinks } from "@/data/navigation";

export default function Navbar({ activeHotspot, onHotspotChange }) {
  return (
    <>
      <nav className="pointer-events-none absolute inset-0 hidden md:block">
        {navigationLinks.map((link) => (
          <motion.div
            key={link.href}
            className={`pointer-events-auto absolute ${link.position}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={link.href}
              className={`group inline-flex flex-col text-[11px] uppercase tracking-editorial transition-colors duration-300 md:text-xs ${
                activeHotspot === link.id ? "text-foreground" : "text-muted hover:text-foreground"
              }`}
              onMouseEnter={() => onHotspotChange?.(link.id)}
              onMouseLeave={() => onHotspotChange?.(null)}
              onFocus={() => onHotspotChange?.(link.id)}
              onBlur={() => onHotspotChange?.(null)}
            >
              <span>{link.label}</span>
              <span
                className={`mt-2 h-px transition-all duration-500 ${
                  activeHotspot === link.id ? "w-full bg-foreground" : "w-0 bg-foreground group-hover:w-full"
                }`}
              />
            </Link>
          </motion.div>
        ))}
      </nav>

      <nav className="absolute inset-x-6 bottom-10 flex flex-col gap-3 md:hidden">
        {navigationLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-[11px] uppercase tracking-editorial transition-colors duration-300 ${
              activeHotspot === link.id ? "text-foreground" : "text-muted hover:text-foreground"
            }`}
            onMouseEnter={() => onHotspotChange?.(link.id)}
            onMouseLeave={() => onHotspotChange?.(null)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
