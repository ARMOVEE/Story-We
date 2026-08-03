"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene13PromiseProps {
    isActive?: boolean;
    onNext?: () => void;
    onPrev?: () => void;
}

// ── Kanvas tanda tangan — bisa digambar langsung pakai mouse (desktop) ──
function SignatureCanvas({ width = 140, height = 60 }: { width?: number; height?: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);
    const lastPos = useRef<{ x: number; y: number } | null>(null);
    const [hasSigned, setHasSigned] = useState(false);

    const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        isDrawing.current = true;
        lastPos.current = getPos(e);
    };

    const handleMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing.current || !canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        const pos = getPos(e);
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(lastPos.current!.x, lastPos.current!.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        lastPos.current = pos;
        if (!hasSigned) setHasSigned(true);
    };

    const handleUp = () => {
        isDrawing.current = false;
        lastPos.current = null;
    };

    const handleClear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSigned(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{
                    border: '1.5px dashed rgba(0,0,0,0.25)',
                    borderRadius: '6px',
                    background: 'transparent',
                    cursor: 'crosshair',
                    touchAction: 'none',
                }}
                onMouseDown={handleDown}
                onMouseMove={handleMove}
                onMouseUp={handleUp}
                onMouseLeave={handleUp}
            />
            <button
                type="button"
                onClick={handleClear}
                style={{
                    fontFamily: 'var(--font-handwriting)',
                    fontSize: '0.8rem',
                    color: hasSigned ? '#e8729a' : '#bbb',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                }}
            >
                Hapus &amp; ulangi
            </button>
        </div>
    );
}

