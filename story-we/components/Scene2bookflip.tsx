"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene2BookFlipProps {
    isActive?: boolean;
    onNext: () => void;
    onPrev?: () => void;
}

// September 2025: Sep 1 = Monday → offset = 0
const SEPT_2025_DAYS = 30;
const SEPT_2025_START = 0;
const HEART_DAY = 13;
const YEAR_LABEL = '2026';
const BOTTOM_TEXT = 'Ini Adalah Tanggal Jadian Kita!!!';

export default function Scene2BookFlip({ onNext, onPrev, isActive = true }: Scene2BookFlipProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const heartPathRef = useRef<SVGPathElement>(null);
    const dashPathRef = useRef<SVGPathElement>(null);
    const arrowRef = useRef<SVGGElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isActive) return;
        requestAnimationFrame(() => {
            if (heartPathRef.current) {
                const len = heartPathRef.current.getTotalLength();
                heartPathRef.current.style.strokeDasharray = `${len}`;
                heartPathRef.current.style.strokeDashoffset = `${len}`;
            }
            if (dashPathRef.current) {
                const len = dashPathRef.current.getTotalLength();
                dashPathRef.current.style.strokeDasharray = `${len}`;
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
                if (r && r.current) gsap.killTweensOf(r.current);
            });
        };
    }, []);

    // Navigation is now handled by the global PageFlipOverlay in BookExperience.

    const calendarCells: (number | null)[] = [
        ...Array(SEPT_2025_START).fill(null),
        ...Array.from({ length: SEPT_2025_DAYS }, (_, i) => i + 1),
    ];

    return (
        <>
            {/* ── Left button (hidden on page 1) ── */}
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

            <div className={styles.bookWrapper} ref={wrapperRef}>
                {/* ── LEFT PAGE — Welcome ── */}
                <div className={`${styles.pageLeft} ${styles.linedPage}`}>
                    <div className={styles.pageContent} style={{ padding: '2rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', height: '100%', gap: '0', overflow: 'hidden' }}>

                        {/* WELCOME image */}
                        <img
                            src="/animations/WELCOME.webp"
                            alt="Welcome"
                            className="gentleSwing"
                            style={{
                                width: 'clamp(180px, 60%, 320px)',
                                height: 'auto',
                                objectFit: 'contain',
                                marginBottom: '0.6rem',
                            }}
                        />

                        {/* Haiii, */}
                        <p style={{ fontFamily: 'var(--font-handwriting)', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: '#444', margin: '0 0 0.15rem 0', letterSpacing: '0.02em' }}>Haiii,</p>

                        {/* Name */}
                        <p style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: 'clamp(1.3rem, 3.5vw, 1.9rem)',
                            fontWeight: 'normal',
                            color: '#e8729a',
                            margin: '0 0 0.5rem 0',
                            letterSpacing: '0.06em',
                            lineHeight: 1.2,
                            textAlign: 'center',
                        }}>Reva Putri Denti</p>

                        {/* Body paragraph */}
                        <p style={{
                            fontFamily: 'var(--font-handwriting)',
                            fontSize: 'clamp(0.82rem, 2vw, 1rem)',
                            color: '#3a3a3a',
                            textAlign: 'center',
                            lineHeight: '1.85',
                            margin: '0 0 0.8rem 0',
                            padding: '0 0.3rem',
                        }}>
                            Terima kasih sudah menjadi bagian<br />
                            dari cerita ini.<br />
                            Semoga setiap momen di sini<br />
                            menjadi kenangan indah<br />
                            yang tak terlupakan.<br />
                            Mari kita ciptakan lebih banyak<br />
                            cerita indah bersama!
                        </p>

                        {/* Decorative scattered ornaments */}
                        <div style={{ position: 'relative', width: '100%', height: '20px', marginBottom: '0.5rem' }}>
                            {/* Star left */}
                            <svg style={{ position: 'absolute', left: '8%', top: '-4px' }} width="18" height="18" viewBox="0 0 24 24">
                                <path d="M12 2l1.5 4.5H18l-3.75 2.75 1.5 4.5L12 11l-3.75 2.75 1.5-4.5L6 6.5h4.5z" fill="#f4d03f" stroke="#e2b007" strokeWidth="0.5" />
                            </svg>
                            {/* Star right */}
                            <svg style={{ position: 'absolute', right: '8%', top: '-2px' }} width="16" height="16" viewBox="0 0 24 24">
                                <path d="M12 2l1.5 4.5H18l-3.75 2.75 1.5 4.5L12 11l-3.75 2.75 1.5-4.5L6 6.5h4.5z" fill="#f4d03f" stroke="#e2b007" strokeWidth="0.5" />
                            </svg>
                            <svg style={{ position: 'absolute', right: '14%', top: '6px' }} width="12" height="12" viewBox="0 0 24 24">
                                <path d="M12 2l1.5 4.5H18l-3.75 2.75 1.5 4.5L12 11l-3.75 2.75 1.5-4.5L6 6.5h4.5z" fill="#f4d03f" stroke="#e2b007" strokeWidth="0.5" />
                            </svg>
                        </div>

                        {/* Bottom corner stars */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 'auto', paddingTop: '0.5rem' }}>
                            <svg width="22" height="22" viewBox="0 0 24 24">
                                <path d="M12 2l1.5 4.5H18l-3.75 2.75 1.5 4.5L12 11l-3.75 2.75 1.5-4.5L6 6.5h4.5z" fill="#f4d03f" stroke="#e2b007" strokeWidth="0.5" />
                            </svg>
                            <svg width="22" height="22" viewBox="0 0 24 24">
                                <path d="M12 2l1.5 4.5H18l-3.75 2.75 1.5 4.5L12 11l-3.75 2.75 1.5-4.5L6 6.5h4.5z" fill="#f4d03f" stroke="#e2b007" strokeWidth="0.5" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PAGE — calendar ── */}
                <div className={`${styles.page} ${styles.linedPage}`}>
                    <div className={styles.pageContent}>
                        {/* Title: Month image / Year */}
                        <div style={{ marginBottom: '0.6rem', fontFamily: 'var(--font-handwriting)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <img
                                    src="/pages/September.png"
                                    alt="September"
                                    className="gentleSwing"
                                    style={{ height: '2.2rem', width: 'auto', objectFit: 'contain' }}
                                />
                            </div>
                            <img
                                src="/animations/2026.webp"
                                alt={YEAR_LABEL}
                                className="gentleSwing"
                                style={{
                                    height: '3.2rem',
                                    width: 'auto',
                                    objectFit: 'contain',
                                    marginTop: '0.2rem',
                                    display: 'block',
                                }}
                            />
                            <style jsx>{`
                                .gentleSwing {
                                    transform-origin: 50% 90%;
                                    animation: gentleSwingRotate 2.4s steps(6, jump-end) infinite alternate;
                                }
                                @keyframes gentleSwingRotate {
                                    0%   { transform: rotate(-8deg); }
                                    100% { transform: rotate(8deg); }
                                }
                            `}</style>
                        </div>

                        <div style={{ position: 'relative', width: '100%' }}>
                            {/* Calendar date grid */}
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

                            {/* Spacer below grid before bottom text */}
                            <div style={{ height: '150px' }} />

                            {/* SVG overlay for the winding dashed path + airplane */}
                            <svg
                                viewBox="0 0 320 300"
                                style={{
                                    position: 'absolute', top: 0, left: 0,
                                    width: '100%', height: '100%',
                                    overflow: 'visible', pointerEvents: 'none', zIndex: 4,
                                }}
                            >
                                {/*
                                  The Loop Path
                                  NOTE: end point moved from (248,48) to (240,84) — this stops
                                  the curve short of the heart's location so the plane's nose
                                  no longer overlaps/pierces the heart on day 13.
                                */}
                                <g>
                                    {/* Thick white outline (static) */}
                                    <path
                                        d="M 120,260 C 120,200 40,240 40,180 C 40,120 120,120 120,180 C 120,230 60,230 60,160 C 60,100 60,60 235,110 C 240,100 242,92 240,84"
                                        stroke="white"
                                        strokeWidth="16"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    {/* Dashed black line (animated via GSAP) */}
                                    <path
                                        ref={dashPathRef}
                                        d="M 120,260 C 120,200 40,240 40,180 C 40,120 120,120 120,180 C 120,230 60,230 60,160 C 60,100 60,60 235,110 C 240,100 242,92 240,84"
                                        stroke="black"
                                        strokeWidth="2.5"
                                        strokeDasharray="8, 6"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </g>

                                {/*
                                  Paper Airplane — the plane's body point (11,13 in local coords)
                                  is aligned to land exactly on the path's end coordinate (240,84),
                                  so the dashed line visually connects into the plane's tail instead
                                  of leaving a gap. No rotation needed: the plane's default diagonal
                                  shape already points up-right toward day 13's heart.
                                  translate = (240 - 11*scale, 84 - 13*scale) with scale = 1.3
                                */}
                                <g ref={arrowRef} transform="translate(226, 67) scale(1.3)">
                                    {/* Thick white border */}
                                    <polygon points="22,2 15,22 11,13 2,9" fill="white" stroke="white" strokeWidth="6" strokeLinejoin="round" />

                                    {/* Left wing */}
                                    <polygon points="22,2 11,13 2,9" fill="white" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />

                                    {/* Right wing */}
                                    <polygon points="22,2 15,22 11,13" fill="white" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />

                                    {/* Center line */}
                                    <line x1="22" y1="2" x2="11" y2="13" stroke="black" strokeWidth="1.5" />

                                    {/* Dark shaded flap (bottom edge of the right wing to simulate 3D fold) */}
                                    <polygon points="11,13 15,22 13,14" fill="#ccc" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
                                </g>
                            </svg>

                            {/* Bottom text, flanked by hearts */}
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
                                {BOTTOM_TEXT}
                            </div>

                        </div>{/* end relative wrapper */}
                    </div>{/* end calendar content */}
                </div>{/* end calendar page */}
            </div>{/* end bookWrapper */}
        </>
    );
}