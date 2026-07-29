"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene6GiftProps {
    onNext?: () => void;
}

export default function Scene6Gift({ onNext }: Scene6GiftProps) {
    const pageRef = useRef<HTMLDivElement>(null);
    const leftTextRef = useRef<HTMLDivElement>(null);
    const rightTextRef = useRef<HTMLDivElement>(null);

    // Animation refs
    const leftArmRef = useRef<SVGPathElement>(null);
    const rightArmLeftRef = useRef<SVGPathElement>(null);   // right char's left arm
    const rightArmRightRef = useRef<SVGPathElement>(null);  // right char's right arm (for hug)
    const envelopeRef = useRef<SVGGElement>(null);
    const leftBubbleRef = useRef<SVGGElement>(null);
    const rightBubbleRef = useRef<SVGGElement>(null);
    const floatingHeartsRef = useRef<SVGGElement>(null);

    useEffect(() => {
        const tl = gsap.timeline();

        // 1. Fade in left page text
        if (leftTextRef.current) {
            tl.fromTo(leftTextRef.current.children,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.3, ease: 'power2.out' },
                0.2
            );
        }

        // 2. Fade in right page text
        if (rightTextRef.current) {
            tl.fromTo(rightTextRef.current.children,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.3, ease: 'power2.out' },
                "-=0.4"
            );
        }

        const t = 2.5; // interaction start time

        // ── Step 1: Left char says "I love you" ──
        tl.fromTo(leftBubbleRef.current,
            { scale: 0, transformOrigin: "bottom right" },
            { scale: 1, duration: 0.5, ease: 'back.out(2)' },
            t
        );

        // ── Step 2: Left arm extends, pushing envelope toward center ──
        tl.to(leftArmRef.current,
            { attr: { d: "M 68 105 Q 95 85 125 90" }, duration: 1.0, ease: 'power2.out' },
            t + 0.6
        );
        tl.to(envelopeRef.current,
            { x: 60, y: -8, duration: 1.0, ease: 'power2.out' },
            t + 0.6
        );

        // ── Step 3: Right char's left arm reaches out to receive ──
        tl.to(rightArmLeftRef.current,
            { attr: { d: "M 180 100 Q 155 85 130 90" }, duration: 0.8, ease: 'power2.out' },
            t + 1.4
        );

        // Small pause at the meeting point (hands touch the envelope)

        // ── Step 4: Left arm retracts ──
        tl.to(leftArmRef.current,
            { attr: { d: "M 68 105 Q 55 112 50 105" }, duration: 0.8, ease: 'power2.inOut' },
            t + 2.4
        );

        // ── Step 5: Right arm pulls envelope to body (hug start) ──
        tl.to(rightArmLeftRef.current,
            { attr: { d: "M 180 100 Q 175 95 185 88" }, duration: 0.9, ease: 'power2.inOut' },
            t + 2.4
        );
        tl.to(envelopeRef.current,
            { x: 130, y: -2, duration: 0.9, ease: 'power2.inOut' },
            t + 2.4
        );

        // ── Step 6: Right arm wraps around (completing the hug) ──
        tl.to(rightArmRightRef.current,
            { attr: { d: "M 220 100 Q 215 85 195 82" }, duration: 0.7, ease: 'power2.out' },
            t + 3.0
        );

        // Envelope nestles into the body
        tl.to(envelopeRef.current,
            { x: 140, y: -5, scale: 0.9, duration: 0.5, ease: 'power1.inOut' },
            t + 3.0
        );

        // ── Step 7: Left bubble out, right bubble in ──
        tl.to(leftBubbleRef.current,
            { scale: 0, duration: 0.3, ease: 'power2.in' },
            t + 3.2
        );
        tl.fromTo(rightBubbleRef.current,
            { scale: 0, transformOrigin: "bottom left" },
            { scale: 1, duration: 0.6, ease: 'back.out(2)' },
            t + 3.5
        );

        // ── Step 8: Floating hearts burst out during hug ──
        if (floatingHeartsRef.current) {
            const hearts = floatingHeartsRef.current.children;
            gsap.set(hearts, { opacity: 0, scale: 0 });
            tl.to(hearts, {
                opacity: 1,
                scale: 1,
                y: (i: number) => -20 - i * 12,
                x: (i: number) => (i % 2 === 0 ? 8 : -8) + i * 3,
                rotation: (i: number) => (i % 2 === 0 ? 15 : -15),
                duration: 0.8,
                stagger: 0.15,
                ease: 'back.out(1.5)',
            }, t + 3.3);

            // Hearts gently float up and fade
            tl.to(hearts, {
                y: "-=25",
                opacity: 0,
                duration: 2.0,
                stagger: 0.12,
                ease: 'power1.out',
            }, t + 4.5);
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

            <div className={styles.bookWrapper} ref={pageRef}>
                {/* ── LEFT PAGE ── */}
                <div className={`${styles.pageLeft} ${styles.linedPage}`}>
                    <div className={styles.pageContent}>
                        <div style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999', marginBottom: '1rem' }}>
                            Date:
                        </div>

                        <div ref={leftTextRef} style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.25rem', lineHeight: '2.5', color: '#333' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                Maaf ya sayang kalo kado/<br />
                                hadiah yang aku kasih itu<br />
                                ga mewah. Tapi semoga<br />
                                Sangat Bermanfaat ya sayang
                            </div>
                            <div>
                                Harus kamu pake ya apa<br />
                                yang aku kasih ke kamu sayang<br />
                                Semoga kamu suka sayang
                            </div>
                        </div>

                        {/* Hand-drawn hearts at bottom left */}
                        <svg width="60" height="60" viewBox="0 0 100 100" style={{ position: 'absolute', bottom: '2rem', left: '2rem' }}>
                            <path d="M 30 20 C 30 10, 10 10, 10 25 C 10 40, 30 50, 30 50 C 30 50, 50 40, 50 25 C 50 10, 30 10, 30 20 Z" fill="none" stroke="#333" strokeWidth="2.5" transform="rotate(-15 30 30) scale(0.6) translate(20, 0)" />
                            <path d="M 30 20 C 30 10, 10 10, 10 25 C 10 40, 30 50, 30 50 C 30 50, 50 40, 50 25 C 50 10, 30 10, 30 20 Z" fill="none" stroke="#333" strokeWidth="2.5" transform="rotate(5 30 30) scale(0.5) translate(80, 50)" />
                            <path d="M 30 20 C 30 10, 10 10, 10 25 C 10 40, 30 50, 30 50 C 30 50, 50 40, 50 25 C 50 10, 30 10, 30 20 Z" fill="none" stroke="#333" strokeWidth="2.5" transform="rotate(25 30 30) scale(0.4) translate(140, 110)" />
                        </svg>
                    </div>
                </div>

                {/* ── RIGHT PAGE ── */}
                <div className={`${styles.dummyPage} ${styles.linedPage}`} style={{ zIndex: 10 }}>
                    <div className={styles.pageContent} style={{ alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999' }}>
                            Date:
                        </div>

                        <div ref={rightTextRef} style={{ marginTop: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.25rem', lineHeight: '2.5', color: '#333' }}>
                            <div style={{ position: 'relative', marginBottom: '1rem' }}>
                                <svg width="15" height="15" viewBox="0 0 100 100" style={{ position: 'absolute', left: '-20px', top: '10px' }}>
                                    <path d="M 50 35 C 50 15, 15 15, 15 45 C 15 75, 50 90, 50 90 C 50 90, 85 75, 85 45 C 85 15, 50 15, 50 35 Z" fill="#ff6b9d" opacity="0.8" />
                                </svg>
                                <svg width="12" height="12" viewBox="0 0 100 100" style={{ position: 'absolute', right: '-15px', top: '-5px' }}>
                                    <path d="M 50 35 C 50 15, 15 15, 15 45 C 15 75, 50 90, 50 90 C 50 90, 85 75, 85 45 C 85 15, 50 15, 50 35 Z" fill="#ff6b9d" opacity="0.8" />
                                </svg>
                                Aku sangat sayang<br />
                                bangett
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                Sama kamu. walaupun<br />
                                kadang kamu suka<br />
                                ngeselin jal wel wel wel
                            </div>
                            <div>
                                Tapi aku sayangg
                            </div>
                        </div>

                        {/* Interactive Illustration */}
                        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '1rem', width: '100%' }}>
                            <svg width="250" height="160" viewBox="0 0 250 160" style={{ overflow: 'visible' }}>
                                {/* ── Character 1 (Left — the giver) ── */}
                                <g transform="translate(20, 30)">
                                    {/* Body */}
                                    <path d="M 10 120 C 10 30, 60 30, 60 120" fill="none" stroke="#333" strokeWidth="2.5" />
                                    {/* Face */}
                                    <circle cx="25" cy="60" r="2.5" fill="#333" />
                                    <circle cx="45" cy="60" r="2.5" fill="#333" />
                                    {/* Smile */}
                                    <path d="M 29 72 Q 35 80 41 72" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                                </g>

                                {/* ── Character 2 (Right — the receiver) ── */}
                                <g transform="translate(160, 30)">
                                    {/* Body */}
                                    <path d="M 10 120 C 10 30, 60 30, 60 120" fill="none" stroke="#333" strokeWidth="2.5" />
                                    {/* Face */}
                                    <circle cx="25" cy="60" r="2.5" fill="#333" />
                                    <circle cx="45" cy="60" r="2.5" fill="#333" />
                                    {/* Happy smile */}
                                    <path d="M 28 72 Q 35 82 42 72" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                                </g>

                                {/* ── Arms ── */}
                                {/* Left character's right arm (the giving arm) */}
                                <path ref={leftArmRef}
                                    d="M 68 105 Q 75 115 72 108"
                                    fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round"
                                />

                                {/* Right character's LEFT arm (receiving arm) */}
                                <path ref={rightArmLeftRef}
                                    d="M 180 100 Q 172 112 175 108"
                                    fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round"
                                />

                                {/* Right character's RIGHT arm (hidden, will wrap for hug) */}
                                <path ref={rightArmRightRef}
                                    d="M 220 100 Q 225 112 222 108"
                                    fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round"
                                />

                                {/* ── Envelope with heart ── */}
                                <g ref={envelopeRef} transform="translate(60, 95)">
                                    <rect x="0" y="0" width="24" height="18" rx="1" fill="white" stroke="#333" strokeWidth="1.5" />
                                    <path d="M 0 0 L 12 9 L 24 0" fill="none" stroke="#333" strokeWidth="1.5" />
                                    {/* Heart sticker */}
                                    <path d="M 12 8 C 12 5, 8 5, 8 8.5 C 8 12, 12 14, 12 14 C 12 14, 16 12, 16 8.5 C 16 5, 12 5, 12 8 Z" fill="#e74c3c" />
                                </g>

                                {/* ── Floating hearts (burst during hug) ── */}
                                <g ref={floatingHeartsRef} transform="translate(190, 40)">
                                    {[0, 1, 2, 3, 4].map(i => (
                                        <path
                                            key={i}
                                            d="M 6 4 C 6 2, 3 2, 3 4.5 C 3 7, 6 9, 6 9 C 6 9, 9 7, 9 4.5 C 9 2, 6 2, 6 4 Z"
                                            fill={['#e74c3c', '#ff6b9d', '#e74c3c', '#ff6b9d', '#e74c3c'][i]}
                                            transform={`translate(${i * 4 - 8}, 0) scale(${0.7 + i * 0.15})`}
                                            opacity="0"
                                        />
                                    ))}
                                </g>

                                {/* ── Left Speech Bubble ("I love you") ── */}
                                <g ref={leftBubbleRef} transform="translate(10, 5)">
                                    <path d="M 55 28 Q 55 8 30 8 Q 5 8 5 28 Q 5 48 30 48 Q 45 48 55 60 Q 50 48 55 28 Z"
                                        fill="white" stroke="#333" strokeWidth="1.5" />
                                    <text x="30" y="32" fontFamily="var(--font-handwriting)" fontSize="13" fill="#333" textAnchor="middle">
                                        I love you
                                    </text>
                                </g>

                                {/* ── Right Speech Bubble ("I love you too") ── */}
                                <g ref={rightBubbleRef} transform="translate(145, -5)">
                                    <path d="M 10 30 Q 10 8 45 8 Q 80 8 80 30 Q 80 52 45 52 Q 25 52 10 65 Q 18 52 10 30 Z"
                                        fill="white" stroke="#333" strokeWidth="1.5" />
                                    <text x="45" y="34" fontFamily="var(--font-handwriting)" fontSize="12" fill="#333" textAnchor="middle">
                                        I love you too
                                    </text>
                                </g>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}