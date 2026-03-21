"use client";

import { useState } from "react";

import CameraPointCloud from "@/components/CameraPointCloud";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import VideoGrid from "@/components/VideoGrid";
import { videosBySection } from "@/data/videos";

export default function Hero() {
  const [activeHotspot, setActiveHotspot] = useState(null);

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="md:hidden">
        <PageHeader currentPath="/selected-work" />
        <div className="section-grid py-10">
          <VideoGrid items={videosBySection.selectedWork} />
        </div>
      </div>

      <div className="section-grid relative z-10 hidden h-screen py-6 md:block md:py-8">
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

        <Navbar activeHotspot={activeHotspot} onHotspotChange={setActiveHotspot} />
      </div>
    </section>
  );
}
