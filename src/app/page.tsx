"use client";

import Footer from "@/components/common/Footer";
import CharacterLore from "@/components/home/CharacterLore";
import FollowUs from "@/components/home/FollowUs";
import HeroSection from "@/components/home/HeroSection";
import MemesTooSection from "@/components/home/MemesTooSection";
import NewsLetterSection from "@/components/home/NewsLetterSection";
import ProjectOverview from "@/components/home/ProjectOverview";
import RWAGiphySection from "@/components/home/RWAGiphySection";
import RWATicker from "@/components/home/RWATicker";
import StickersSection from "@/components/home/StickersSection";
import TotalStakedSection from "@/components/home/TotalStakedSection";
export default function Page() {
  return (
    <>
      <HeroSection />
      {/* Staking Section */}
      <TotalStakedSection />

      {/* RWA Separator */}
      {/* <RWASeperator /> */}
      <RWATicker />

      <RWAGiphySection />

      {/* Stickers Section */}
      <StickersSection />

      {/* Project Overview Section */}
      <ProjectOverview />

      <CharacterLore />
      <MemesTooSection />

      <FollowUs />
      {/* Newsletter Section */}
      <NewsLetterSection />

      <Footer />
    </>
  );
}
