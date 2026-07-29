"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene9GlobeProps {
    onNext?: () => void;
    onPrev?: () => void;
}

export default function Scene9Globe({ onNext, onPrev }: Scene9GlobeProps) {
    const textLeftRef = useRef<HTMLDivElement>(null);
    const textRightRef = useRef<HTMLDivElement>(null);

    const globeRef = useRef<SVGSVGElement>(null);
    // Two figures (male + female) holding hands. Outer legs (the ones pointing
    // away from each other) swing together; inner legs (pointing toward each
    // other) swing together — reads as a couple walking in step.
    const maleOuterLegRef = useRef<SVGLineElement>(null);
    const maleInnerLegRef = useRef<SVGLineElement>(null);
    const femaleOuterLegRef = useRef<SVGLineElement>(null);
    const femaleInnerLegRef = useRef<SVGLineElement>(null);
    // Only the free (outer) arms swing — the inner arms are the clasped hands
    // and stay put so the "holding hands" reads clearly.
    const maleFreeArmRef = useRef<SVGLineElement>(null);
    const femaleFreeArmRef = useRef<SVGLineElement>(null);
    const bodyRef = useRef<SVGGElement>(null);
    const bubbleRef = useRef<HTMLDivElement>(null);
    const underlineRef = useRef<SVGSVGElement>(null);
    const circleRef = useRef<SVGSVGElement>(null);

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

        // Highlights (red underline under "Hebat", yellow circle around "KAMU")
        const highlightPaths: SVGPathElement[] = [];
        if (underlineRef.current) highlightPaths.push(...Array.from(underlineRef.current.querySelectorAll('path')));
        if (circleRef.current) highlightPaths.push(...Array.from(circleRef.current.querySelectorAll('path')));
        if (highlightPaths.length) {
            tl.fromTo(highlightPaths,
                { strokeDasharray: 300, strokeDashoffset: 300 },
                { strokeDashoffset: 0, duration: 0.7, stagger: 0.4, ease: 'power2.out' },
                "-=0.2"
            );
        }

        // Globe and character pop in
        tl.fromTo([globeRef.current, bodyRef.current],
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)', transformOrigin: 'center bottom' },
            "-=0.3"
        );

        // Walking cycle — using exact pixel transformOrigins (hips) for perfect anchoring
        if (maleOuterLegRef.current && femaleOuterLegRef.current) {
            gsap.fromTo(maleOuterLegRef.current,
                { rotation: -25 },
                { rotation: 25, transformOrigin: '22px 34px', repeat: -1, yoyo: true, duration: 0.35, ease: 'sine.inOut' }
            );
            gsap.fromTo(femaleOuterLegRef.current,
                { rotation: -25 },
                { rotation: 25, transformOrigin: '52px 34px', repeat: -1, yoyo: true, duration: 0.35, ease: 'sine.inOut' }
            );
        }
        if (maleInnerLegRef.current && femaleInnerLegRef.current) {
            gsap.fromTo(maleInnerLegRef.current,
                { rotation: 25 },
                { rotation: -25, transformOrigin: '22px 34px', repeat: -1, yoyo: true, duration: 0.35, ease: 'sine.inOut' }
            );
            gsap.fromTo(femaleInnerLegRef.current,
                { rotation: 25 },
                { rotation: -25, transformOrigin: '52px 34px', repeat: -1, yoyo: true, duration: 0.35, ease: 'sine.inOut' }
            );
        }
        // Free arms swinging
        if (maleFreeArmRef.current) {
            gsap.fromTo(maleFreeArmRef.current,
                { rotation: 20 },
                { rotation: -20, transformOrigin: '22px 22px', repeat: -1, yoyo: true, duration: 0.35, ease: 'sine.inOut' }
            );
        }
        if (femaleFreeArmRef.current) {
            gsap.fromTo(femaleFreeArmRef.current,
                { rotation: -20 },
                { rotation: 20, transformOrigin: '52px 22px', repeat: -1, yoyo: true, duration: 0.35, ease: 'sine.inOut' }
            );
        }
        // Tiny body bob so each "step" reads as a step (bobs twice per full leg swing)
        if (bodyRef.current) {
            gsap.fromTo(bodyRef.current,
                { y: 0 },
                { y: -2.5, repeat: -1, yoyo: true, duration: 0.175, ease: 'sine.inOut' }
            );
        }

        // Globe rotates opposite the walk direction — reads as the character
        // pushing the world backward under their own feet as they step forward.
        if (globeRef.current) {
            gsap.to(globeRef.current, {
                rotation: -360,
                transformOrigin: 'center center',
                repeat: -1,
                duration: 5,
                ease: 'none'
            });
        }

        // Speech bubble — pops in suddenly like a surprised shout, after a beat of walking
        if (bubbleRef.current) {
            tl.fromTo(bubbleRef.current,
                { opacity: 0, scale: 0, rotation: -8, transformOrigin: '85% 100%' },
                { opacity: 1, scale: 1, rotation: 0, duration: 0.45, ease: 'back.out(3)' },
                "+=1.2"
            );
            // Quick little shake right after it appears, for the "shout" feel
            tl.fromTo(bubbleRef.current,
                { x: 0 },
                { x: 3, duration: 0.06, repeat: 5, yoyo: true, ease: 'none' }
            );

            // Then settle into a slow float
            gsap.to(bubbleRef.current, {
                y: -6,
                repeat: -1,
                yoyo: true,
                duration: 1.6,
                ease: 'sine.inOut',
                delay: 3.5
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

                        {/* Text column + illustration column live side by side in a flex row.
                            This keeps the illustration fully inside the page's own box —
                            no negative offsets that can push it past the page edge. */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '2.5rem', paddingLeft: '2rem', paddingRight: '1.5rem' }}>

                            <div ref={textRightRef} style={{ flex: '1 1 auto', fontFamily: 'var(--font-handwriting)', fontSize: '1.4rem', color: '#333', lineHeight: '2.2' }}>
                                <div style={{ paddingLeft: '1.5rem' }}>Bumi memiliki</div>
                                <div style={{ paddingLeft: '0.5rem' }}>banyak orang</div>

                                <div style={{ paddingLeft: '1rem' }}>
                                    <span style={{ position: 'relative', display: 'inline-block', color: '#e74c3c', fontWeight: 'bold' }}>
                                        Hebat
                                        <svg ref={underlineRef} width="86" height="18" viewBox="0 0 86 18" style={{ position: 'absolute', bottom: '-8px', left: '0', overflow: 'visible' }}>
                                            <path d="M 2 8 Q 22 14, 43 6 Q 64 -1, 83 9" fill="none" stroke="#e74c3c" strokeWidth="2.5" strokeLinecap="round" />
                                        </svg>
                                    </span>
                                </div>

                                <div style={{ paddingLeft: '2rem' }}>yaitu...</div>

                                <div style={{ paddingLeft: '0.25rem' }}>
                                    <span style={{ position: 'relative', display: 'inline-block', fontWeight: 'bold', padding: '0 0.35rem' }}>
                                        KAMU
                                        <svg ref={circleRef} width="128" height="56" viewBox="0 0 128 56" style={{ position: 'absolute', top: '-13px', left: '-14px', overflow: 'visible' }}>
                                            <path
                                                d="M 20 28 C 18 8, 45 4, 64 5 C 85 4, 112 9, 110 29
                                                   C 112 49, 85 53, 64 52 C 45 53, 18 48, 20 28 Z"
                                                fill="none" stroke="#f1c40f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                            />
                                        </svg>
                                    </span>
                                </div>

                                <div style={{ paddingLeft: '1.75rem' }}>Salah</div>
                                <div style={{ paddingLeft: '3rem' }}>satunya</div>
                            </div>

                            {/* Illustration column: speech bubble stacked directly above the
                                character-on-globe group. Normal flow (flex column), not
                                absolute — so it can never spill past the page edge or get
                                clipped, and everything scales together as one block. */}
                            <div style={{ flex: '0 0 170px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1.5rem' }}>

                                {/* Couple-on-globe group: a single relative box sized so the
                                    pair's feet always land right on the globe's top edge. */}
                                <div style={{ position: 'relative', width: '150px', height: '150px', marginTop: '80px' }}>
                                    
                                    {/* Speech bubble — sudden shout, positioned above male character */}
                                    <div ref={bubbleRef} style={{ position: 'absolute', top: '-90px', left: '-30px', zIndex: 15 }}>
                                        <svg width="140" height="90" viewBox="0 0 140 90" style={{ overflow: 'visible' }}>
                                            {/* Jagged "shout" bubble outline pointing to the boy (at x=52 in wrapper, tail points there) */}
                                            <path
                                                d="M 25 25 L 15 10 L 40 20 L 55 5 L 75 18 L 95 8 L 105 22 L 125 15 L 120 35 L 135 45 L 115 55 L 125 70 L 100 60 L 90 75 L 75 62 L 52 88 L 48 65 L 25 75 L 20 55 L 5 45 L 15 35 Z"
                                                fill="#ffffff" stroke="#333" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
                                            />
                                            <text x="70" y="42" fontFamily="var(--font-handwriting)" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#e74c3c">
                                                AKU SAYANG
                                            </text>
                                            <text x="70" y="58" fontFamily="var(--font-handwriting)" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#e74c3c">
                                                REVA!
                                            </text>
                                        </svg>
                                    </div>

                                    {/* Globe — large, colored, hand-drawn wobbly edge */}
                                    <svg
                                        ref={globeRef}
                                        width="130"
                                        height="130"
                                        viewBox="0 0 100 100"
                                        style={{ position: 'absolute', left: '10px', bottom: '0' }}
                                    >
                                        <path 
                                            d="M 50 5 C 75 3, 97 22, 95 50 C 93 76, 75 97, 50 95 C 26 93, 3 76, 5 50 C 7 24, 26 7, 50 5 Z" 
                                            fill="#aed4f7" stroke="#333" strokeWidth="2.5" strokeLinejoin="round" 
                                        />
                                        <path d="M 14 32 C 26 18, 46 22, 44 38 C 42 52, 20 54, 12 44 C 8 40, 10 36, 14 32 Z" fill="#7fc47f" stroke="#333" strokeWidth="1.5" strokeLinejoin="round" />
                                        <path d="M 55 10 C 72 6, 90 18, 84 34 C 78 48, 58 46, 52 32 C 48 22, 48 14, 55 10 Z" fill="#7fc47f" stroke="#333" strokeWidth="1.5" strokeLinejoin="round" />
                                        <path d="M 26 58 C 42 54, 60 64, 54 80 C 48 94, 26 96, 18 82 C 12 72, 16 62, 26 58 Z" fill="#7fc47f" stroke="#333" strokeWidth="1.5" strokeLinejoin="round" />
                                        <path d="M 70 55 C 86 58, 92 74, 80 82 C 70 88, 58 78, 60 66 C 61 60, 65 56, 70 55 Z" fill="#7fc47f" stroke="#333" strokeWidth="1.5" strokeLinejoin="round" />
                                        <path d="M 20 30 Q 35 45, 30 60 M 60 15 Q 68 30, 62 42 M 30 68 Q 45 72, 55 82" fill="none" stroke="#3f7fc7" strokeWidth="1.2" opacity="0.5" />
                                    </svg>

                                    {/* Couple — shifted up (top: -23px) so their feet (at y=52) rest exactly 
                                        on the globe's top edge (at y=26.5 relative to the 150x150 wrapper) */}
                                    <div style={{ position: 'absolute', left: '50%', top: '-23px', transform: 'translateX(-50%)', zIndex: 8 }}>
                                        <svg width="74" height="52" viewBox="0 0 74 52" style={{ overflow: 'visible' }}>
                                            {/* Action lines above their heads — surprised/exclaiming */}
                                            <path d="M 30 4 L 26 -5 M 37 1 L 37 -7 M 44 4 L 48 -5" fill="none" stroke="#f1c40f" strokeWidth="2" strokeLinecap="round" />

                                            <g ref={bodyRef}>
                                                {/* ── Male figure (left) ── */}
                                                <circle cx="22" cy="11" r="5.5" fill="none" stroke="#333" strokeWidth="2.2" />
                                                <line x1="22" y1="16.5" x2="22" y2="34" stroke="#333" strokeWidth="2.2" strokeLinecap="round" />
                                                {/* free arm (swings) */}
                                                <line ref={maleFreeArmRef} x1="22" y1="22" x2="22" y2="34" stroke="#333" strokeWidth="2.2" strokeLinecap="round" />
                                                {/* hand held toward partner (fixed) */}
                                                <line x1="22" y1="23" x2="34" y2="25" stroke="#333" strokeWidth="2.2" strokeLinecap="round" />
                                                {/* legs (straight down initially, swung via GSAP) */}
                                                <line ref={maleOuterLegRef} x1="22" y1="34" x2="22" y2="52" stroke="#333" strokeWidth="2.2" strokeLinecap="round" />
                                                <line ref={maleInnerLegRef} x1="22" y1="34" x2="22" y2="52" stroke="#333" strokeWidth="2.2" strokeLinecap="round" />

                                                {/* ── Clasped hands — small joining mark so it reads clearly ── */}
                                                <circle cx="37" cy="25" r="2" fill="#333" />

                                                {/* ── Female figure (right) ── */}
                                                <circle cx="52" cy="11" r="5.5" fill="none" stroke="#333" strokeWidth="2.2" />
                                                {/* small hair bow, to distinguish at a glance */}
                                                <path d="M 52 5.5 L 48 3 L 49 6 L 48 9 Z" fill="#f4a6c1" stroke="#333" strokeWidth="1" strokeLinejoin="round" />
                                                <path d="M 52 5.5 L 56 3 L 55 6 L 56 9 Z" fill="#f4a6c1" stroke="#333" strokeWidth="1" strokeLinejoin="round" />
                                                {/* dress-shaped torso instead of a straight line */}
                                                <path d="M 47 34 L 45.5 16.5 L 58.5 16.5 L 57 34 Z" fill="#f4a6c1" stroke="#333" strokeWidth="2" strokeLinejoin="round" />
                                                {/* hand held toward partner (fixed) */}
                                                <line x1="52" y1="23" x2="40" y2="25" stroke="#333" strokeWidth="2.2" strokeLinecap="round" />
                                                {/* free arm (swings) */}
                                                <line ref={femaleFreeArmRef} x1="52" y1="22" x2="52" y2="34" stroke="#333" strokeWidth="2.2" strokeLinecap="round" />
                                                {/* legs peeking out from under the dress (straight down initially, swung via GSAP) */}
                                                <line ref={femaleInnerLegRef} x1="52" y1="34" x2="52" y2="52" stroke="#333" strokeWidth="2.2" strokeLinecap="round" />
                                                <line ref={femaleOuterLegRef} x1="52" y1="34" x2="52" y2="52" stroke="#333" strokeWidth="2.2" strokeLinecap="round" />
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}