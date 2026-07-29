"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene15AdviceProps {
    onNext?: () => void;
    onPrev?: () => void;
}

export default function Scene15Advice({ onNext, onPrev }: Scene15AdviceProps) {
    const rightTextRef = useRef<HTMLDivElement>(null);
    const highlightsRef = useRef<SVGSVGElement>(null);
    const catRef = useRef<HTMLDivElement>(null);
    const ghostRef = useRef<HTMLDivElement>(null);
    const heartGhostRef = useRef<SVGSVGElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline();

        // Left page ghost text
        if (ghostRef.current) {
            tl.fromTo(ghostRef.current,
                { opacity: 0 },
                { opacity: 0.1, duration: 1.2 },
                0.3
            );
        }

        // Left page faded heart
        if (heartGhostRef.current) {
            tl.fromTo(heartGhostRef.current,
                { opacity: 0, scale: 0.8 },
                { opacity: 0.12, scale: 1, duration: 1 },
                0.8
            );
        }

        // Right page — text lines appear one by one
        if (rightTextRef.current) {
            tl.fromTo(rightTextRef.current.children,
                { opacity: 0, x: -12 },
                { opacity: 1, x: 0, duration: 0.5, stagger: 0.6 },
                1.5
            );
        }

        // Blue highlights sweep in
        if (highlightsRef.current) {
            const rects = highlightsRef.current.querySelectorAll('rect');
            tl.fromTo(rects,
                { scaleX: 0, transformOrigin: 'left center' },
                { scaleX: 1, duration: 0.4, stagger: 0.3, ease: 'power2.out' },
                3.0
            );
        }

        // Footer text
        if (footerRef.current) {
            tl.fromTo(footerRef.current,
                { opacity: 0 },
                { opacity: 0.4, duration: 0.8 },
                5.5
            );
        }

        // Cat character pops in
        if (catRef.current) {
            tl.fromTo(catRef.current,
                { opacity: 0, y: 30, scale: 0.5 },
                { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(2.5)' },
                6.0
            );
            // Idle wobble
            gsap.to(catRef.current, {
                rotation: 5,
                repeat: -1,
                yoyo: true,
                duration: 1.5,
                ease: 'sine.inOut',
                delay: 7
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

                        {/* Ghost bleed-through text (mirrored from previous page) */}
                        <div ref={ghostRef} style={{
                            position: 'absolute', top: '5rem', left: '1.5rem', right: '1.5rem',
                            fontFamily: 'var(--font-handwriting)', fontSize: '1.15rem', color: '#777',
                            transform: 'scaleX(-1)', opacity: 0, lineHeight: '2.4rem',
                        }}>
                            <div>Jatuh cinta sama kamu</div>
                            <div>adalah ketidaksengajaan yang</div>
                            <div>lebih indah dari ribuan hal</div>
                            <div>yang pernah aku rencanakan</div>
                        </div>

                        {/* Faded heart ghost drawing */}
                        <svg ref={heartGhostRef} style={{ position: 'absolute', bottom: '8rem', left: '2rem', opacity: 0 }} width="90" height="80" viewBox="0 0 100 90">
                            <path
                                d="M 50 80 C 50 80, 10 55, 10 30 C 10 10, 30 5, 50 25 C 70 5, 90 10, 90 30 C 90 55, 50 80, 50 80 Z"
                                fill="none" stroke="#aac" strokeWidth="2" opacity="0.5"
                            />
                        </svg>
                    </div>
                </div>

                {/* ── RIGHT PAGE ── */}
                <div className={`${styles.dummyPage} ${styles.linedPage}`} style={{ zIndex: 10 }}>
                    <div className={styles.pageContent} style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999' }}>
                            Date:
                        </div>

                        <div style={{ padding: '5.5rem 2rem 2rem 2rem', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>

                            {/* Blue highlight rectangles (behind text) */}
                            <svg ref={highlightsRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
                                {/* Highlight "kalo" in line 1 */}
                                <rect x="125" y="62" width="55" height="28" rx="4" fill="#A9CCE3" opacity="0.5" />
                                {/* Highlight "kita lagi" in line 1 */}
                                <rect x="195" y="62" width="100" height="28" rx="4" fill="#A9CCE3" opacity="0.5" />
                                {/* Highlight entire line 2: "Berantem harus ada yang ngalah" */}
                                <rect x="25" y="105" width="340" height="28" rx="4" fill="#A9CCE3" opacity="0.5" />
                                {/* Highlight "Jangan sampai ada yang kalah" in line 3 */}
                                <rect x="25" y="148" width="340" height="28" rx="4" fill="#A9CCE3" opacity="0.5" />
                            </svg>

                            {/* Main text */}
                            <div ref={rightTextRef} style={{
                                fontFamily: 'var(--font-handwriting)', fontSize: '1.45rem', color: '#333',
                                display: 'flex', flexDirection: 'column', gap: '1.4rem',
                                lineHeight: '1.8', position: 'relative', zIndex: 1,
                            }}>
                                <div>Sayang <span style={{ fontWeight: 'bold' }}>kalo</span> <span style={{ fontWeight: 'bold' }}>kita</span> lagi</div>
                                <div>Berantem harus ada yang ngalah</div>
                                <div>Jangan sampai ada yang kalah</div>
                                <div>sama ego masing-masing ya . . . . .</div>
                            </div>

                            {/* Faded bottom text */}
                            <div ref={footerRef} style={{
                                fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999',
                                textAlign: 'center', marginTop: '2rem', letterSpacing: '2px', opacity: 0,
                            }}>
                                Dengan <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>DICINTAI</span>
                            </div>

                            {/* Cute blue cat/creature in bottom-right */}
                            <div ref={catRef} style={{
                                position: 'absolute', bottom: '1.5rem', right: '1.5rem',
                                width: '70px', height: '70px', opacity: 0,
                            }}>
                                <svg viewBox="0 0 100 100" width="100%" height="100%">
                                    {/* Body — rounded rectangle */}
                                    <rect x="15" y="30" width="70" height="50" rx="22" ry="22" fill="#A9CCE3" stroke="#7FB3D8" strokeWidth="2" />
                                    {/* Ears — pointy triangles */}
                                    <polygon points="20,35 30,10 42,32" fill="#A9CCE3" stroke="#7FB3D8" strokeWidth="2" strokeLinejoin="round" />
                                    <polygon points="58,32 70,10 80,35" fill="#A9CCE3" stroke="#7FB3D8" strokeWidth="2" strokeLinejoin="round" />
                                    {/* Inner ears */}
                                    <polygon points="25,34 32,16 39,33" fill="#D6EAF8" />
                                    <polygon points="61,33 68,16 75,34" fill="#D6EAF8" />
                                    {/* Eyes — X shaped (grumpy/sleepy) */}
                                    <g stroke="#555" strokeWidth="2.5" strokeLinecap="round">
                                        <line x1="32" y1="48" x2="38" y2="54" />
                                        <line x1="38" y1="48" x2="32" y2="54" />
                                        <line x1="62" y1="48" x2="68" y2="54" />
                                        <line x1="68" y1="48" x2="62" y2="54" />
                                    </g>
                                    {/* Mouth — small line */}
                                    <path d="M 45 62 Q 50 67, 55 62" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" />
                                    {/* Tiny feet at bottom */}
                                    <ellipse cx="32" cy="80" rx="10" ry="5" fill="#A9CCE3" stroke="#7FB3D8" strokeWidth="1.5" />
                                    <ellipse cx="68" cy="80" rx="10" ry="5" fill="#A9CCE3" stroke="#7FB3D8" strokeWidth="1.5" />
                                </svg>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
