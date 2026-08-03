"use client";

import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

export interface PageFlipHandle {
  flip: (
    direction: 'next' | 'prev',
    onMidpoint: () => void,
    onComplete?: () => void
  ) => void;
}

/**
 * PageFlipOverlay
 *
 * An invisible overlay that sits above every scene.  When `flip()` is called
 * it covers the book area with two cream-lined panels (matching the existing
 * book page style) and rotates them with a realistic 3-D page-turn animation
 * powered by GSAP.  The caller is notified at the visual midpoint (when the
 * page is edge-on at 90 °) so the underlying scene can be swapped while the
 * user cannot see either face — giving a seamless transition.
 *
 *  direction="next"  → right (recto) panel rotates 0 → -180 °
 *  direction="prev"  → left (verso) panel rotates 0 →  180 °
 */
const PageFlipOverlay = forwardRef<PageFlipHandle>((_, ref) => {
  const overlayRef     = useRef<HTMLDivElement>(null);
  const rectoRef       = useRef<HTMLDivElement>(null); // right page
  const versoRef       = useRef<HTMLDivElement>(null); // left  page
  const rectoShadowRef = useRef<HTMLDivElement>(null);
  const versoShadowRef = useRef<HTMLDivElement>(null);
  const isAnimating    = useRef(false);

  useImperativeHandle(ref, () => ({
    flip(direction, onMidpoint, onComplete) {
      // Prevent double-trigger
      if (isAnimating.current) return;

      const overlay     = overlayRef.current;
      const recto       = rectoRef.current;
      const verso       = versoRef.current;
      const rectoShadow = rectoShadowRef.current;
      const versoShadow = versoShadowRef.current;

      if (!overlay || !recto || !verso) {
        // Fallback: switch immediately if DOM isn't ready
        onMidpoint();
        onComplete?.();
        return;
      }

      isAnimating.current = true;
      const DURATION = 1.2; // seconds – matches the CodePen @p_f value

      // ── Reveal overlay ──────────────────────────────────────────────────
      gsap.set(overlay, { display: 'flex', pointerEvents: 'all' });

      const cleanup = () => {
        gsap.set(overlay, { display: 'none', pointerEvents: 'none' });
        isAnimating.current = false;
        onComplete?.();
      };

      if (direction === 'next') {
        // Recto: right page flips left (0° → -180°), transform-origin = left edge
        gsap.set(recto, { rotateY: 0,    zIndex: 10 });
        gsap.set(verso, { rotateY: 180,  zIndex: 9  }); // hidden (backface)
        if (rectoShadow) gsap.set(rectoShadow, { opacity: 0 });

        const tl = gsap.timeline({ onComplete: cleanup });

        tl.to(recto, {
          rotateY: -180,
          duration: DURATION,
          ease: 'power2.inOut',
          onUpdate() {
            // 'this' is the tween in GSAP 3 regular functions
            const shadow = Math.sin(this.progress() * Math.PI) * 0.55;
            if (rectoShadow) rectoShadow.style.opacity = String(shadow);
          },
        }, 0);

        // Fire midpoint callback when the page is edge-on (invisible)
        tl.call(onMidpoint, [], DURATION / 2);

      } else {
        // Verso: left page flips right (0° → 180°), transform-origin = right edge
        gsap.set(verso, { rotateY: 0,    zIndex: 10 });
        gsap.set(recto, { rotateY: -180, zIndex: 9  }); // hidden
        if (versoShadow) gsap.set(versoShadow, { opacity: 0 });

        const tl = gsap.timeline({ onComplete: cleanup });

        tl.to(verso, {
          rotateY: 180,
          duration: DURATION,
          ease: 'power2.inOut',
          onUpdate() {
            const shadow = Math.sin(this.progress() * Math.PI) * 0.55;
            if (versoShadow) versoShadow.style.opacity = String(shadow);
          },
        }, 0);

        tl.call(onMidpoint, [], DURATION / 2);
      }
    },
  }));

  return (
    <div
      ref={overlayRef}
      className={styles.flipOverlay}
      style={{ display: 'none', pointerEvents: 'none' }}
    >
      <div className={styles.flipOverlayInner}>

        {/* ── Verso — left panel ── */}
        <div ref={versoRef} className={`${styles.flipPanel} ${styles.flipPanelVerso}`}>
          {/* Front face (visible at 0 °) */}
          <div className={`${styles.flipPanelFace} ${styles.flipPanelFront} ${styles.flipPanelVersoFace}`} />
          {/* Back face (visible after 90 °, has subtle darker tone) */}
          <div className={`${styles.flipPanelFace} ${styles.flipPanelBack} ${styles.flipPanelVersoFace}`} />
          {/* Dynamic shadow overlay driven by GSAP */}
          <div ref={versoShadowRef} className={styles.flipPanelShadowVerso} />
        </div>

        {/* ── Recto — right panel ── */}
        <div ref={rectoRef} className={`${styles.flipPanel} ${styles.flipPanelRecto}`}>
          <div className={`${styles.flipPanelFace} ${styles.flipPanelFront} ${styles.flipPanelRectoFace}`} />
          <div className={`${styles.flipPanelFace} ${styles.flipPanelBack} ${styles.flipPanelRectoFace}`} />
          <div ref={rectoShadowRef} className={styles.flipPanelShadowRecto} />
        </div>

      </div>
    </div>
  );
});

PageFlipOverlay.displayName = 'PageFlipOverlay';
export default PageFlipOverlay;
