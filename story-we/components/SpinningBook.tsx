"use client";

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

// ── Transisi "liquid blob burst" — beberapa blob organik membesar
//    bergantian dengan efek wobble, lalu semburan hati kecil pas layar
//    tertutup penuh, baru mengecil lagi membuka scene baru. Murni
//    CSS/GSAP, tidak butuh file video. ──
const BLOB_COLORS = ['#ff8fb3', '#e8729a', '#d1567f', '#c94f77'];

const HEART_PATH = 'M12 21s-6.7-4.35-9.3-8.1C1 10.6 1.4 7.4 4 5.6c2.1-1.4 4.7-.9 6.2 1 .6.7 1.1 1.5 1.8 1.5s1.2-.8 1.8-1.5c1.5-1.9 4.1-2.4 6.2-1 2.6 1.8 3 5 1.3 7.3C18.7 16.65 12 21 12 21z';

function IrisTransitionOverlay({ active, onDone }: { active: boolean; onDone: () => void }) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const blobRefs = useRef<(HTMLDivElement | null)[]>([]);
    const heartsRef = useRef<HTMLDivElement>(null);
    const hasRun = useRef(false);

    useEffect(() => {
        if (!active || hasRun.current) return;
        hasRun.current = true;

        const overlay = overlayRef.current;
        const blobs = blobRefs.current.filter(Boolean) as HTMLDivElement[];
        const hearts = heartsRef.current;
        if (!overlay || blobs.length === 0) return;

        gsap.set(overlay, { display: 'block' });
        gsap.set(blobs, { scale: 0, opacity: 1, borderRadius: '50%' });

        const diagonal = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
        const targetScale = (diagonal / 40) * 1.25;

        const tl = gsap.timeline();

        // Fase 1: blob-blob membesar bergantian (stagger), bikin efek "menyusul"
        // bukan bareng-bareng, jadi kelihatan lebih dinamis/cair.
        blobs.forEach((blob, i) => {
            tl.to(blob, {
                scale: targetScale,
                duration: 0.55,
                ease: 'power2.in',
            }, i * 0.08);

            // Sedikit wobble pada border-radius selama membesar → kesan cair
            tl.to(blob, {
                borderRadius: '46% 54% 60% 40% / 55% 45% 55% 45%',
                duration: 0.55,
                ease: 'power1.inOut',
            }, i * 0.08);
        });

        // Fase 2: layar tertutup penuh — semburkan hati kecil, lalu ganti scene
        if (hearts) {
            const heartEls = hearts.children;
            gsap.set(heartEls, { opacity: 0, scale: 0 });
            tl.to(heartEls, {
                opacity: 1,
                scale: (i: number) => 0.6 + Math.random() * 0.6,
                x: (i: number) => (Math.random() - 0.5) * 260,
                y: (i: number) => -40 - Math.random() * 160,
                rotation: (i: number) => (Math.random() - 0.5) * 60,
                duration: 0.5,
                stagger: 0.04,
                ease: 'back.out(1.8)',
            }, '+=0.05');
        }

        tl.call(() => onDone());
        tl.to({}, { duration: 0.35 });

        if (hearts) {
            tl.to(hearts.children, {
                opacity: 0,
                duration: 0.25,
            }, '<');
        }

        // Fase 3: blob-blob mengecil lagi (urutan dibalik), membuka scene baru
        [...blobs].reverse().forEach((blob, i) => {
            tl.to(blob, {
                scale: 0,
                borderRadius: '50%',
                duration: 0.5,
                ease: 'power2.out',
            }, `>-${i === 0 ? 0 : 0.4}`);
        });

        tl.set(overlay, { display: 'none' });
    }, [active, onDone]);

    return (
        <div
            ref={overlayRef}
            style={{
                display: 'none',
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                pointerEvents: 'none',
                overflow: 'hidden',
            }}
        >
            {BLOB_COLORS.map((color, i) => (
                <div
                    key={i}
                    ref={(el) => { blobRefs.current[i] = el; }}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '40px',
                        height: '40px',
                        marginTop: '-20px',
                        marginLeft: '-20px',
                        background: `radial-gradient(circle, ${color} 0%, ${color} 100%)`,
                        transform: 'scale(0)',
                        willChange: 'transform, border-radius',
                    }}
                />
            ))}

            {/* Semburan hati kecil di tengah layar saat tertutup penuh */}
            <div
                ref={heartsRef}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 0,
                    height: 0,
                    zIndex: 2,
                }}
            >
                {Array.from({ length: 10 }).map((_, i) => (
                    <svg
                        key={i}
                        viewBox="0 0 24 24"
                        width="26"
                        height="26"
                        style={{ position: 'absolute', left: '-13px', top: '-13px' }}
                    >
                        <path d={HEART_PATH} fill="#fff" opacity="0.95" />
                    </svg>
                ))}
            </div>
        </div>
    );
}

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
    const [transitionActive, setTransitionActive] = useState(false);
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

        if (cornerImageRef.current) {
            gsap.to(cornerImageRef.current, { opacity: 0, duration: 0.3, ease: 'power1.in' });
        }

        setTransitionActive(true);
    };

    const handleTransitionDone = () => {
        onClick?.();
    };

    return (
        <>
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

            <IrisTransitionOverlay active={transitionActive} onDone={handleTransitionDone} />
        </>
    );
}