"use client";

import { useRef, useState, useEffect } from "react";

export function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({});
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    setIsTouchDevice(checkTouch);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    setStyle({
      transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    });
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    setStyle({ transform: "perspective(1200px) rotateX(0deg) rotateY(0deg)" });
  };

  if (isTouchDevice) {
    // On touch devices, skip the tilt effect entirely and render plain
    return <div className="relative">{children}</div>;
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-2 rounded-2xl bg-[#4A5068]/20 -z-10" />
      <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 -rotate-1 rounded-2xl bg-[#4A5068]/30 -z-10" />
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={style}
        className="transition-transform duration-200 ease-out will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}