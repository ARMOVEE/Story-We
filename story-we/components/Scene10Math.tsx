"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene10MathProps {
    onNext?: () => void;
}

export default function Scene10Math({ onNext }: Scene10MathProps) {
    const textLeftRef = useRef<HTMLDivElement>(null);
    const heartRef = useRef<SVGSVGElement>(null);
    const mathRef = useRef<HTMLDivElement>(null);
    const simpleTextRef = useRef<HTMLDivElement>(null);
    const underlineRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const tl = gsap.timeline();

        // 1. Fade in left page text
        if (textLeftRef.current) {
            tl.fromTo(textLeftRef.current.children,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.3, ease: 'power2.out' },
                0.5
            );
        }

        // 2. Draw Heart
        if (heartRef.current) {
            const heartPath = heartRef.current.querySelector('path');
            tl.fromTo(heartPath,
                { strokeDasharray: 1000, strokeDashoffset: 1000 },
                { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' },
                "+=0.5"
            );
            // subtle heartbeat
            gsap.to(heartRef.current, {
                scale: 1.05,
                repeat: -1,
                yoyo: true,
                duration: 0.8,
                ease: 'sine.inOut',
                delay: 2.5
            });
        }

        // 3. Math equations appear line by line
        if (mathRef.current) {
            tl.fromTo(mathRef.current.children,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 1.2, ease: 'power1.out' },
                "-=0.5"
            );
        }

        // 4. "that Simple" text pops in
        if (simpleTextRef.current) {
            tl.fromTo(simpleTextRef.current.children,
                { opacity: 0, scale: 0.8, rotation: -5 },
                { opacity: 1, scale: 1, rotation: 0, duration: 0.5, stagger: 0.4, ease: 'back.out(2)' },
                "+=0.5"
            );
        }

        // 5. Draw double underline
        if (underlineRef.current) {
            const lines = underlineRef.current.querySelectorAll('path');
            tl.fromTo(lines,
                { strokeDasharray: 100, strokeDashoffset: 100 },
                { strokeDashoffset: 0, duration: 0.4, stagger: 0.2, ease: 'power1.out' },
                "-=0.2"
            );
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

                        <div ref={textLeftRef} style={{ marginTop: '4rem', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.6rem', color: '#333', lineHeight: '1.6' }}>
                            <div>Hai sayang, aku punya</div>
                            <div>rumus matematika nih,</div>
                            <div>mau tau ga?</div>
                            <div>jangan mikir lagi cukup</div>
                            <div>liat saja ya manis ^~^</div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PAGE ── */}
                <div className={`${styles.dummyPage} ${styles.linedPage}`} style={{ zIndex: 10 }}>
                    <div className={styles.pageContent} style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999' }}>
                            Date:
                        </div>

                        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '1rem' }}>
                            
                            {/* Giant Heart Outline */}
                            <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', width: '280px', height: '280px', zIndex: 5 }}>
                                <svg ref={heartRef} viewBox="0 0 300 300" width="100%" height="100%" style={{ overflow: 'visible' }}>
                                    <path 
                                        d="M 150 250 C 150 250, 40 160, 40 90 C 40 40, 110 30, 150 80 C 190 30, 260 40, 260 90 C 260 160, 150 250, 150 250 Z" 
                                        fill="none" 
                                        stroke="#ff6b6b" 
                                        strokeWidth="4" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                    />
                                </svg>
                            </div>

                            {/* Math Equations inside the heart */}
                            <div ref={mathRef} style={{ position: 'relative', zIndex: 10, fontFamily: 'var(--font-handwriting)', fontSize: '1.5rem', color: '#ff6b6b', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '-3rem', letterSpacing: '2px' }}>
                                <div>9x - 7i &gt; 3(3x - 7u)</div>
                                <div>9x - 7i &gt; 9x - 21u</div>
                                <div>-7i &gt; -21u</div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>i &lt; 3 u</div>
                            </div>

                            {/* "that Simple" text below the heart */}
                            <div style={{ marginTop: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', zIndex: 10 }}>
                                <div ref={simpleTextRef} style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ color: '#e67e22', marginLeft: '-4rem', transform: 'rotate(-5deg)' }}>that</div>
                                    <div style={{ color: '#27ae60', letterSpacing: '2px' }}>Simple</div>
                                </div>
                                
                                {/* Blue double underline */}
                                <svg ref={underlineRef} width="120" height="15" viewBox="0 0 120 15" style={{ marginTop: '0.2rem' }}>
                                    <path d="M 5 5 Q 60 2, 115 5" fill="none" stroke="#3498db" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M 10 12 Q 50 15, 100 11" fill="none" stroke="#3498db" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
