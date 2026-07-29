"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene8PuzzleProps {
    onNext?: () => void;
    onPrev?: () => void;
}

export default function Scene8Puzzle({ onNext, onPrev }: Scene8PuzzleProps) {
    const pageRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const svgOverlayRef = useRef<SVGSVGElement>(null);
    const [showAnswer, setShowAnswer] = useState(false);

    // Grid 7x7
    // REVA is vertical at Col 3, Row 2..5
    // FOREVER is diagonal from Row 0, Col 0 to Row 6, Col 6
    const grid = [
        ['F', 'B', 'C', 'H', 'J', 'K', 'L'],
        ['A', 'O', 'X', 'W', 'T', 'S', 'U'],
        ['Z', 'L', 'R', 'R', 'P', 'X', 'D'],
        ['M', 'N', 'Q', 'E', 'Z', 'V', 'Y'],
        ['I', 'J', 'K', 'V', 'V', 'B', 'N'],
        ['O', 'P', 'G', 'A', 'W', 'E', 'T'],
        ['U', 'M', 'C', 'D', 'X', 'Y', 'R'],
    ];

    useEffect(() => {
        const tl = gsap.timeline();

        if (textRef.current) {
            tl.fromTo(textRef.current.children,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out' },
                0.2
            );
        }

        if (gridRef.current) {
            tl.fromTo(gridRef.current.children,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.5, stagger: 0.02, ease: 'back.out(1.5)' },
                1.0
            );
        }

        return () => { tl.kill(); };
    }, []);

    useEffect(() => {
        if (showAnswer && svgOverlayRef.current) {
            const paths = svgOverlayRef.current.querySelectorAll('path');

            gsap.fromTo(paths,
                { strokeDasharray: 1000, strokeDashoffset: 1000 },
                { strokeDashoffset: 0, duration: 1.5, stagger: 0.5, ease: 'power2.inOut' }
            );

            gsap.fromTo(svgOverlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            );
        }
    }, [showAnswer]);

    return (
        <>
            {/* Hand-drawn SVG filters — required by the give-up button's sketchy look */}
            <svg height="0" width="0" style={{ position: 'absolute' }}>
                <defs>
                    <filter id="pzHandDrawnNoise">
                        <feTurbulence result="noise" numOctaves={8} baseFrequency={0.1} type="fractalNoise" />
                        <feDisplacementMap yChannelSelector="G" xChannelSelector="R" scale={3} in2="noise" in="SourceGraphic" />
                    </filter>
                    <filter id="pzHandDrawnNoise2">
                        <feTurbulence result="noise" numOctaves={8} baseFrequency={0.1} seed={1010} type="fractalNoise" />
                        <feDisplacementMap yChannelSelector="G" xChannelSelector="R" scale={3} in2="noise" in="SourceGraphic" />
                    </filter>
                    <filter id="pzHandDrawnNoiseT">
                        <feTurbulence result="noise" numOctaves={8} baseFrequency={0.1} type="fractalNoise" />
                        <feDisplacementMap yChannelSelector="G" xChannelSelector="R" scale={6} in2="noise" in="SourceGraphic" />
                    </filter>
                    <filter id="pzHandDrawnNoiseT2">
                        <feTurbulence result="noise" numOctaves={8} baseFrequency={0.1} seed={1010} type="fractalNoise" />
                        <feDisplacementMap yChannelSelector="G" xChannelSelector="R" scale={6} in2="noise" in="SourceGraphic" />
                    </filter>
                </defs>
            </svg>

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

            {onNext && showAnswer && (
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
                {/* ── LEFT PAGE: Blank or slight decoration ── */}
                <div className={`${styles.pageLeft} ${styles.linedPage}`}>
                    <div className={styles.pageContent}>
                        <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999' }}>
                            Date:
                        </div>
                        <div style={{ position: 'absolute', bottom: '3rem', right: '3rem', opacity: 0.6 }}>
                            <svg width="80" height="80" viewBox="0 0 100 100">
                                <path d="M 30 50 C 30 20, 70 20, 70 50 C 70 80, 30 80, 30 50 Z" fill="none" stroke="#333" strokeWidth="2" strokeDasharray="5,5" />
                                <text x="50" y="55" fontFamily="var(--font-handwriting)" fontSize="14" textAnchor="middle" fill="#333">?</text>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PAGE: The Puzzle ── */}
                <div className={`${styles.dummyPage} ${styles.linedPage}`} style={{ zIndex: 10 }}>
                    <div className={styles.pageContent}>
                        <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999' }}>
                            Date:
                        </div>

                        <div style={{ marginTop: '2.5rem', padding: '0 1rem', display: 'flex', flexDirection: 'column', height: '100%' }}>

                            <div ref={textRef} style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#333', lineHeight: '1.8' }}>
                                <div>Dibawah ini adalah bentuk</div>
                                <div>Teka-Teki yang kamu gausa mikir</div>
                                <div>lagi, kesian soalnya rumit</div>
                            </div>

                            {/* Puzzle Area — REVA (vertical) + FOREVER (diagonal) hidden inside the grid */}
                            <div style={{ position: 'relative', marginTop: '1rem', width: '250px', margin: '1rem auto 0', fontFamily: 'var(--font-handwriting)', fontSize: '1.2rem', color: '#333' }}>

                                <svg ref={svgOverlayRef} width="300" height="310" style={{ position: 'absolute', top: '-10px', left: '-25px', pointerEvents: 'none', opacity: 0, zIndex: 5 }}>
                                    {/* Border around entire grid — wavy hand-drawn loop, purple, like the notebook photo */}
                                    <path
                                        d="M 14 8 Q 8 2, 22 3 Q 60 -1, 130 4 Q 200 -2, 268 6
                                           Q 292 10, 288 30 Q 291 90, 285 150
                                           Q 292 210, 286 265 Q 290 285, 268 288
                                           Q 200 294, 130 289 Q 60 295, 20 287
                                           Q 4 283, 9 260 Q 3 200, 10 150
                                           Q 2 90, 11 35 Q 6 15, 14 8 Z"
                                        fill="none" stroke="#8b6fc9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                    />

                                    {/* REVA — vertical, hand-drawn oval hugging col 3, rows 2..5 */}
                                    <path
                                        d="M 150 90
                                           C 128 92, 126 140, 133 168
                                           C 126 195, 130 235, 152 248
                                           C 174 236, 178 196, 171 168
                                           C 178 141, 174 94, 150 90 Z"
                                        fill="none" stroke="#4e7cc4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                                    />

                                    {/* FOREVER — diagonal, hand-drawn wobbly loop from F (top-left) to R (bottom-right)
                                        Recomputed to hug the actual diagonal cell centers (7 cols, gap 10px 0,
                                        lineHeight 31px, container 250px wide, overlay offset top:-10 left:-25),
                                        with a consistent ~16px perpendicular offset on each side so the band
                                        stays parallel to the letters instead of wandering off-diagonal. */}
                                    <path
                                        d="M 33 14.2
                                           C 28 22.2, 27.8 28, 30.8 36
                                           C 40.66 47.31, 56.64 65.69, 66.5 77
                                           C 76.36 88.31, 92.34 106.69, 102.2 118
                                           C 112.06 129.31, 128.04 147.69, 137.9 159
                                           C 147.76 170.31, 163.74 188.69, 173.6 200
                                           C 183.46 211.31, 199.44 229.69, 209.4 241
                                           C 219.26 252.31, 235.24 270.69, 245.1 282
                                           C 253.1 286, 261 276.8, 267 282.8
                                           C 271 274.8, 275.2 271, 269.2 261
                                           C 259.34 249.69, 243.36 231.31, 233.5 220
                                           C 223.64 208.69, 207.66 190.31, 197.8 179
                                           C 187.94 167.69, 171.96 149.31, 162.1 138
                                           C 152.24 126.69, 136.16 108.31, 126.3 97
                                           C 116.44 85.69, 100.46 67.31, 90.6 56
                                           C 80.74 44.69, 64.76 26.31, 54.9 15
                                           C 48.9 19, 39 20.2, 33 14.2
                                           Z"
                                        fill="none" stroke="#e74c3c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                                    />
                                </svg>

                                <div ref={gridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px 0', textAlign: 'center', lineHeight: '31px' }}>
                                    {grid.map((row, rIndex) =>
                                        row.map((letter, cIndex) => (
                                            <div key={`${rIndex}-${cIndex}`}>{letter}</div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Give Up Button — hand-drawn sketchy style */}
                            {!showAnswer && (
                                <div style={{ marginTop: 'auto', textAlign: 'center', paddingBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                                    <button
                                        className={styles.pzGiveUpBtn}
                                        onClick={() => setShowAnswer(true)}
                                    >
                                        <svg
                                            className={styles.pzGiveUpCosm}
                                            fill="#000000"
                                            width="28"
                                            height="28"
                                            viewBox="0 0 256 256"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M243.07324,157.43945c-1.2334-1.47949-23.18847-27.34619-60.46972-41.05859-1.67579-17.97412-8.25293-34.36328-18.93653-46.87158C149.41309,52.8208,128.78027,44,104,44,54.51074,44,22.10059,88.57715,20.74512,90.4751a3.99987,3.99987,0,0,0,6.50781,4.65234C27.5625,94.6958,58.68359,52,104,52c22.36816,0,40.89648,7.85107,53.584,22.70508,8.915,10.437,14.65625,23.9541,16.65528,38.894A133.54185,133.54185,0,0,0,136,108c-25.10742,0-46.09473,6.48486-60.69434,18.75391-12.65234,10.63379-19.91015,25.39355-19.91015,40.49463a43.61545,43.61545,0,0,0,12.69336,31.21923C76.98438,207.3208,89.40234,212,104,212c23.98047,0,44.37305-9.4668,58.97461-27.37744,12.74512-15.6333,20.05566-37.145,20.05566-59.01953,0-.1128-.001-.22559-.001-.33838,33.62988,13.48486,53.62207,36.96631,53.89746,37.2959a4.00015,4.00015,0,0,0,6.14648-5.1211ZM104,204c-27.89746,0-40.60449-19.05078-40.60449-36.75146C63.39551,142.56592,86.11621,116,136,116a124.37834,124.37834,0,0,1,38.97266,6.32617q.05712,1.63038.05761,3.27686C175.03027,177.07129,139.29785,204,104,204Z" />
                                        </svg>
                                        <svg
                                            className={styles.pzGiveUpHighlight}
                                            viewBox="0 0 144.75738 77.18431"
                                            preserveAspectRatio="none"
                                        >
                                            <g transform="translate(-171.52826,-126.11624)">
                                                <g fill="none" strokeWidth="17" strokeLinecap="round" strokeMiterlimit="10">
                                                    <path d="M180.02826,169.45123c0,0 12.65228,-25.55115 24.2441,-25.66863c6.39271,-0.06479 -5.89143,46.12943 4.90937,50.63857c10.22345,4.2681 24.14292,-52.38336 37.86455,-59.80493c3.31715,-1.79413 -5.35094,45.88889 -0.78872,58.34589c5.19371,14.18125 33.36934,-58.38221 36.43049,-56.91633c4.67078,2.23667 -0.06338,44.42744 5.22574,47.53647c6.04041,3.55065 19.87185,-20.77286 19.87185,-20.77286" />
                                                </g>
                                            </g>
                                        </svg>
                                        Nyerah?
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}