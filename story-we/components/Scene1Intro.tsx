"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Volume2, VolumeX } from 'lucide-react';
import styles from '../styles/book.module.css';

interface Scene1IntroProps {
  onComplete: (withAudio: boolean) => void;
}

const CornerSVG = () => (
  <svg
    className={styles.btnCorner}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-1 1 32 32"
  >
    <path d="M32,32C14.355,32,0,17.645,0,0h.985c0,17.102,13.913,31.015,31.015,31.015v.985Z" />
  </svg>
);

const AnimatedButton = ({ text, topText, bottomText, onClick, disabled }: { text: string, topText: string, bottomText: string, onClick: () => void, disabled: boolean }) => (
  <div 
    className={styles.btnContainer} 
    onClick={() => { if (!disabled) onClick(); }} 
    style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'default' : 'pointer' }}
  >
    <div className={`${styles.btnDrawer} ${styles.transitionTop}`}>{topText}</div>
    <div className={`${styles.btnDrawer} ${styles.transitionBottom}`}>{bottomText}</div>

    <button className={styles.btnAnim} disabled={disabled}>
      <span className={styles.btnText}>{text}</span>
    </button>

    <CornerSVG />
    <CornerSVG />
    <CornerSVG />
    <CornerSVG />
  </div>
);

export default function Scene1Intro({ onComplete }: Scene1IntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const audioBtnsRef = useRef<HTMLDivElement>(null);
  const [showBtns, setShowBtns] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;
    const paths = svgRef.current.querySelectorAll('path');
    
    // Set initial stroke dasharray and dashoffset
    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    });

    // Reveal buttons first
    gsap.to(audioBtnsRef.current, {
      opacity: 1,
      y: -20,
      duration: 1,
      delay: 0.5,
      ease: 'power2.out',
      onComplete: () => setShowBtns(true)
    });
  }, []);

  const handleEnter = (withAudio: boolean) => {
    if (!svgRef.current || !containerRef.current || !audioBtnsRef.current) return;
    const paths = svgRef.current.querySelectorAll('path');

    // Hide buttons
    gsap.to(audioBtnsRef.current, { opacity: 0, duration: 0.5 });

    // Animate signature
    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out entire intro
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 1,
          delay: 0.5,
          onComplete: () => onComplete(withAudio)
        });
      }
    });

    tl.to(paths, {
      strokeDashoffset: 0,
      duration: 2,
      ease: 'power2.inOut',
      stagger: 0.2,
    });
  };

  return (
    <div className={styles.introUI} ref={containerRef}>
      <svg
        ref={svgRef}
        viewBox="0 0 500 120"
        className={styles.signatureSvg}
      >
        {/* S */}
        <path d="M 60,80 C 10,80 10,20 60,20 C 80,20 80,45 60,50 C 40,55 40,80 60,80" />
        {/* T */}
        <path d="M 80,30 L 130,30 M 105,30 L 105,80" />
        {/* O */}
        <path d="M 160,80 C 120,80 120,30 160,30 C 200,30 200,80 160,80 Z" />
        {/* R */}
        <path d="M 210,80 L 210,30 C 240,30 250,55 210,55 L 240,80" />
        {/* Y */}
        <path d="M 260,30 L 280,60 L 300,30 M 280,60 L 280,80" />
        
        {/* W */}
        <path d="M 340,30 L 350,80 L 365,50 L 380,80 L 390,30" />
        {/* E */}
        <path d="M 450,30 L 410,30 L 410,80 L 450,80 M 410,55 L 435,55" />
      </svg>

      <div className={styles.audioOptions} ref={audioBtnsRef}>
        <AnimatedButton 
          text="With Music"
          topText="Turn on"
          bottomText="the volume"
          onClick={() => handleEnter(true)}
          disabled={!showBtns}
        />
        <AnimatedButton 
          text="Silently"
          topText="Keep it"
          bottomText="quiet"
          onClick={() => handleEnter(false)}
          disabled={!showBtns}
        />
      </div>
    </div>
  );
}
