"use client";
import Cloudscape from "@/components/forgeui/cloudscapes";
export default function ThemeCloudsPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Cloudscape
        colorBottom="#87ceeb"
        colorMid="#f8f8f8"
        colorTop="#ffffff"
        speed={1}
        height="100vh"
      />
    </div>
  );
}