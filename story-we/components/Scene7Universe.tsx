"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene7UniverseProps {
    isActive?: boolean;
    onNext?: () => void;
    onPrev?: () => void;
}

const AsteriskStar = ({ color, size }: { color: string, size: number }) => (
    <svg viewBox="0 0 20 20" width={size} height={size}>
        <path d="M 10 2 L 10 18 M 2 10 L 18 10 M 4 4 L 16 16 M 4 16 L 16 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const FourPointStar = ({ color, size }: { color: string, size: number }) => (
    <svg viewBox="0 0 20 20" width={size} height={size}>
        <path d="M 10 0 Q 10 10 20 10 Q 10 10 10 20 Q 10 10 0 10 Q 10 10 10 0 Z" fill={color} />
    </svg>
);

const HandDrawnStar = ({ color, size }: { color: string, size: number }) => (
    <svg viewBox="0 0 20 20" width={size} height={size}>
        <path d="M 10 1 L 13 18 L 1 7 L 19 7 L 7 18 Z" fill="none" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
);

export default function Scene7Universe({ onNext, onPrev, isActive = true }: Scene7UniverseProps) {
    const pageRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const starsRef = useRef<HTMLDivElement>(null);
    const kataKataRef = useRef<HTMLImageElement>(null);
    const hoverBlueRef = useRef<HTMLDivElement>(null);
    const arrowBlueRef = useRef<HTMLDivElement>(null);

    // Positions and types for stars (right page)
    const starData = [
        { top: '8%', left: '10%', type: 'asterisk', color: '#4e7cc4', size: 16 },
        { top: '12%', left: '40%', type: 'fourpoint', color: '#f6da73', size: 10 },
        { top: '10%', left: '70%', type: 'handdrawn', color: '#4e7cc4', size: 14 },
        { top: '18%', left: '85%', type: 'asterisk', color: '#4e7cc4', size: 12 },
        { top: '25%', left: '20%', type: 'handdrawn', color: '#4e7cc4', size: 12 },
        { top: '30%', left: '60%', type: 'asterisk', color: '#f6da73', size: 14 },
        { top: '28%', left: '80%', type: 'fourpoint', color: '#4e7cc4', size: 16 },
        { top: '40%', left: '15%', type: 'asterisk', color: '#4e7cc4', size: 18 },
        { top: '45%', left: '85%', type: 'asterisk', color: '#4e7cc4', size: 10 },
        { top: '55%', left: '10%', type: 'fourpoint', color: '#f6da73', size: 12 },
        { top: '65%', left: '30%', type: 'handdrawn', color: '#4e7cc4', size: 16 },
        { top: '60%', left: '70%', type: 'asterisk', color: '#4e7cc4', size: 15 },
        { top: '75%', left: '15%', type: 'asterisk', color: '#f6da73', size: 10 },
        { top: '70%', left: '80%', type: 'fourpoint', color: '#f6da73', size: 12 },
        { top: '85%', left: '40%', type: 'asterisk', color: '#4e7cc4', size: 14 },
        { top: '80%', left: '60%', type: 'handdrawn', color: '#4e7cc4', size: 18 },
        { top: '90%', left: '85%', type: 'asterisk', color: '#4e7cc4', size: 12 },
    ];

    useEffect(() => {
        if (!isActive) return;
        const tl = gsap.timeline();

        // 1. Fade in the text
        if (textRef.current) {
            tl.fromTo(textRef.current.children,
                { opacity: 0, scale: 0.9, y: 10 },
                { opacity: 1, scale: 1, y: 0, duration: 1, stagger: 0.4, ease: 'back.out(1.5)' },
                0.2
            );
        }

        // 2. Pop in the left-page images: katakata, hoverBlue, arrowBlue
        gsap.set([kataKataRef.current, hoverBlueRef.current, arrowBlueRef.current], { opacity: 1 });
        if (kataKataRef.current) {
            tl.fromTo(kataKataRef.current,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
                0.4
            );
        }
        if (hoverBlueRef.current) {
            tl.fromTo(hoverBlueRef.current,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
                0.7
            );
        }
        if (arrowBlueRef.current) {
            tl.fromTo(arrowBlueRef.current,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
                1.0
            );
        }

        // 3. Pop in the stars and add subtle twinkle
        if (starsRef.current) {
            const stars = starsRef.current.children;
            tl.fromTo(stars,
                { opacity: 0, scale: 0, rotation: -45 },
                { opacity: 1, scale: 1, rotation: 0, duration: 0.6, stagger: 0.05, ease: 'back.out(2)' },
                1.0
            );

            // Twinkle effect
            gsap.to(stars, {
                opacity: 0.4,
                scale: 0.8,
                duration: 1.5,
                stagger: {
                    each: 0.2,
                    repeat: -1,
                    yoyo: true
                },
                ease: 'sine.inOut'
            });
        }

        return () => { tl.kill(); };
    }, []);

    return (
        <>
            {isActive && onPrev && (
                <div className={styles.navBtnWrapperLeft}>
                    <button className={`${styles.navBtn} ${styles.navBtnPrev}`} onClick={onPrev}>
                        <div className={styles.navBtnInner}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" height="25px" width="25px">
                                <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" fill="#000" />
                                <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" fill="#000" />
                            </svg>
                        </div>
                        <p className={styles.navBtnText}>Go Back</p>
                    </button>
                </div>
            )}

            {isActive && onNext && (
                <div className={styles.navBtnWrapperRight}>
                    <button className={`${styles.navBtn} ${styles.navBtnNext}`} onClick={onNext}>
                        <div className={styles.navBtnInner}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" height="25px" width="25px" style={{ transform: 'rotate(180deg)' }}>
                                <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" fill="#000" />
                                <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" fill="#000" />
                            </svg>
                        </div>
                        <p className={styles.navBtnText}>Selesai</p>
                    </button>
                </div>
            )}

            <div className={styles.bookWrapper} ref={pageRef}>
                {/* ── LEFT PAGE: Kiss Marks ── */}
                <div className={`${styles.pageLeft} ${styles.linedPage}`}>
                    <div className={styles.pageContent} style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999', zIndex: 10 }}>
                            Date:
                        </div>

                        <div style={{ position: 'absolute', inset: 0 }}>
                            {/* Ubah nilai "top" di bawah ini untuk geser naik/turun masing-masing gambar secara independen */}
                            <img
                                ref={kataKataRef}
                                src="/animations/katakata.webp"
                                alt="kata-kata"
                                style={{
                                    position: 'absolute',
                                    top: '2%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '85%',
                                    height: 'auto',
                                }}
                            />
                            <div
                                ref={hoverBlueRef}
                                style={{
                                    position: 'absolute',
                                    bottom: '5%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '55%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <img
                                    src="/animations/hoverBlue.webp"
                                    alt=""
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    fontFamily: 'var(--font-serif)',
                                    fontSize: 'clamp(1rem, 3vw, 1.8rem)',
                                    color: '#f6da73',
                                    textAlign: 'center',
                                    letterSpacing: '2px',
                                    zIndex: 10,
                                    transform: 'rotate(-4deg)',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                                }}>
                                    KAMU ITU
                                </div>
                            </div>
                            <div
                                ref={arrowBlueRef}
                                style={{
                                    position: 'absolute',
                                    bottom: '2%',
                                    left: '70%',
                                    transform: 'translateX(-50%)',
                                    width: '45%',
                                }}
                            >
                                <div style={{ animation: 'steerShake 2.5s steps(4, jump-none) infinite', display: 'flex', justifyContent: 'center' }}>
                                    <img
                                        src="/animations/ArrowBlue.webp"
                                        alt=""
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            transform: 'rotate(-40deg)',
                                            transformOrigin: 'center center'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PAGE: Universe Text & Stars ── */}
                <div className={`${styles.dummyPage} ${styles.linedPage}`} style={{ zIndex: 10 }}>
                    <div className={styles.pageContent} style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999', zIndex: 10 }}>
                            Date:
                        </div>

                        {/* Stars */}
                        <div ref={starsRef} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
                            {starData.map((s, i) => (
                                <div key={i} style={{
                                    position: 'absolute',
                                    top: s.top,
                                    left: s.left,
                                    transform: 'translate(-50%, -50%)'
                                }}>
                                    {s.type === 'asterisk' && <AsteriskStar color={s.color} size={s.size} />}
                                    {s.type === 'fourpoint' && <FourPointStar color={s.color} size={s.size} />}
                                    {s.type === 'handdrawn' && <HandDrawnStar color={s.color} size={s.size} />}
                                </div>
                            ))}
                        </div>

                        {/* Text */}
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '2rem' }}>
                            <div ref={textRef} style={{
                                fontFamily: 'var(--font-serif)',
                                fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
                                color: '#4e7cc4',
                                textAlign: 'center',
                                textTransform: 'uppercase',
                                letterSpacing: '4px',
                                lineHeight: '1.2',
                                textShadow: '2px 2px 0px rgba(78, 124, 196, 0.2)',
                                animation: 'jerkyShake 2.5s steps(4, jump-none) infinite 0.1s'
                            }}>
                                <div>MY</div>
                                <div>UNIVERSE</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <style>{`
                @keyframes jerkyShake {
                    0%   { transform: translate(0, 0) rotate(0deg); }
                    25%  { transform: translate(-3px, 2px) rotate(-1.5deg); }
                    50%  { transform: translate(3px, -2px) rotate(1deg); }
                    75%  { transform: translate(1.5px, 3px) rotate(-1deg); }
                    100% { transform: translate(0, 0) rotate(0deg); }
                }
                @keyframes steerShake {
                    0%   { transform: rotate(0deg); }
                    25%  { transform: rotate(14deg); }
                    50%  { transform: rotate(0deg); }
                    75%  { transform: rotate(-14deg); }
                    100% { transform: rotate(0deg); }
                }
            `}</style>
        </>
    );
}