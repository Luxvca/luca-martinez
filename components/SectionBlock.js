"use client";

import { motion } from "framer-motion";

export default function SectionBlock({ id, eyebrow, title, description, children }) {
  return (
    <motion.section
      id={id}
      className="section-rule"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="section-grid py-20 md:py-28">
        <div className="mb-12 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {eyebrow ? (
              <p className="text-[11px] uppercase tracking-editorial text-muted md:text-xs">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className="mt-4 font-display text-4xl leading-none tracking-[0.06em] text-foreground md:text-6xl">
                {title}
              </h2>
            ) : null}
          </div>
          {description ? (
            <p className="max-w-xl text-sm leading-7 text-muted md:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </motion.section>
  );
}
