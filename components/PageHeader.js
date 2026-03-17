import Link from "next/link";

import { navigationLinks } from "@/data/navigation";

export default function PageHeader({ currentPath }) {
  return (
    <header className="section-grid flex flex-col gap-6 py-6 md:flex-row md:items-start md:justify-between md:py-8">
      <div>
        <Link
          href="/"
          className="text-[21px] font-medium leading-none tracking-[0.16em] text-foreground transition-opacity duration-300 hover:opacity-70 md:text-[24px]"
        >
          LUCA MARTINEZ
        </Link>
        <p className="mt-2 text-[11px] uppercase tracking-editorial text-muted md:text-xs">
          Director | Editor
        </p>
      </div>

      <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-editorial text-muted md:max-w-[42rem] md:justify-end md:text-xs">
        {navigationLinks.map((link) => {
          const isActive = currentPath === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors duration-300 ${
                isActive ? "text-foreground" : "hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
