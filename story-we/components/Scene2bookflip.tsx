"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene2BookFlipProps {
    onNext: () => void;
    onPrev?: () => void;
}

// September 2025: Sep 1 = Monday → offset = 0
const SEPT_2025_DAYS = 30;
const SEPT_2025_START = 0;
const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Scene2BookFlip({ onNext, onPrev }: Scene2BookFlipProps) {
    const wrapperRef   = useRef<HTMLDivElement>(null);
    const pageRef      = useRef<HTMLDivElement>(null);
    const heartPathRef = useRef<SVGPathElement>(null);
    const dashPathRef  = useRef<SVGPathElement>(null);
    const arrowRef     = useRef<SVGGElement>(null);
    const textRef      = useRef<HTMLDivElement>(null);

    useEffect(() => {
        requestAnimationFrame(() => {
            // init heart stroke (hidden)
            if (heartPathRef.current) {
                const len = heartPathRef.current.getTotalLength();
                heartPathRef.current.style.strokeDasharray = `${len}`;
                heartPathRef.current.style.strokeDashoffset = `${len}`;
            }
            // init dashed curved path (hidden) — we'll override dasharray after hiding
            if (dashPathRef.current) {
                const len = dashPathRef.current.getTotalLength();
                dashPathRef.current.style.strokeDashoffset = `${len}`;
            }
            // hide arrowhead + text
            if (arrowRef.current) gsap.set(arrowRef.current, { opacity: 0 });
            if (textRef.current)  gsap.set(textRef.current,  { opacity: 0, y: 8 });

            const tl = gsap.timeline();

            // 1) draw heart around day 13
            if (heartPathRef.current)
                tl.to(heartPathRef.current, { strokeDashoffset: 0, duration: 1.2, ease: 'power1.inOut' }, 0.4);

            // 2) draw the dashed curved line
            if (dashPathRef.current)
                tl.to(dashPathRef.current, { strokeDashoffset: 0, duration: 1.8, ease: 'power1.inOut' }, '+=0.3');

            // 3) pop arrowhead + fade text
            if (arrowRef.current)
                tl.to(arrowRef.current, { opacity: 1, duration: 0.3 }, '+=0.05');
            if (textRef.current)
                tl.to(textRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '<');
        });

        return () => {
            [heartPathRef, dashPathRef, arrowRef, textRef].forEach(r => {
                if (r.current) gsap.killTweensOf(r.current);
            });
        };
    }, []);

    const handleNext = () => {
        if (pageRef.current) {
            gsap.to(pageRef.current, {
                rotateY: -180, duration: 0.8, ease: 'power2.inOut', onComplete: onNext,
            });
        } else {
            onNext();
        }
    };

    const calendarCells: (number | null)[] = [
        ...Array(SEPT_2025_START).fill(null),
        ...Array.from({ length: SEPT_2025_DAYS }, (_, i) => i + 1),
    ];

    return (
        <>
            {onPrev && (
                <div className={styles.navBtnWrapperLeft}>
                    <button className={styles.navBtn} onClick={onPrev}>
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
            <div className={styles.navBtnWrapperRight}>
                <button className={`${styles.navBtn} ${styles.navBtnNext}`} onClick={handleNext}>
                    <div className={styles.navBtnInner}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" height="25px" width="25px" style={{ transform: 'rotate(180deg)' }}>
                            <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" fill="#000" />
                            <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" fill="#000" />
                        </svg>
                    </div>
                    <p className={styles.navBtnText}>Lanjutkan</p>
                </button>
            </div>

            <div className={styles.bookWrapper} ref={wrapperRef}>
                {/* ── LEFT PAGE — blank / intro ── */}
                <div className={`${styles.pageLeft} ${styles.linedPage}`}>
                    <div className={styles.pageContent} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <div style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.8rem', color: '#ccc', textAlign: 'center', lineHeight: 2 }}>
                            <div>September</div>
                            <div>2025</div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PAGE — calendar ── */}
                <div className={`${styles.page} ${styles.linedPage}`} ref={pageRef}>
                    <div className={styles.pageContent}>
                        <div style={{ padding: '0.5rem 1rem', borderRadius: '4px', marginBottom: '0.8rem', fontWeight: 'bold', fontFamily: 'var(--font-handwriting)', fontSize: '1.2rem', color: '#e74c3c' }}>
                            September 2025
                        </div>

                        <div style={{ position: 'relative', width: '100%' }}>
                            {/* Day-of-week headers */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.3rem 0.5rem', fontSize: '0.75rem', textAlign: 'center', color: '#e74c3c', marginBottom: '0.3rem' }}>
                                {DAY_HEADERS.map(h => <div key={h}><strong>{h}</strong></div>)}
                            </div>

                            {/* Calendar date grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem 0.5rem', fontSize: '1.05rem', textAlign: 'center', color: '#444' }}>
                                {calendarCells.map((day, idx) => (
                                    <div key={idx} style={{ position: 'relative', minHeight: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {day !== null && day}
                                        {/* Animated heart outline around day 13 */}
                                        {day === 13 && (
                                            <svg
                                                viewBox="-12 -12 44 44"
                                                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '48px', height: '48px', overflow: 'visible', zIndex: 3, pointerEvents: 'none' }}
                                            >
                                                <path
                                                    ref={heartPathRef}
                                                    d="M10,26 C-9,8 1,-9 10,1 C19,-9 29,8 10,26 Z"
                                                    fill="none"
                                                    stroke="#e74c3c"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Spacer: room for the dashed-line loop + text below grid */}
                            <div style={{ height: '130px' }} />

                            {/* SVG overlay for the arrow + dashed path */}
                            <svg
                                viewBox="0 0 320 260"
                                style={{
                                    position: 'absolute', top: 0, left: 0,
                                    width: '100%', height: '100%',
                                    overflow: 'visible', pointerEvents: 'none', zIndex: 4,
                                }}
                                fill="none"
                            >
                                {/* Dashed curved teardrop path */}
                                <path
                                    ref={dashPathRef}
                                    d="
                                        M 251,80
                                        C 275,95  290,130  275,158
                                        C 260,186  230,190  212,173
                                        C 194,156  200,128  218,118
                                        C 236,108  256,124  254,146
                                        C 252,163  238,174  225,168
                                        C 212,162  210,146  218,136
                                        C 224,128  234,126  242,132
                                        L 232,175
                                        L 220,210
                                        L 160,238
                                    "
                                    stroke="#e74c3c"
                                    strokeWidth="2"
                                    strokeDasharray="5 4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* Arrowhead at (160,238) pointing downward */}
                                <g ref={arrowRef}>
                                    <polyline
                                        points="153,230 160,239 167,230"
                                        stroke="#e74c3c"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </g>
                            </svg>

                            {/* Romantic text at bottom of relative container */}
                            <div
                                ref={textRef}
                                style={{
                                    position: 'absolute',
                                    bottom: '0', left: '0', right: '0',
                                    textAlign: 'center',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    color: '#c0392b',
                                    fontFamily: 'var(--font-handwriting)',
                                    lineHeight: '1.4',
                                }}
                            >
                                <span style={{ color: '#e74c3c' }}>♡ </span>
                                Ini Adalah Tanggal Jadian Kita!!!
                                <span style={{ color: '#e74c3c' }}> ♡</span>
                            </div>

                        </div>{/* end relative wrapper */}
                    </div>{/* end calendar content */}
                </div>{/* end calendar page */}
            </div>{/* end bookWrapper */}
        </>
    );
}
