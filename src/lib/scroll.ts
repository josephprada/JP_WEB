import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

// Exported so overlays (the CV viewer) can pause Lenis while open. Null on
// touch, where useSmoothScroll never constructs an instance.
export let activeLenis: Lenis | null = null;

/**
 * Lenis drives the scroll position and GSAP's ticker drives Lenis, so both
 * agree on the same frame. Without this handshake ScrollTrigger reads a stale
 * scroll value and pinned sections drift by a frame.
 */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    /*
     * Smooth scrolling is a pointer-device nicety. Touch devices already have
     * momentum scrolling that feels better than anything Lenis interpolates,
     * and layering the two only creates a surface for touch handling to go
     * wrong, so Lenis simply does not run there.
     *
     * `any-pointer: coarse` catches phones/tablets even when a "desktop site"
     * mode also reports a fine pointer.
     */
    if (window.matchMedia("(any-pointer: coarse)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    const raf = (time: number) => lenis.raf(time * 1000);

    activeLenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      activeLenis = null;
    };
  }, [enabled]);
}

/**
 * Anchor navigation must go through Lenis when it is running: Lenis forces
 * `scroll-behavior: auto`, so a plain scrollIntoView would jump instead of glide.
 */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  if (activeLenis) {
    activeLenis.scrollTo(target, { offset: 0, duration: 1.2 });
    return;
  }
  target.scrollIntoView({ behavior: "auto", block: "start" });
}
