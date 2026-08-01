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

function LetterContent({
    isHovered,
    onComplete,
    onNext,
    onButtonHoverStart,
    onButtonHoverEnd,
}: {
    isHovered: boolean,
    onComplete: () => void,
    onNext: () => void,
    onButtonHoverStart: () => void,
    onButtonHoverEnd: () => void,
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
            }, 35);
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
                onMouseEnter={onButtonHoverStart}
                onMouseLeave={onButtonHoverEnd}
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
    const cornerImageRef = useRef<HTMLDivElement>(null);
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
        gsap.set(holderRef.current, { rotationX: 16, rotationY: 0, rotationZ: 0 });
        startSpinning();

        // Corner image starts fully hidden, tucked toward bottom-right off-screen
        if (cornerImageRef.current) {
            gsap.set(cornerImageRef.current, {
                opacity: 0,
                scale: 0.6,
                x: 80,
                y: 40,
                rotation: -12,
            });
        }

        return () => {
            spinTweenRef.current?.kill();
        };
    }, []);

    const handleMouseEnter = () => {
        if (clicked || !holderRef.current || !frontRef.current) return;
        setIsHovered(true);

        spinTweenRef.current?.pause();

        const currentRotY = gsap.getProperty(holderRef.current, "rotationY") as number;
        const targetRotY = Math.round(currentRotY / 360) * 360;

        gsap.killTweensOf(holderRef.current);
        gsap.killTweensOf(frontRef.current);

        gsap.to(holderRef.current, {
            rotationX: 10,
            rotationY: targetRotY,
            rotationZ: -3,
            scale: 1.3,
            duration: 0.6,
            ease: "power2.out"
        });

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

        gsap.to(frontRef.current, {
            rotationY: 0,
            duration: 0.5,
            ease: "power2.inOut"
        });

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

    // Triggered when cursor enters the "CLICK HERE" button
    const handleButtonHoverStart = () => {
        if (!cornerImageRef.current || clicked) return;
        gsap.killTweensOf(cornerImageRef.current);
        gsap.to(cornerImageRef.current, {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            rotation: 0,
            duration: 0.7,
            ease: "back.out(1.6)",
        });
    };

    // Triggered when cursor leaves the "CLICK HERE" button
    const handleButtonHoverEnd = () => {
        if (!cornerImageRef.current || clicked) return;
        gsap.killTweensOf(cornerImageRef.current);
        gsap.to(cornerImageRef.current, {
            opacity: 0,
            scale: 0.6,
            x: 80,
            y: 40,
            rotation: -12,
            duration: 0.5,
            ease: "power2.in",
        });
    };

    const handleNext = () => {
        if (clicked || !holderRef.current || !frontRef.current || !wrapperRef.current) return;
        setClicked(true);

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
            scale: 1,
            duration: 0.5,
            ease: "power2.inOut"
        }, 0);

        tl.to(frontRef.current, {
            rotationY: 0,
            duration: 0.5,
            ease: "power2.inOut"
        }, "<");

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
            }, `-=${1.0 - (i * 0.05)}`);
        });

        // 5. Corner image fades out as the scene transitions
        if (cornerImageRef.current) {
            tl.to(cornerImageRef.current, {
                opacity: 0,
                scale: 0.7,
                duration: 0.5,
                ease: "power1.in",
            }, "-=0.8");
        }

        // 6. Fade out to transition into Scene 2
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
                                    onComplete={() => { }}
                                    onNext={handleNext}
                                    onButtonHoverStart={handleButtonHoverStart}
                                    onButtonHoverEnd={handleButtonHoverEnd}
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

            {/* Corner reveal image — always mounted, hidden via opacity until button is hovered */}
            <div
                ref={cornerImageRef}
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    zIndex: 200,
                    pointerEvents: 'none',
                    opacity: 0,
                }}
            >
                <img
                    src="/animations/spinningbook.png"
                    alt=""
                    style={{
                        maxWidth: '180px',
                        width: '30vw',
                        height: 'auto',
                        filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.35))',
                    }}
                />
            </div>
        </div>
    );
}