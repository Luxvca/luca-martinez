"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function VideoCard({ item }) {
  return (
    <motion.div
      className="group relative block overflow-hidden bg-[#101010]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/work/${item.slug}`} className="block">
        <div className="relative aspect-video overflow-hidden border border-transparent transition-colors duration-300 group-hover:border-white/40">
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/28" />
          <div className="absolute inset-0 z-10 flex items-center justify-center p-5 text-center">
            <div className="max-w-[80%] opacity-0 transition duration-300 group-hover:opacity-100">
              <h3 className="text-[10px] font-medium uppercase leading-[1.4] tracking-[0.14em] text-foreground md:text-[11px]">
                {item.title}
              </h3>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
