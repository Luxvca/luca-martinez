"use client";

import { motion } from "framer-motion";

export default function Contact({ compact = false }) {
  return (
    <motion.section
      id={compact ? undefined : "contact"}
      className={compact ? "" : "section-rule"}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={compact ? "" : "section-grid py-20 md:py-28"}>
        {!compact ? (
          <p className="text-[11px] uppercase tracking-editorial text-muted md:text-xs">
            Contact
          </p>
        ) : null}
        <div className="mt-8 max-w-3xl space-y-6">
          <p className="text-[26px] font-medium uppercase leading-none tracking-[0.14em] text-foreground md:text-[36px]">
            US | THE TEAM©:
          </p>
          <div className="space-y-4 text-base leading-8 text-muted md:text-lg">
            <p>
              email:{" "}
              <a className="text-foreground transition-opacity hover:opacity-70" href="mailto:mail.lucamartinez@gmail.com">
                mail.lucamartinez@gmail.com
              </a>
            </p>
            <p>
              Tel:{" "}
              <a className="text-foreground transition-opacity hover:opacity-70" href="tel:+13233822249">
                323-382-2249
              </a>
            </p>
            <p>
              LinkedIn:{" "}
              <a
                className="text-foreground transition-opacity hover:opacity-70"
                href="https://www.linkedin.com/in/luca-martinez-a93565202/"
                target="_blank"
                rel="noreferrer"
              >
                https://www.linkedin.com/in/luca-martinez-a93565202/
              </a>
            </p>
            <p>
              Instagram:{" "}
              <a
                className="text-foreground transition-opacity hover:opacity-70"
                href="https://www.instagram.com/lucaprjx/"
                target="_blank"
                rel="noreferrer"
              >
                https://www.instagram.com/lucaprjx/
              </a>
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
