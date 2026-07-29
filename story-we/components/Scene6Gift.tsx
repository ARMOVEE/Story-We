"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene6GiftProps {
    onNext?: () => void;
    onPrev?: () => void;
}

export default function Scene6Gift({ onNext, onPrev }: Scene6GiftProps) {
    const pageRef = useRef<HTMLDivElement>(null);
    const leftTextRef = useRef<HTMLDivElement>(null);
    const rightTextRef = useRef<HTMLDivElement>(null);

    const leftArmRef = useRef<SVGPathElement>(null);
    const rightArmLeftRef = useRef<SVGPathElement>(null);
    const rightArmRightRef = useRef<SVGPathElement>(null);
    const envelopeRef = useRef<SVGGElement>(null);
    const leftBubbleRef = useRef<SVGGElement>(null);
    const rightBubbleRef = useRef<SVGGElement>(null);
    const floatingHeartsRef = useRef<SVGGElement>(null);

    useEffect(() => {
        const tl = gsap.timeline();

        // Fade in page text
        if (leftTextRef.current) {
            tl.fromTo(leftTextRef.current.children,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.3, ease: 'power2.out' },
                0.2
            );
        }
        if (rightTextRef.current) {
            tl.fromTo(rightTextRef.current.children,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.3, ease: 'power2.out' },
                "-=0.4"
            );
        }

        const t = 2.5; // interaction start time

        // ── Step 1: Left character says "I love you" ──
        tl.fromTo(leftBubbleRef.current,
            { scale: 0, transformOrigin: "bottom right" },
            { scale: 1, duration: 0.5, ease: 'back.out(2)' },
            t
        );

        // Envelope appears in left hand, at chest height, aligned with arm
        tl.fromTo(envelopeRef.current,
            { opacity: 0, x: 78, y: 90, scale: 0.9 },
            { opacity: 1, x: 78, y: 90, scale: 0.9, duration: 0.3 },
            t + 0.5
        );

        // ── Step 2: Left arm extends, envelope moves slowly to center ──
        tl.to(leftArmRef.current,
            { attr: { d: "M 68 100 Q 90 92 108 94" }, duration: 1.1, ease: 'power2.out' },
            t + 0.8
        );
        tl.to(envelopeRef.current,
            { x: 108, y: 88, scale: 0.9, duration: 1.1, ease: 'power2.out' },
            t + 0.8
        );

        // ── Step 3: Right character's arm reaches out — both hands meet at envelope ──
        tl.to(rightArmLeftRef.current,
            { attr: { d: "M 180 98 Q 155 90 132 93" }, duration: 0.9, ease: 'power2.out' },
            t + 1.9
        );

        // Small beat where both hands hold the envelope together
        tl.to({}, { duration: 0.3 }, t + 2.7);

        // ── Step 4: Left arm retracts, right arm pulls envelope toward its chest ──
        tl.to(leftArmRef.current,
            { attr: { d: "M 68 100 Q 58 108 52 100" }, duration: 0.8, ease: 'power2.inOut' },
            t + 3.0
        );
        tl.to(rightArmLeftRef.current,
            { attr: { d: "M 180 98 Q 168 92 152 90" }, duration: 0.8, ease: 'power2.inOut' },
            t + 3.0
        );
        tl.to(envelopeRef.current,
            { x: 152, y: 88, scale: 0.9, duration: 0.8, ease: 'power2.inOut' },
            t + 3.0
        );

        // ── Step 5: Right character's second arm wraps around — hugging the envelope ──
        tl.to(rightArmRightRef.current,
            { attr: { d: "M 220 98 Q 210 88 190 86" }, duration: 0.7, ease: 'power2.out' },
            t + 3.85
        );

        // ── Step 6: Envelope nestles in, shrinks slightly into the hug ──
        tl.to(envelopeRef.current,
            { x: 158, y: 92, scale: 0.75, duration: 0.5, ease: 'power1.inOut' },
            t + 4.1
        );

        // ── Step 7: Left bubble out, "I love you too" bubble in ──
        tl.to(leftBubbleRef.current,
            { scale: 0, duration: 0.3, ease: 'power2.in' },
            t + 4.2
        );
        tl.fromTo(rightBubbleRef.current,
            { scale: 0, transformOrigin: "bottom left" },
            { scale: 1, duration: 0.6, ease: 'back.out(2)' },
            t + 4.5
        );

        // ── Step 8: Floating hearts bloom from right character, drift up, fade ──
        if (floatingHeartsRef.current) {
            const hearts = floatingHeartsRef.current.children;
            gsap.set(hearts, { opacity: 0, scale: 0 });
            tl.to(hearts, {
                opacity: 1,
                scale: 1,
                y: (i: number) => -18 - i * 12,
                x: (i: number) => (i % 2 === 0 ? 8 : -8) + i * 3,
                rotation: (i: number) => (i % 2 === 0 ? 15 : -15),
                duration: 0.8,
                stagger: 0.15,
                ease: 'back.out(1.5)',
            }, t + 4.4);

            tl.to(hearts, {
                y: "-=28",
                opacity: 0,
                duration: 2.0,
                stagger: 0.12,
                ease: 'power1.out',
            }, t + 5.6);
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
                                    <path d="M 10 120 C 10 30, 60 30, 60 120" fill="none" stroke="#333" strokeWidth="2.5" />
                                    <circle cx="25" cy="60" r="2.5" fill="#333" />
                                    <circle cx="45" cy="60" r="2.5" fill="#333" />
                                    <path d="M 29 72 Q 35 80 41 72" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                                </g>

                                {/* ── Character 2 (Right — the receiver) ── */}
                                <g transform="translate(160, 30)">
                                    <path d="M 10 120 C 10 30, 60 30, 60 120" fill="none" stroke="#333" strokeWidth="2.5" />
                                    <circle cx="25" cy="60" r="2.5" fill="#333" />
                                    <circle cx="45" cy="60" r="2.5" fill="#333" />
                                    <path d="M 28 72 Q 35 82 42 72" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                                </g>

                                {/* ── Arms — coordinates aligned to chest height (y≈88-100) so envelope stays level ── */}
                                {/* Left character's giving arm — rests at side initially */}
                                <path ref={leftArmRef}
                                    d="M 68 100 Q 60 110 55 102"
                                    fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round"
                                />

                                {/* Right character's receiving arm (left arm) */}
                                <path ref={rightArmLeftRef}
                                    d="M 180 98 Q 188 108 183 100"
                                    fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round"
                                />

                                {/* Right character's hugging arm (right arm) — hidden until hug */}
                                <path ref={rightArmRightRef}
                                    d="M 220 98 Q 228 108 223 100"
                                    fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round"
                                />

                                {/* ── Envelope — starts hidden, appears in left character's hand at chest height ── */}
                                <g ref={envelopeRef} transform="translate(78, 90)" opacity="0">
                                    <rect x="0" y="0" width="26" height="19" rx="1.5" fill="white" stroke="#333" strokeWidth="1.5" />
                                    <path d="M 0 0 L 13 10 L 26 0" fill="none" stroke="#333" strokeWidth="1.5" />
                                    <path d="M 13 9 C 13 6, 9 6, 9 9.5 C 9 13, 13 15, 13 15 C 13 15, 17 13, 17 9.5 C 17 6, 13 6, 13 9 Z" fill="#e74c3c" />
                                </g>

                                {/* ── Floating hearts (bloom from right character during hug) ── */}
                                <g ref={floatingHeartsRef} transform="translate(195, 45)">
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