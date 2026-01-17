import { useEffect, useRef } from "react";

export function SplineHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@splinetool/viewer@1.12.36/build/spline-viewer.js";
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      {/* @ts-ignore */}
      <spline-viewer url="https://prod.spline.design/x2lNa8FmD3MUMtwJ/scene.splinecode"></spline-viewer>
      
      {/* Overlay gradient to blend bottom edge */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </div>
  );
}
