"use client";

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface SpinningBookProps {
    onClick?: () => void;
}

const COLORS = [
    "#e8729a", "#5cdb95", "#f39c12", "#3498db", 
    "#9b59b6", "#e74c3c", "#1abc9c", "#d35400",
    "#2980b9", "#c0392b", "#16a085"
];

// Component for the romantic typing letter
function LetterContent({ 
    isHovered, 
    onComplete, 
    onNext 
}: { 
    isHovered: boolean, 
    onComplete: () => void, 
    onNext: () => void 
}) {
    const [charIndex, setCharIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    
    const fullText = "Dear Reva,\n\nSejak pertama bertemu,\nduniaku berubah jadi lebih indah.\nSenyummu adalah melodi favoritku,\ndan tawamu kebahagiaanku.\nTerima kasih sudah hadir di hidupku.\n\nI love you, Reva! ♥\n~ Afrizal";
    
    useEffect(() => {
        if (!isHovered) {
            setCharIndex(0);
            setIsComplete(false);
            return;
        }
        
        if (charIndex < fullText.length) {
            const timeout = setTimeout(() => {
                setCharIndex(prev => prev + 1);
            }, 35); // Kecepatan mengetik pena
            return () => clearTimeout(timeout);
        } else {
            if (!isComplete) {
                setIsComplete(true);
                onComplete();
            }
        }
    }, [isHovered, charIndex, fullText, isComplete, onComplete]);

    if (!isHovered) return null;

    return (
        <div className={styles.letterContent}>
            {fullText.substring(0, charIndex).split('').map((char, index) => (
                <span key={index} style={{ color: COLORS[index % COLORS.length] }}>
                    {char}
                </span>
            ))}
            
            {!isComplete && (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2c3e50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.penIcon}>
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
            )}
            
            <button 
                className={`${styles.clickButton} ${isComplete ? styles.visible : ''}`}
                onClick={(e) => {
                    e.stopPropagation(); 
                    onNext();
                }}
            >
                <span>CLICK HERE !</span>
            </button>
        </div>
    );
}

