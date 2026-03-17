"use client";

import { useState } from "react";

import CameraPointCloud from "@/components/CameraPointCloud";
import Navbar from "@/components/Navbar";

export default function Hero() {
  const [activeHotspot, setActiveHotspot] = useState(null);

  return (
    <section className="relative h-screen overflow-hidden bg-background">
      <div className="section-grid relative z-10 h-full py-6 md:py-8">
        <div className="max-w-xs">
          <p className="text-[21px] font-medium leading-none tracking-[0.16em] text-foreground md:text-[24px]">
            LUCA MARTINEZ
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-editorial text-muted md:text-xs">
            Director | Editor
          </p>
        </div>

        <div className="absolute inset-0 flex items-center justify-center px-6 md:px-10">
          <div className="pointer-events-auto h-[42vh] w-full max-w-4xl sm:h-[48vh] md:h-[54vh]">
            <CameraPointCloud activeHotspot={activeHotspot} />
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-8 left-6 max-w-[12rem] md:bottom-10 md:left-10">
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted md:text-[11px]">
            Cinematic motion studies and directed image-making
          </p>
        </div>

        <Navbar activeHotspot={activeHotspot} onHotspotChange={setActiveHotspot} />
      </div>
    </section>
  );
}
