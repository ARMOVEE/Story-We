"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene14QuoteProps {
    onNext?: () => void;
    onPrev?: () => void;
}

export default function Scene14Quote({ onNext, onPrev }: Scene14QuoteProps) {
    const rightTextRef = useRef<HTMLDivElement>(null);
    const underline1Ref = useRef<SVGSVGElement>(null);
    const underline2Ref = useRef<SVGSVGElement>(null);
    const characterRef = useRef<HTMLDivElement>(null);
    const balloonRef = useRef<HTMLDivElement>(null);
    const stampRef = useRef<HTMLDivElement>(null);
    const leftGhostRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline();

        // Left page — faded ghost text from previous page
        if (leftGhostRef.current) {
            tl.fromTo(leftGhostRef.current,
                { opacity: 0 },
                { opacity: 0.12, duration: 1.5 },
                0.3
            );
        }

        // Left page stamp
        if (stampRef.current) {
            tl.fromTo(stampRef.current,
                { opacity: 0, scale: 0.5, rotation: 20 },
                { opacity: 0.15, scale: 1, rotation: -8, duration: 0.5, ease: 'back.out(1.5)' },
                1.0
            );
        }

        // Right page text lines
        if (rightTextRef.current) {
            tl.fromTo(rightTextRef.current.children,
                { opacity: 0, x: -15 },
                { opacity: 1, x: 0, duration: 0.6, stagger: 0.5 },
                1.5
            );
        }

        // Red underlines drawn in
        if (underline1Ref.current) {
            const path1 = underline1Ref.current.querySelector('path');
            tl.fromTo(path1,
                { strokeDasharray: 300, strokeDashoffset: 300 },
                { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' },
                3.0
            );
        }

        if (underline2Ref.current) {
            const path2 = underline2Ref.current.querySelector('path');
            tl.fromTo(path2,
                { strokeDasharray: 300, strokeDashoffset: 300 },
                { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' },
                3.4
            );
        }

        // Balloon floats up first
        if (balloonRef.current) {
            tl.fromTo(balloonRef.current,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
                4.5
            );
            // Gentle floating loop
            gsap.to(balloonRef.current, {
                y: -6,
                repeat: -1,
                yoyo: true,
                duration: 2,
                ease: 'sine.inOut',
                delay: 5.5
            });
        }

        // Character pops in
        if (characterRef.current) {
            tl.fromTo(characterRef.current,
                { opacity: 0, y: 20, scale: 0.7 },
                { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(2)' },
                5.0
            );
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
                        <p className={styles.navBtnText}>Kembali</p>
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
                        <p className={styles.navBtnText}>Lanjutkan</p>
                    </button>
                </div>
            )}

            <div className={styles.bookWrapper}>
                {/* ── LEFT PAGE ── */}
                <div className={`${styles.pageLeft} ${styles.linedPage}`}>
                    <div className={styles.pageContent} style={{ position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999' }}>
                            Date:
                        </div>

                        {/* Ghost text from previous page (mirrored/faded) */}
                        <div ref={leftGhostRef} style={{
                            position: 'absolute', top: '4rem', left: '1.5rem', right: '1.5rem',
                            fontFamily: 'var(--font-handwriting)', fontSize: '1.2rem', color: '#666',
                            transform: 'scaleX(-1)', opacity: 0, lineHeight: '2.2rem',
                        }}>
                            <div>Menuju Perasaan Baruku yang</div>
                            <div style={{ marginLeft: '2rem' }}>Pertama</div>
                        </div>

                        {/* Faded circular stamp */}
                        <div ref={stampRef} style={{
                            position: 'absolute', top: '45%', left: '50%',
                            transform: 'translate(-50%, -50%) rotate(-8deg)',
                            width: '120px', height: '120px', opacity: 0,
                        }}>
                            <svg viewBox="0 0 120 120" width="100%" height="100%">
                                <circle cx="60" cy="60" r="50" fill="none" stroke="#999" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.5" />
                                <circle cx="60" cy="60" r="42" fill="none" stroke="#999" strokeWidth="1.5" opacity="0.4" />
                                <text x="60" y="52" textAnchor="middle" fontFamily="var(--font-handwriting)" fontSize="9" fill="#999" opacity="0.5">STORY</text>
                                <text x="60" y="65" textAnchor="middle" fontFamily="var(--font-handwriting)" fontSize="7" fill="#999" opacity="0.4">Memories</text>
                                <text x="60" y="78" textAnchor="middle" fontFamily="var(--font-handwriting)" fontSize="6" fill="#999" opacity="0.3">forever</text>
                            </svg>
                        </div>

                        {/* Faint bleed-through text at bottom */}
                        <div style={{
                            position: 'absolute', bottom: '3rem', left: '1.5rem', right: '1.5rem',
                            fontFamily: 'var(--font-handwriting)', fontSize: '0.9rem', color: '#bbb',
                            transform: 'scaleX(-1)', opacity: 0.08, lineHeight: '2rem',
                        }}>
                            <div>Sampai jam berapun alarm berbunyi</div>
                            <div>Bintang selalu malam jadi terang</div>
                            <div>Kamu adalah bintang paling terang</div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PAGE ── */}
                <div className={`${styles.dummyPage} ${styles.linedPage}`} style={{ zIndex: 10 }}>
                    <div className={styles.pageContent} style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999' }}>
                            Date:
                        </div>

                        <div style={{ padding: '5.5rem 2.5rem 2rem 2.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>

                            {/* Main quote text */}
                            <div ref={rightTextRef} style={{
                                fontFamily: 'var(--font-handwriting)', fontSize: '1.5rem', color: '#333',
                                display: 'flex', flexDirection: 'column', gap: '1.6rem',
                                lineHeight: '1.8',
                            }}>
                                {/* Line 1: "Jatuh cinta sama kamu" — "cinta sama kamu" underlined red */}
                                <div style={{ position: 'relative' }}>
                                    Jatuh <span style={{ position: 'relative', display: 'inline' }}>
                                        cinta sama kamu
                                        <svg ref={underline1Ref} style={{ position: 'absolute', bottom: '-4px', left: '-2px', width: '100%', height: '8px', overflow: 'visible', pointerEvents: 'none' }}>
                                            <path d="M 0 4 Q 40 1, 80 5 T 160 3 T 220 4" fill="none" stroke="#e74c3c" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                                        </svg>
                                    </span>
                                </div>

                                {/* Line 2: "adalah ketidaksengajaan yang" — "ketidaksengajaan yang" underlined red */}
                                <div style={{ position: 'relative' }}>
                                    adalah <span style={{ position: 'relative', display: 'inline' }}>
                                        ketidaksengajaan yang
                                        <svg ref={underline2Ref} style={{ position: 'absolute', bottom: '-4px', left: '-2px', width: '100%', height: '8px', overflow: 'visible', pointerEvents: 'none' }}>
                                            <path d="M 0 4 Q 50 1, 100 5 T 200 3 T 280 4" fill="none" stroke="#e74c3c" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                                        </svg>
                                    </span>
                                </div>

                                {/* Line 3 */}
                                <div>lebih indah dari ribuan hal</div>

                                {/* Line 4 */}
                                <div>yang pernah aku rencanakan</div>
                            </div>

                            {/* Cute character holding heart balloon */}
                            <div style={{ marginTop: 'auto', marginBottom: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', position: 'relative', height: '180px' }}>

                                {/* Heart balloon */}
                                <div ref={balloonRef} style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-30%)' }}>
                                    {/* Balloon string */}
                                    <svg width="60" height="180" viewBox="0 0 60 180" style={{ position: 'absolute', top: '45px', left: '17px', zIndex: 1 }}>
                                        <path d="M 22 0 C 25 40, 15 70, 20 120" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    {/* Heart shape */}
                                    <svg width="65" height="60" viewBox="0 0 100 90" style={{ position: 'relative', zIndex: 2 }}>
                                        <path
                                            d="M 50 85 C 50 85, 5 55, 5 30 C 5 10, 25 0, 50 25 C 75 0, 95 10, 95 30 C 95 55, 50 85, 50 85 Z"
                                            fill="#e74c3c" stroke="#c0392b" strokeWidth="2"
                                        />
                                        {/* Shine highlight */}
                                        <ellipse cx="30" cy="28" rx="8" ry="10" fill="rgba(255,255,255,0.3)" transform="rotate(-20 30 28)" />
                                        {/* Small face on heart */}
                                        <circle cx="42" cy="38" r="2" fill="#333" />
                                        <circle cx="58" cy="38" r="2" fill="#333" />
                                    </svg>
                                </div>

                                {/* Stick figure character */}
                                <div ref={characterRef} style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-25%)' }}>
                                    <svg width="55" height="75" viewBox="0 0 80 100">
                                        {/* Head */}
                                        <circle cx="40" cy="30" r="18" fill="#FDEBD0" stroke="#888" strokeWidth="2" />
                                        {/* Eyes — happy */}
                                        <circle cx="34" cy="28" r="2.5" fill="#333" />
                                        <circle cx="46" cy="28" r="2.5" fill="#333" />
                                        {/* Smile */}
                                        <path d="M 34 36 Q 40 42, 46 36" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                                        {/* Blush */}
                                        <ellipse cx="28" cy="34" rx="5" ry="3" fill="#FADBD8" opacity="0.7" />
                                        <ellipse cx="52" cy="34" rx="5" ry="3" fill="#FADBD8" opacity="0.7" />
                                        {/* Body */}
                                        <line x1="40" y1="48" x2="40" y2="72" stroke="#888" strokeWidth="2.5" strokeLinecap="round" />
                                        {/* Arms — right arm holding balloon string up */}
                                        <path d="M 40 56 L 20 65" stroke="#888" strokeWidth="2.5" strokeLinecap="round" />
                                        <path d="M 40 56 L 58 42" stroke="#888" strokeWidth="2.5" strokeLinecap="round" />
                                        {/* Legs */}
                                        <path d="M 40 72 L 28 92" stroke="#888" strokeWidth="2.5" strokeLinecap="round" />
                                        <path d="M 40 72 L 52 92" stroke="#888" strokeWidth="2.5" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
