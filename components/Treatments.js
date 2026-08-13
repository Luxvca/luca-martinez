"use client";

import { motion } from "framer-motion";

export default function Treatments({ items, compact = false }) {
  return (
    <motion.section
      id={compact ? undefined : "treatments"}
      className={compact ? "" : "section-rule"}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={compact ? "" : "section-grid py-10 md:py-12"}>
        {!compact ? (
          <div className="mb-12 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] uppercase tracking-editorial text-muted md:text-xs">
                Development
              </p>
              <h2 className="mt-4 text-[26px] font-medium uppercase leading-none tracking-[0.14em] text-foreground md:text-[36px]">
                Treatments
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-muted md:text-base">
              PDF treatments can be added in the treatments data file and will open in a new tab.
            </p>
          </div>
        ) : null}
        <div className="grid gap-px overflow-hidden rounded-[24px] border border-line/90 bg-line/90">
          {items.map((item) => {
            const assets =
              item.assets ?? (item.pdfUrl ? [{ label: "Open PDF", url: item.pdfUrl }] : []);

            if (assets.length === 1) {
              return (
                <a
                  key={item.title}
                  href={assets[0].url}
                  target="_blank"
                  rel="noreferrer"
                  className="grid gap-3 bg-background px-6 py-5 transition-colors duration-300 hover:bg-[#f0eee8] md:grid-cols-[1.25fr_2.1fr_auto] md:items-center"
                >
                  <h3 className="text-lg font-medium uppercase tracking-[0.12em] text-foreground md:text-xl">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-7 text-muted">{item.description}</p>
                  <span className="text-[11px] uppercase tracking-editorial text-muted md:justify-self-end md:text-xs">
                    {assets[0].label}
                  </span>
                </a>
              );
            }

            return (
              <div
                key={item.title}
                className="grid gap-3 bg-background px-6 py-5 md:grid-cols-[1.25fr_2.1fr_auto] md:items-center"
              >
                <h3 className="text-lg font-medium uppercase tracking-[0.12em] text-foreground md:text-xl">
                  {item.title}
                </h3>
                <p className="text-sm leading-7 text-muted">{item.description}</p>
                <div className="flex flex-wrap gap-x-5 gap-y-2 md:justify-self-end">
                  {assets.map((asset) => (
                    <a
                      key={asset.url}
                      href={asset.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] uppercase tracking-editorial text-muted transition-colors duration-300 hover:text-foreground md:text-xs"
                    >
                      {asset.label}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
