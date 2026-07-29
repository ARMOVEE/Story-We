"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene7UniverseProps {
    onNext?: () => void;
    onPrev?: () => void;
}

const KissMark = ({ color = "#e8a5a5", size = 40 }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ opacity: 0.25 }}>
        {/* Upper lip */}
        <path d="M 15 50 C 30 25, 45 45, 50 50 C 55 45, 70 25, 85 50 C 70 58, 55 52, 50 52 C 45 52, 30 58, 15 50 Z" fill={color} style={{ mixBlendMode: 'multiply' }} />
        {/* Lower lip */}
        <path d="M 15 55 C 35 85, 65 85, 85 55 C 65 65, 35 65, 15 55 Z" fill={color} style={{ mixBlendMode: 'multiply' }} />
    </svg>
);

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

export default function Scene7Universe({ onNext, onPrev }: Scene7UniverseProps) {
    const pageRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const starsRef = useRef<HTMLDivElement>(null);
    const kissesRef = useRef<HTMLDivElement>(null);

    // Positions for kiss marks (left page)
    const kissPositions = [
        { top: '10%', left: '15%', rot: -15, scale: 1.2 },
        { top: '25%', left: '40%', rot: 10, scale: 0.9 },
        { top: '15%', left: '70%', rot: 25, scale: 1.1 },
        { top: '40%', left: '20%', rot: -5, scale: 1.3 },
        { top: '45%', left: '60%', rot: -20, scale: 1.0 },
        { top: '65%', left: '15%', rot: 15, scale: 1.1 },
        { top: '60%', left: '75%', rot: 5, scale: 0.8 },
        { top: '80%', left: '45%', rot: -10, scale: 1.2 },
        { top: '85%', left: '20%', rot: 20, scale: 0.9 },
        { top: '80%', left: '80%', rot: -25, scale: 1.0 },
    ];

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
        const tl = gsap.timeline();

        // 1. Fade in the text
        if (textRef.current) {
            tl.fromTo(textRef.current.children,
                { opacity: 0, scale: 0.9, y: 10 },
                { opacity: 1, scale: 1, y: 0, duration: 1, stagger: 0.4, ease: 'back.out(1.5)' },
                0.2
            );
        }

        // 2. Pop in the kiss marks on the left page
        if (kissesRef.current) {
            tl.fromTo(kissesRef.current.children,
                { opacity: 0, scale: 0.5 },
                { opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' },
                0.5
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
            {onPrev && (
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

            {onNext && (
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

                        <div ref={kissesRef} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
                            {kissPositions.map((k, i) => (
                                <div key={i} style={{
                                    position: 'absolute',
                                    top: k.top,
                                    left: k.left,
                                    transform: `translate(-50%, -50%) rotate(${k.rot}deg) scale(${k.scale})`
                                }}>
                                    <KissMark size={80} />
                                </div>
                            ))}
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
                                fontFamily: 'var(--font-handwriting)',
                                fontSize: '1.8rem',
                                color: '#333',
                                textAlign: 'center',
                                textTransform: 'uppercase',
                                letterSpacing: '4px',
                                lineHeight: '2.5'
                            }}>
                                <div>YOU ARE</div>
                                <div>MY</div>
                                <div>UNIVERSE</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