export default function SpinningBook({ onClick }: SpinningBookProps) {
    const [clicked, setClicked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const holderRef = useRef<HTMLDivElement>(null);
    const frontRef = useRef<HTMLDivElement>(null);
    const pagesRef = useRef<(HTMLDivElement | null)[]>([]);
    const spinTweenRef = useRef<gsap.core.Tween | null>(null);

    const startSpinning = () => {
        spinTweenRef.current?.kill();
        spinTweenRef.current = gsap.to(holderRef.current, {
            rotationY: "+=360",
            duration: 10,
            ease: "none",
            repeat: -1
        });
    };

    useEffect(() => {
        if (!holderRef.current) return;
        
        // Initial rotation state
        gsap.set(holderRef.current, { rotationX: 16, rotationY: 0, rotationZ: 0 });
        startSpinning();

        return () => {
            spinTweenRef.current?.kill();
        };
    }, []);

    const handleMouseEnter = () => {
        if (clicked || !holderRef.current || !frontRef.current) return;
        setIsHovered(true);

        // Pause continuous spinning
        spinTweenRef.current?.pause();
        
        const currentRotY = gsap.getProperty(holderRef.current, "rotationY") as number;
        const targetRotY = Math.round(currentRotY / 360) * 360;

        gsap.killTweensOf(holderRef.current);
        gsap.killTweensOf(frontRef.current);

        // Hover Effect: Face camera, slight tilt, zoom slightly
        gsap.to(holderRef.current, {
            rotationX: 10,
            rotationY: targetRotY,
            rotationZ: -3, // Slight 2D tilt
            scale: 1.3,
            duration: 0.6,
            ease: "power2.out"
        });

        // Hover Effect: Open front cover
        gsap.set(frontRef.current, { transformOrigin: "left center" });
        gsap.to(frontRef.current, {
            rotationY: -140,
            duration: 0.6,
            ease: "power2.out",
            delay: 0.1
        });
    };

    const handleMouseLeave = () => {
        if (clicked || !holderRef.current || !frontRef.current) return;
        setIsHovered(false);

        gsap.killTweensOf(holderRef.current);
        gsap.killTweensOf(frontRef.current);

        // Close front cover
        gsap.to(frontRef.current, {
            rotationY: 0,
            duration: 0.5,
            ease: "power2.inOut"
        });

        // Return to normal spinning position
        gsap.to(holderRef.current, {
            rotationX: 16,
            rotationZ: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
                if (!clicked) {
                    startSpinning();
                }
            }
        });
    };

    const handleNext = () => {
        if (clicked || !holderRef.current || !frontRef.current || !wrapperRef.current) return;
        setClicked(true);

        // Stop all current animations
        spinTweenRef.current?.kill();
        gsap.killTweensOf(holderRef.current);
        gsap.killTweensOf(frontRef.current);
        gsap.killTweensOf(pagesRef.current);

        const currentRotY = gsap.getProperty(holderRef.current, "rotationY") as number;
        const targetRotY = Math.round(currentRotY / 360) * 360;

        const tl = gsap.timeline({
            onComplete: () => {
                onClick?.();
            }
        });

        // 1. Reset tilt (face front) and CLOSE the book quickly
        tl.to(holderRef.current, {
            rotationX: 0,
            rotationY: targetRotY,
            rotationZ: 0,
            scale: 1, // Shrink slightly to prepare for the big zoom
            duration: 0.5,
            ease: "power2.inOut"
        });

        tl.to(frontRef.current, {
            rotationY: 0,
            duration: 0.5,
            ease: "power2.inOut"
        }, "<"); // Run simultaneously with holder reset

        // 2. Zoom in closer strongly after a dramatic pause
        tl.to(holderRef.current, {
            scale: 3, 
            duration: 1.2,
            ease: "power2.inOut"
        }, "+=0.15");

        // 3. Open the front cover fully while zooming
        gsap.set(frontRef.current, { transformOrigin: "left center" });
        tl.to(frontRef.current, {
            rotationY: -160,
            duration: 1.0,
            ease: "power2.inOut"
        }, "-=1.0");

        // 4. Flip multiple pages sequentially
        pagesRef.current.forEach((page, i) => {
            if (!page) return;
            gsap.set(page, { transformOrigin: "left center" });
            tl.to(page, {
                rotationY: -155 + (i * 4), 
                duration: 1.0,
                ease: "power2.inOut"
            }, `-=${1.0 - (i * 0.05)}`); // Staggered start
        });

        // 5. Fade out to transition into Scene 2
        tl.to(wrapperRef.current, {
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut"
        }, "-=0.5");
    };

    return (
        <div className={styles.spinWrapper} ref={wrapperRef}>
            <div className={styles.bg}></div>
            <div className={styles.container}>
                <div
                    className={styles.boxHolder}
                    ref={holderRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    role="presentation"
                    aria-label="Buku Berputar"
                >
                    {/* Halaman-halaman buku di dalam box */}
                    {[...Array(6)].map((_, i) => (
                        <div 
                            key={`page-${i}`}
                            className={styles.boxPage}
                            ref={(el) => { pagesRef.current[i] = el; }}
                            style={{
                                transform: `translate3d(calc(var(--box-width) * -0.5), calc(var(--box-height) * -0.5), calc(var(--box-depth) * -${(i + 1) * 0.15}))`
                            }}
                        >
                            {i === 0 && (
                                <LetterContent 
                                    isHovered={isHovered} 
                                    onComplete={() => {}} 
                                    onNext={handleNext} 
                                />
                            )}
                        </div>
                    ))}

                    <div className={styles.boxFront} ref={frontRef}></div>
                    <div className={styles.boxSideLeft}></div>
                    <div className={styles.boxSideRight}></div>
                    <div className={styles.boxTop}></div>
                    <div className={styles.boxBottom}></div>
                    <div className={styles.boxBack}></div>
                </div>
            </div>
        </div>
    );
}
