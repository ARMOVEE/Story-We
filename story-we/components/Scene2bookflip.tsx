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
const HEART_DAY = 13;
const MONTH_LABEL = 'September';
const YEAR_LABEL = '2025';
const BOTTOM_TEXT = 'Ini Adalah Tanggal Jadian Kita!!!';

export default function Scene2BookFlip({ onNext, onPrev }: Scene2BookFlipProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const pageRef = useRef<HTMLDivElement>(null);
    const heartPathRef = useRef<SVGPathElement>(null);
    const dashPathRef = useRef<SVGPathElement>(null);
    const arrowRef = useRef<SVGGElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        requestAnimationFrame(() => {
            if (heartPathRef.current) {
                const len = heartPathRef.current.getTotalLength();
                heartPathRef.current.style.strokeDasharray = `${len}`;
                heartPathRef.current.style.strokeDashoffset = `${len}`;
            }
            if (dashPathRef.current) {
                const len = dashPathRef.current.getTotalLength();
                dashPathRef.current.style.strokeDashoffset = `${len}`;
            }
            if (arrowRef.current) gsap.set(arrowRef.current, { opacity: 0 });
            if (textRef.current) gsap.set(textRef.current, { opacity: 0, y: 8 });

            const tl = gsap.timeline();

            if (heartPathRef.current)
                tl.to(heartPathRef.current, { strokeDashoffset: 0, duration: 1.2, ease: 'power1.inOut' }, 0.4);

            if (dashPathRef.current)
                tl.to(dashPathRef.current, { strokeDashoffset: 0, duration: 2.2, ease: 'power1.inOut' }, '+=0.3');

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
            {/* ── Left button (hidden on page 1) ── */}
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
                            <div>{MONTH_LABEL}</div>
                            <div>{YEAR_LABEL}</div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PAGE — calendar ── */}
                <div className={`${styles.page} ${styles.linedPage}`} ref={pageRef}>
                    <div className={styles.pageContent}>
                        {/* Title: ♥ Month ♥  /  Year — matches reference photo layout */}
                        <div style={{ marginBottom: '0.6rem', fontFamily: 'var(--font-handwriting)' }}>
                            <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#c0392b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ color: '#e74c3c' }}>♥</span>
                                {MONTH_LABEL}
                                <span style={{ color: '#e74c3c' }}>♥</span>
                            </div>
                            <div style={{ fontSize: '1.2rem', color: '#888', marginTop: '0.2rem' }}>
                                {YEAR_LABEL}
                            </div>
                        </div>

                        <div style={{ position: 'relative', width: '100%' }}>
                            {/* Calendar date grid — no weekday header, matches photo */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.6rem 0.5rem', fontSize: '1.05rem', textAlign: 'center', color: '#444' }}>
                                {calendarCells.map((day, idx) => (
                                    <div key={idx} style={{ position: 'relative', minHeight: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {day !== null && day}
                                        {/* Animated heart outline around the special day */}
                                        {day === HEART_DAY && (
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

                            {/* Spacer: room for the winding dashed line + text below grid */}
                            <div style={{ height: '150px' }} />

                            {/* SVG overlay for the winding dashed path + arrow —
                                meliuk turun melewati beberapa baris, seperti di foto */}
                            <svg
                                viewBox="0 0 320 300"
                                style={{
                                    position: 'absolute', top: 0, left: 0,
                                    width: '100%', height: '100%',
                                    overflow: 'visible', pointerEvents: 'none', zIndex: 4,
                                }}
                                fill="none"
                            >
                                <path
                                    ref={dashPathRef}
                                    d="
                                        M 251,75
                                        C 250,110 200,120 150,130
                                        C 90,140 80,175 115,180
                                        C 150,185 160,160 160,200
                                        L 160,242
                                    "
                                    stroke="#e74c3c"
                                    strokeWidth="2"
                                    strokeDasharray="6, 6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* Arrowhead pointing downward, ends near bottom text */}
                                <g ref={arrowRef}>
                                    <polyline
                                        points="153,235 160,244 167,235"
                                        stroke="#e74c3c"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </g>
                            </svg>

                            {/* Bottom text, flanked by hearts — matches "It's your birthday" style */}
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
                                <span style={{ color: '#e74c3c' }}>♥ </span>
                                {BOTTOM_TEXT}
                                <span style={{ color: '#e74c3c' }}> ♥</span>
                            </div>

                        </div>{/* end relative wrapper */}
                    </div>{/* end calendar content */}
                </div>{/* end calendar page */}
            </div>{/* end bookWrapper */}
        </>
    );
}