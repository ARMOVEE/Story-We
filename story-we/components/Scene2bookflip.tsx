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
                {/* ── LEFT PAGE — Welcome ── */}
                <div className={`${styles.pageLeft} ${styles.linedPage}`}>
                    <div className={styles.pageContent} style={{ padding: '2rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', height: '100%', gap: '0', overflow: 'hidden' }}>

                        {/* Top decorative heart */}
                        <div style={{ fontSize: '1.4rem', color: '#e8729a', marginBottom: '0.2rem', lineHeight: 1 }}>♥</div>

                        {/* WELCOME with chevrons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.1rem' }}>
                            <span style={{ color: '#e8729a', fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-2px' }}>›</span>
                            <h1 style={{
                                fontFamily: 'var(--font-handwriting)',
                                fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                                fontWeight: '900',
                                color: '#e8729a',
                                margin: 0,
                                letterSpacing: '0.04em',
                                textShadow: '2px 2px 0px rgba(232,114,154,0.15)',
                            }}>WELCOME</h1>
                            <span style={{ color: '#e8729a', fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-2px' }}>‹</span>
                        </div>

                        {/* Wavy underline SVG */}
                        <svg viewBox="0 0 160 12" style={{ width: '70%', height: 'auto', marginBottom: '0.6rem' }}>
                            <path
                                d="M 0,6 C 10,0 20,12 30,6 C 40,0 50,12 60,6 C 70,0 80,12 90,6 C 100,0 110,12 120,6 C 130,0 140,12 150,6 C 155,3 158,4 160,6"
                                fill="none" stroke="#e8729a" strokeWidth="2.5" strokeLinecap="round"
                            />
                        </svg>

                        {/* Haiii, */}
                        <p style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1rem', color: '#555', margin: '0 0 0.05rem 0' }}>Haiii,</p>

                        {/* Name */}
                        <p style={{
                            fontFamily: 'var(--font-handwriting)',
                            fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
                            fontWeight: '700',
                            color: '#e8729a',
                            margin: '0 0 0.6rem 0',
                            textDecoration: 'underline',
                            textDecorationStyle: 'wavy',
                            textDecorationColor: '#f7b8cc',
                            textUnderlineOffset: '4px',
                        }}>Reva Putri Denti</p>

                        {/* Body paragraph */}
                        <p style={{
                            fontFamily: 'var(--font-handwriting)',
                            fontSize: 'clamp(0.7rem, 1.8vw, 0.88rem)',
                            color: '#555',
                            textAlign: 'center',
                            lineHeight: '1.75',
                            margin: '0 0 0.8rem 0',
                            padding: '0 0.3rem',
                        }}>
                            Terima kasih sudah menjadi bagian<br />
                            dari cerita ini.<br />
                            Semoga setiap momen di sini<br />
                            menjadi kenangan indah<br />
                            yang tak terlupakan.<br />
                            Mari kita ciptakan lebih banyak<br />
                            cerita indah bersama! ♡
                        </p>

                        {/* Decorative scattered ornaments */}
                        <div style={{ position: 'relative', width: '100%', height: '20px', marginBottom: '0.5rem' }}>
                            {/* Star left */}
                            <svg style={{ position: 'absolute', left: '8%', top: '-4px' }} width="18" height="18" viewBox="0 0 24 24">
                                <path d="M12 2l1.5 4.5H18l-3.75 2.75 1.5 4.5L12 11l-3.75 2.75 1.5-4.5L6 6.5h4.5z" fill="#f4d03f" stroke="#e2b007" strokeWidth="0.5" />
                            </svg>
                            {/* Heart left bottom */}
                            <svg style={{ position: 'absolute', left: '3%', top: '4px' }} width="22" height="22" viewBox="0 0 24 24">
                                <path d="M12 21C12 21 3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 13-9 13z" fill="none" stroke="#e8729a" strokeWidth="1.5" />
                            </svg>
                            {/* Star right */}
                            <svg style={{ position: 'absolute', right: '8%', top: '-2px' }} width="16" height="16" viewBox="0 0 24 24">
                                <path d="M12 2l1.5 4.5H18l-3.75 2.75 1.5 4.5L12 11l-3.75 2.75 1.5-4.5L6 6.5h4.5z" fill="#f4d03f" stroke="#e2b007" strokeWidth="0.5" />
                            </svg>
                            <svg style={{ position: 'absolute', right: '14%', top: '6px' }} width="12" height="12" viewBox="0 0 24 24">
                                <path d="M12 2l1.5 4.5H18l-3.75 2.75 1.5 4.5L12 11l-3.75 2.75 1.5-4.5L6 6.5h4.5z" fill="#f4d03f" stroke="#e2b007" strokeWidth="0.5" />
                            </svg>
                        </div>

                        {/* Pill badge */}
                        <div style={{
                            background: 'linear-gradient(135deg, #fce4ec, #f8bbd9)',
                            border: '1.5px solid #e8729a',
                            borderRadius: '999px',
                            padding: '0.35rem 1.2rem',
                            fontFamily: 'var(--font-handwriting)',
                            fontSize: '0.85rem',
                            color: '#c0392b',
                            fontStyle: 'italic',
                            boxShadow: '0 2px 8px rgba(232,114,154,0.25)',
                        }}>
                            Enjoy every moment ♥
                        </div>

                        {/* Bottom corner hearts */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 'auto', paddingTop: '0.5rem' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24">
                                <path d="M12 21C12 21 3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 13-9 13z" fill="none" stroke="#e8729a" strokeWidth="1.8" />
                            </svg>
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
                <div className={`${styles.page} ${styles.linedPage}`} ref={pageRef}>
                    <div className={styles.pageContent}>
                        {/* Title: ♥ Month image ♥  /  Year */}
                        <div style={{ marginBottom: '0.6rem', fontFamily: 'var(--font-handwriting)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ color: '#e74c3c', fontSize: '1.6rem' }}>♥</span>
                                <img
                                    src="/pages/September.png"
                                    alt="September"
                                    style={{ height: '2.2rem', width: 'auto', objectFit: 'contain' }}
                                />
                                <span style={{ color: '#e74c3c', fontSize: '1.6rem' }}>♥</span>
                            </div>
                            <div style={{ fontSize: '1.2rem', color: '#888', marginTop: '0.2rem' }}>
                                {YEAR_LABEL}
                            </div>
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