export default function Scene13Promise({ onNext, onPrev, isActive = true }: Scene13PromiseProps) {
    const leftTextRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const underlineRef = useRef<SVGSVGElement>(null);
    const signsRef = useRef<HTMLDivElement>(null);

    const rightTextRef = useRef<HTMLDivElement>(null);
    const circlesRef = useRef<SVGSVGElement>(null);
    const heartsRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!isActive) return;
        const tl = gsap.timeline();

        if (titleRef.current) {
            tl.fromTo(titleRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5 }, 0.5);
        }

        if (underlineRef.current) {
            const underlinePath = underlineRef.current.querySelector('path');
            tl.fromTo(underlinePath,
                { strokeDasharray: 500, strokeDashoffset: 500 },
                { strokeDashoffset: 0, duration: 1, ease: "power2.out" },
                0.8
            );
        }

        if (leftTextRef.current) {
            tl.fromTo(leftTextRef.current.children,
                { opacity: 0, x: -10 },
                { opacity: 1, x: 0, duration: 0.6, stagger: 0.3 },
                1.2
            );
        }

        if (signsRef.current) {
            tl.fromTo(signsRef.current.children,
                { opacity: 0 },
                { opacity: 1, duration: 0.8, stagger: 0.4 },
                2.5
            );
        }

        if (rightTextRef.current) {
            tl.fromTo(rightTextRef.current.children,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.4 },
                3.8
            );
        }

        if (circlesRef.current) {
            const circles = circlesRef.current.querySelectorAll('path');
            tl.fromTo(circles,
                { strokeDasharray: 200, strokeDashoffset: 200 },
                { strokeDashoffset: 0, duration: 0.8, stagger: 0.5, ease: "power2.out" },
                5.8
            );
        }

        if (heartsRef.current) {
            const heartsPath = heartsRef.current.querySelector('path');
            tl.fromTo(heartsPath,
                { strokeDasharray: 800, strokeDashoffset: 800 },
                { strokeDashoffset: 0, duration: 1.5, ease: "power1.inOut" },
                7.3
            );
        }

        return () => { tl.kill(); };
    }, []);

    return (
        <>
            {isActive && onPrev && (
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

            {isActive && onNext && (
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

                        <div style={{ padding: '5rem 2rem 2rem 2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>

                            {/* Title: RevRIZAL */}
                            <div style={{ position: 'relative', marginBottom: '3rem' }}>
                                <div ref={titleRef} style={{ fontFamily: 'var(--font-handwriting)', fontSize: '3.5rem', color: '#1B4F72', letterSpacing: '2px', marginLeft: '1rem', position: 'relative', zIndex: 2 }}>
                                    <span style={{ fontSize: '4.5rem' }}>R</span>ev<span style={{ fontSize: '4rem' }}>RIZAL</span>
                                </div>
                                <svg ref={underlineRef} width="250" height="40" viewBox="0 0 250 40" style={{ position: 'absolute', bottom: '-15px', left: '-5px', zIndex: 1, pointerEvents: 'none', overflow: 'visible' }}>
                                    <path d="M 5 20 Q 40 5, 80 25 T 160 20 T 230 15 Q 240 10, 245 5" fill="none" stroke="#1B4F72" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                                </svg>
                            </div>

                            {/* Main Left Text */}
                            <div ref={leftTextRef} style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.4rem', color: '#333', display: 'flex', flexDirection: 'column', gap: '1.2rem', marginLeft: '1rem' }}>
                                <div>Sayang, tanda tangan</div>
                                <div>dibawah ini ya sayang . . . -</div>
                                <div style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>TTD JUGA</div>
                            </div>

                            {/* Kanvas tanda tangan — bisa digambar pakai mouse */}
                            <div ref={signsRef} style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem', marginTop: 'auto', marginBottom: '2rem', padding: '0 0.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                                    <SignatureCanvas />
                                    <span style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1rem', color: '#888' }}>Afrizal</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                                    <SignatureCanvas />
                                    <span style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1rem', color: '#888' }}>Reva</span>
                                </div>
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

                        <div style={{ padding: '6rem 3rem 2rem 3rem', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>

                            {/* Main Right Text */}
                            <div ref={rightTextRef} style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.4rem', color: '#333', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
                                <div style={{ textAlign: 'center' }}>Terima kasih</div>
                                <div style={{ textAlign: 'center' }}>sudah <span style={{ position: 'relative', padding: '0 5px' }}>menjadi</span> yang</div>
                                <div style={{ textAlign: 'center' }}>terbaik , kamu tetap</div>
                                <div style={{ textAlign: 'center' }}>yang <span style={{ position: 'relative', padding: '0 5px' }}>terbaik</span></div>
                                <div style={{ textAlign: 'center' }}>Hari ini, Esok dan</div>
                                <div style={{ textAlign: 'center' }}><span style={{ position: 'relative', padding: '0 5px' }}>Seterusnya</span> sayangkuu</div>
                            </div>

                            {/* Purple circles drawn over specific words */}
                            <svg ref={circlesRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1, overflow: 'visible' }}>
                                <path d="M 120 155 C 100 150, 100 180, 150 180 C 195 180, 200 155, 175 148 C 150 142, 115 150, 118 165" fill="none" stroke="#7D3C98" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                                <path d="M 130 248 C 110 245, 110 270, 155 272 C 190 275, 205 255, 180 243 C 160 235, 125 245, 125 255" fill="none" stroke="#7D3C98" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                                <path d="M 85 338 C 55 330, 45 365, 105 365 C 165 365, 185 338, 150 330 C 115 320, 65 335, 75 350" fill="none" stroke="#7D3C98" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                            </svg>

                            {/* Purple interconnected hearts drawing at the bottom */}
                            <div style={{ marginTop: 'auto', marginBottom: '4rem', display: 'flex', justifyContent: 'center', position: 'relative' }}>
                                <svg ref={heartsRef} width="220" height="80" viewBox="0 0 220 80" style={{ overflow: 'visible' }}>
                                    <path
                                        d="M 50 60 C 20 70, 0 40, 20 20 C 35 5, 55 20, 55 20 C 55 20, 75 5, 90 20 C 110 40, 90 70, 60 60 C 40 55, 50 40, 70 30 C 90 20, 110 5, 125 20 C 145 40, 125 70, 95 60 C 65 50, 180 60, 200 65 L 195 55 M 200 65 L 190 72"
                                        fill="none"
                                        stroke="#7D3C98"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        opacity="0.8"
                                    />
                                </svg>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}