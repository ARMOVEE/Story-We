"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene8PuzzleProps {
    onNext?: () => void;
}

export default function Scene8Puzzle({ onNext }: Scene8PuzzleProps) {
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

        // 1. Fade in text
        if (textRef.current) {
            tl.fromTo(textRef.current.children,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out' },
                0.2
            );
        }

        // 2. Fade in puzzle grid
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
                        {/* Maybe a small doodle on the left page */}
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
                            
                            {/* Text Header */}
                            <div ref={textRef} style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#333', lineHeight: '1.8' }}>
                                <div>Dibawah ini adalah bentuk</div>
                                <div>Teka-Teki yang kamu gausa mikir</div>
                                <div>lagi, kesian soalnya rumit</div>
                            </div>

                            {/* Puzzle Area */}
                            <div style={{ position: 'relative', marginTop: '1rem', width: '250px', margin: '1rem auto 0', fontFamily: 'var(--font-handwriting)', fontSize: '1.2rem', color: '#333' }}>
                                
                                {/* SVG Overlay for Highlights and Border */}
                                <svg ref={svgOverlayRef} width="300" height="250" style={{ position: 'absolute', top: '-10px', left: '-25px', pointerEvents: 'none', opacity: 0, zIndex: 5 }}>
                                    
                                    {/* Big Blue Border around everything */}
                                    <path d="M 10 30 Q 15 5, 40 10 L 260 15 Q 280 15, 275 40 L 265 220 Q 260 240, 230 235 L 20 220 Q 5 210, 10 180 Z" fill="none" stroke="#4e7cc4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    
                                    {/* Vertical Circle for REVA (Col 3, Row 2-5)
                                        Approx positions: 
                                        Rows are ~31px apart. Let's say top is 15px.
                                        Row 2 y = 15 + 2*31 = 77
                                        Row 5 y = 15 + 5*31 = 170
                                        Col 3 x = 25 (padding) + 3 * (250/7) = 25 + 107 = 132
                                    */}
                                    <path d="M 125 70 C 110 70, 110 180, 125 180 C 145 180, 145 70, 125 70 Z" fill="none" stroke="#4e7cc4" strokeWidth="2" />
                                    
                                    {/* Diagonal Circle for FOREVER (Row 0, Col 0 to Row 6, Col 6)
                                        Start: x=35, y=15
                                        End: x=250, y=200
                                    */}
                                    <path d="M 30 15 C 20 5, 260 185, 250 205 C 240 220, 10 30, 30 15 Z" fill="none" stroke="#e74c3c" strokeWidth="2" />

                                </svg>

                                {/* Grid */}
                                <div ref={gridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px 0', textAlign: 'center', lineHeight: '31px' }}>
                                    {grid.map((row, rIndex) => 
                                        row.map((letter, cIndex) => (
                                            <div key={`${rIndex}-${cIndex}`}>{letter}</div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Give Up Button */}
                            {!showAnswer && (
                                <div style={{ marginTop: 'auto', textAlign: 'center', paddingBottom: '2rem' }}>
                                    <button 
                                        onClick={() => setShowAnswer(true)}
                                        style={{
                                            fontFamily: 'var(--font-handwriting)',
                                            fontSize: '1.2rem',
                                            padding: '0.5rem 1.5rem',
                                            background: 'transparent',
                                            border: '2px dashed #e74c3c',
                                            borderRadius: '20px',
                                            color: '#e74c3c',
                                            cursor: 'pointer',
                                        }}
                                    >
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
