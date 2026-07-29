"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene9GlobeProps {
    onNext?: () => void;
}

export default function Scene9Globe({ onNext }: Scene9GlobeProps) {
    const textLeftRef = useRef<HTMLDivElement>(null);
    const textRightRef = useRef<HTMLDivElement>(null);
    const globeRef = useRef<SVGSVGElement>(null);
    const leftLegRef = useRef<SVGGElement>(null);
    const rightLegRef = useRef<SVGGElement>(null);
    const bubbleRef = useRef<HTMLDivElement>(null);
    const highlightRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const tl = gsap.timeline();

        // Left text animation
        if (textLeftRef.current) {
            tl.fromTo(textLeftRef.current.children,
                { opacity: 0, y: 10, rotation: -2 },
                { opacity: 1, y: 0, rotation: 0, duration: 0.8, stagger: 0.4, ease: 'power2.out' }
            );
        }

        // Right text animation
        if (textRightRef.current) {
            tl.fromTo(textRightRef.current.children,
                { opacity: 0, x: -10 },
                { opacity: 1, x: 0, duration: 0.5, stagger: 0.3, ease: 'power1.out' },
                "-=0.5"
            );
        }

        // Highlights (Red line, yellow circle)
        if (highlightRef.current) {
            const paths = highlightRef.current.querySelectorAll('path');
            tl.fromTo(paths,
                { strokeDasharray: 200, strokeDashoffset: 200 },
                { strokeDashoffset: 0, duration: 0.6, stagger: 0.4, ease: 'power2.out' },
                "-=0.2"
            );
        }

        // Globe and character pop in
        tl.fromTo([globeRef.current, leftLegRef.current, rightLegRef.current],
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)' },
            "-=0.5"
        );

        // Walking Animation
        if (leftLegRef.current && rightLegRef.current) {
            gsap.fromTo(leftLegRef.current,
                { rotation: -25 },
                { rotation: 25, transformOrigin: 'top center', repeat: -1, yoyo: true, duration: 0.35, ease: 'sine.inOut' }
            );
            gsap.fromTo(rightLegRef.current,
                { rotation: 25 },
                { rotation: -25, transformOrigin: 'top center', repeat: -1, yoyo: true, duration: 0.35, ease: 'sine.inOut' }
            );
        }

        // Globe Rotation
        if (globeRef.current) {
            gsap.to(globeRef.current, {
                rotation: -360,
                transformOrigin: 'center center',
                repeat: -1,
                duration: 6,
                ease: 'none'
            });
        }

        // Speech Bubble Pop
        if (bubbleRef.current) {
            tl.fromTo(bubbleRef.current,
                { opacity: 0, scale: 0, transformOrigin: 'bottom left' },
                { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' },
                "+=1.0"
            );
            
            // Subtle floating of bubble
            gsap.to(bubbleRef.current, {
                y: -5,
                repeat: -1,
                yoyo: true,
                duration: 1.5,
                ease: 'sine.inOut',
                delay: 3
            });
        }

        return () => { tl.kill(); };
    }, []);

    return (
        <>
            {onNext && (
                <div className={styles.navBtnWrapperRight}>
                    <button className={`${styles.navBtn} ${styles.navBtnNext}`} onClick={onNext}>
                        <div className={styles.navBtnInner}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" height="25px" width="25px" style={{ transform: 'rotate(180deg)' }}>
                                <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" fill="#000" />
                                <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" fill="#000" />
                            </svg>
                        </div>
                        <p className={styles.navBtnText}>Lanjutkan</p>
                    </button>
                </div>
            )}

            <div className={styles.bookWrapper}>
                {/* ── LEFT PAGE ── */}
                <div className={`${styles.pageLeft} ${styles.linedPage}`}>
                    <div className={styles.pageContent}>
                        <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999' }}>
                            Date:
                        </div>

                        <div ref={textLeftRef} style={{ marginTop: '4rem', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ fontFamily: 'var(--font-handwriting)', fontSize: '2.5rem', fontWeight: 'bold', color: '#333', letterSpacing: '2px', transform: 'rotate(-2deg)' }}>
                                HEHEHE
                            </div>
                            <div style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.8rem', color: '#333', marginTop: '1rem' }}>
                                Aku tulisin ya
                            </div>
                            <div style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.6rem', color: '#333' }}>
                                Kata-Kata nya....
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PAGE ── */}
                <div className={`${styles.dummyPage} ${styles.linedPage}`} style={{ zIndex: 10 }}>
                    <div className={styles.pageContent} style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999' }}>
                            Date:
                        </div>

                        <div style={{ marginTop: '2.5rem', paddingLeft: '2rem' }}>
                            <div ref={textRightRef} style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.4rem', color: '#333', lineHeight: '2.2' }}>
                                <div style={{ paddingLeft: '2rem' }}>Bumi memiliki</div>
                                <div style={{ paddingLeft: '1rem' }}>banyak orang</div>
                                <div style={{ position: 'relative', display: 'inline-block', paddingLeft: '3rem', color: '#e74c3c' }}>
                                    Hebat
                                    <svg ref={highlightRef} width="80" height="20" style={{ position: 'absolute', bottom: '-5px', left: '2.8rem' }}>
                                        {/* Red underline */}
                                        <path d="M 0 10 Q 30 15, 60 5 T 75 10" fill="none" stroke="#e74c3c" strokeWidth="2.5" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div style={{ paddingLeft: '3.5rem' }}>yaitu...</div>
                                <div style={{ position: 'relative', display: 'inline-block', paddingLeft: '1.5rem', fontWeight: 'bold' }}>
                                    KAMU
                                    <svg ref={highlightRef} width="100" height="50" style={{ position: 'absolute', top: '-10px', left: '0.5rem', overflow: 'visible' }}>
                                        {/* Yellow circle */}
                                        <path d="M 20 25 C 20 5, 80 5, 80 25 C 80 45, 20 45, 20 25 Z" fill="none" stroke="#f1c40f" strokeWidth="2.5" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div style={{ paddingLeft: '2.5rem' }}>salah</div>
                                <div style={{ paddingLeft: '4rem' }}>satunya</div>
                            </div>
                        </div>

                        {/* Illustration Container */}
                        <div style={{ position: 'absolute', bottom: '3rem', right: '3rem', width: '150px', height: '200px' }}>
                            
                            {/* Speech Bubble */}
                            <div ref={bubbleRef} style={{ position: 'absolute', top: '-30px', left: '-120px', zIndex: 15 }}>
                                <svg width="160" height="80" viewBox="0 0 160 80">
                                    <path d="M 10 10 Q 150 10, 150 40 Q 150 60, 100 65 L 120 80 L 80 65 Q 10 60, 10 40 Z" fill="white" stroke="#333" strokeWidth="2" strokeLinejoin="round" />
                                    <text x="75" y="45" fontFamily="var(--font-handwriting)" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#333">
                                        AKU SAYANG REVA!
                                    </text>
                                </svg>
                            </div>

                            {/* Character */}
                            <div style={{ position: 'absolute', top: '35px', left: '60px', zIndex: 10 }}>
                                <svg width="40" height="70" viewBox="0 0 50 100" style={{ overflow: 'visible' }}>
                                    {/* Action lines above head */}
                                    <path d="M 15 5 L 10 -5 M 25 2 L 25 -10 M 35 5 L 40 -5" fill="none" stroke="#f1c40f" strokeWidth="2" strokeLinecap="round" />
                                    
                                    {/* Head */}
                                    <circle cx="25" cy="20" r="8" fill="none" stroke="#333" strokeWidth="2.5" />
                                    {/* Body */}
                                    <line x1="25" y1="28" x2="25" y2="60" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
                                    {/* Arms */}
                                    <line x1="25" y1="40" x2="10" y2="50" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
                                    <line x1="25" y1="40" x2="45" y2="30" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
                                    {/* Legs */}
                                    <g ref={leftLegRef}>
                                        <line x1="25" y1="60" x2="15" y2="90" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
                                    </g>
                                    <g ref={rightLegRef}>
                                        <line x1="25" y1="60" x2="35" y2="90" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
                                    </g>
                                </svg>
                            </div>

                            {/* Globe */}
                            <div style={{ position: 'absolute', bottom: '0', left: '20px', zIndex: 5 }}>
                                <svg ref={globeRef} width="100" height="100" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="#a9c9f5" stroke="#333" strokeWidth="2.5" />
                                    {/* Continents (Hand-drawn style) */}
                                    <path d="M 20 30 C 40 20, 60 40, 50 50 C 40 60, 20 50, 20 30 Z" fill="#8ed18e" stroke="#333" strokeWidth="1.5" strokeLinejoin="round" />
                                    <path d="M 60 20 C 80 15, 90 35, 75 45 C 60 55, 50 40, 60 20 Z" fill="#8ed18e" stroke="#333" strokeWidth="1.5" strokeLinejoin="round" />
                                    <path d="M 30 65 C 50 60, 70 80, 50 90 C 30 100, 20 80, 30 65 Z" fill="#8ed18e" stroke="#333" strokeWidth="1.5" strokeLinejoin="round" />
                                    <path d="M 75 60 C 90 65, 85 85, 70 80 C 60 75, 65 60, 75 60 Z" fill="#8ed18e" stroke="#333" strokeWidth="1.5" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
