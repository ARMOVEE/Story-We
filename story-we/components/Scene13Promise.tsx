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

// ── Doodle kelinci kecil, gaya sketsa tangan ──
function BunnyDoodle({
    size = 60,
    color = '#1a1a1a',
    tilt = 0,
    dressColor = '#fff',
    earInnerColor = '#fff',
}: { size?: number; color?: string; tilt?: number; dressColor?: string; earInnerColor?: string }) {
    return (
        <svg width={size} height={size * 1.1} viewBox="0 0 60 66" style={{ transform: `rotate(${tilt}deg)`, overflow: 'visible' }}>
            {/* telinga */}
            <path d="M20 22 C16 8, 12 2, 16 1 C21 0, 25 12, 26 24" fill={earInnerColor} stroke={color} strokeWidth="2" strokeLinecap="round" />
            <path d="M36 22 C40 8, 44 2, 40 1 C35 0, 31 12, 30 24" fill={earInnerColor} stroke={color} strokeWidth="2" strokeLinecap="round" />
            {/* kepala */}
            <circle cx="28" cy="36" r="16" fill="#fff" stroke={color} strokeWidth="2" />
            {/* mata */}
            <circle cx="23" cy="35" r="1.6" fill={color} />
            <circle cx="33" cy="35" r="1.6" fill={color} />
            {/* pipi */}
            <circle cx="19" cy="40" r="2.5" fill="#f9b4c0" opacity="0.7" />
            <circle cx="37" cy="40" r="2.5" fill="#f9b4c0" opacity="0.7" />
            {/* mulut */}
            <path d="M25 41 Q28 44 31 41" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
            {/* badan kecil */}
            <path d="M16 50 C16 60, 40 60, 40 50" fill={dressColor} stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

// ── Doodle tulip kecil ──
function TulipDoodle({ size = 30 }: { size?: number }) {
    return (
        <svg width={size} height={size * 1.5} viewBox="0 0 20 30" style={{ overflow: 'visible' }}>
            <path d="M10 15 L10 30" stroke="#8bc34a" strokeWidth="2" strokeLinecap="round" />
            <path d="M10 25 Q15 22 18 18 Q12 18 10 25" fill="#8bc34a" />
            <path d="M10 25 Q5 22 2 18 Q8 18 10 25" fill="#8bc34a" />
            <path d="M4 5 C4 15, 16 15, 16 5 L13 10 L10 4 L7 10 Z" fill="#ffb74d" stroke="#1a1a1a" strokeWidth="1" strokeLinejoin="round" />
        </svg>
    );
}

// ── Doodle bunga kecil ──
function FlowerDoodle({ size = 26, color = '#1a1a1a' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 26 26" style={{ overflow: 'visible' }}>
            <g fill="#fff" stroke={color} strokeWidth="1.6">
                <ellipse cx="13" cy="7" rx="4" ry="5" />
                <ellipse cx="13" cy="19" rx="4" ry="5" />
                <ellipse cx="6" cy="13" rx="5" ry="4" />
                <ellipse cx="20" cy="13" rx="5" ry="4" />
            </g>
            <circle cx="13" cy="13" r="3" fill="#fce38a" stroke={color} strokeWidth="1.2" />
        </svg>
    );
}

// ── Doodle sparkle / bintang empat sudut ──
function SparkleDoodle({ size = 22, color = '#1a1a1a' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" style={{ overflow: 'visible' }}>
            <path
                d="M12 1 C12.5 8, 14.5 10.5, 22 11 C14.5 11.5, 12.5 14, 12 22 C11.5 14, 9.5 11.5, 2 11 C9.5 10.5, 11.5 8, 12 1 Z"
                fill="none"
                stroke={color}
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// ── Coretan pulpen merah — lingkaran tidak beraturan di atas kata ──
function RedCircle({ width = 90, height = 40, style }: { width?: number; height?: number; style?: React.CSSProperties }) {
    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            style={{ position: 'absolute', pointerEvents: 'none', overflow: 'visible', ...style }}
        >
            <path
                d={`M ${width * 0.5} ${height * 0.08}
                    C ${width * 0.15} ${height * 0.0}, ${width * 0.0} ${height * 0.35}, ${width * 0.12} ${height * 0.55}
                    C ${width * 0.22} ${height * 0.78}, ${width * 0.55} ${height * 0.95}, ${width * 0.8} ${height * 0.8}
                    C ${width * 1.02} ${height * 0.65}, ${width * 0.95} ${height * 0.3}, ${width * 0.7} ${height * 0.15}
                    C ${width * 0.55} ${height * 0.05}, ${width * 0.45} ${height * 0.12}, ${width * 0.5} ${height * 0.2}`}
                fill="none"
                stroke="#d64545"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

// ── Coretan pulpen merah — garis bawah bergelombang ──
function RedUnderline({ width = 120, style }: { width?: number; style?: React.CSSProperties }) {
    return (
        <svg
            width={width}
            height="14"
            viewBox={`0 0 ${width} 14`}
            style={{ position: 'absolute', pointerEvents: 'none', overflow: 'visible', ...style }}
        >
            <path
                d={`M2 7 Q ${width * 0.25} 2, ${width * 0.5} 7 T ${width - 2} 7`}
                fill="none"
                stroke="#d64545"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

// ── Stick figure sederhana, bisa jadi "orang jahat" (tanduk+ekor) ──
function StickFigure({
    variant = 'normal',
    size = 70,
    color = '#1a1a1a',
    earColor,
}: { variant?: 'normal' | 'villain' | 'bunnyGirl'; size?: number; color?: string; earColor?: string }) {
    const h = size * 1.5;
    return (
        <svg width={size} height={h} viewBox="0 0 70 105" style={{ overflow: 'visible' }}>
            {variant === 'villain' && (
                <>
                    <path d="M22 14 L16 2" stroke="#c0392b" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M32 12 L34 0" stroke="#c0392b" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M46 55 Q58 60, 52 72" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </>
            )}
            {variant === 'bunnyGirl' && (
                <>
                    <path d="M22 12 C16 -2, 12 -6, 16 -8 C21 -10, 25 0, 27 14" fill="#ffb4cf" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
                    <path d="M40 12 C46 -2, 50 -6, 46 -8 C41 -10, 37 0, 35 14" fill="#ffb4cf" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
                </>
            )}
            {/* kepala */}
            <circle cx="35" cy="20" r="14" fill="#fff" stroke={color} strokeWidth="2.5" />
            {/* wajah simple */}
            {variant === 'villain' ? (
                <>
                    <path d="M28 16 L32 18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M42 16 L38 18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M29 26 Q35 22, 41 26" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" />
                </>
            ) : (
                <>
                    <circle cx="31" cy="19" r="1.8" fill={color} />
                    <circle cx="39" cy="19" r="1.8" fill={color} />
                    {variant === 'bunnyGirl' ? (
                        <path d="M35 24 L31 22 M35 24 L39 22" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    ) : (
                        <path d="M31 25 Q35 28, 39 25" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    )}
                </>
            )}
            {/* badan */}
            <line x1="35" y1="34" x2="35" y2="68" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            {/* tangan */}
            {variant === 'bunnyGirl' ? (
                <>
                    <line x1="35" y1="45" x2="18" y2="58" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="18" cy="58" r="4" fill="#d64545" />
                    <line x1="35" y1="45" x2="52" y2="50" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                </>
            ) : variant === 'normal' ? (
                <>
                    <line x1="35" y1="45" x2="18" y2="50" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="35" y1="45" x2="52" y2="58" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                </>
            ) : (
                <>
                    <line x1="35" y1="45" x2="18" y2="58" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="35" y1="45" x2="52" y2="58" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                </>
            )}
            {/* kaki */}
            <line x1="35" y1="68" x2="22" y2="98" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="35" y1="68" x2="48" y2="98" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );
}

export default function Scene13Promise({ onNext, onPrev, isActive = true }: Scene13PromiseProps) {
    const leftTextRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const underlineRef = useRef<SVGSVGElement>(null);
    const signsRef = useRef<HTMLDivElement>(null);

    const topDoodleRef = useRef<HTMLDivElement>(null);
    const paraRef = useRef<HTMLDivElement>(null);
    const guardLineRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<HTMLDivElement>(null);
    const heartRef = useRef<HTMLDivElement>(null);
    const hugRef = useRef<HTMLDivElement>(null);
    const bunniesRef = useRef<HTMLDivElement>(null);
    const coupleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isActive) return;
        const tl = gsap.timeline();

        // ── Halaman kiri ──
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

        // ── Halaman kanan ──
        if (topDoodleRef.current) {
            tl.fromTo(topDoodleRef.current.children,
                { opacity: 0, scale: 0.85 },
                { opacity: 1, scale: 1, duration: 0.6, stagger: 0.25, ease: 'back.out(1.6)' },
                0.6
            );
        }
        if (paraRef.current) {
            tl.fromTo(paraRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.6 },
                1.6
            );
        }
        if (guardLineRef.current) {
            tl.fromTo(guardLineRef.current,
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.5 },
                2.6
            );
        }
        if (sceneRef.current) {
            tl.fromTo(sceneRef.current.children,
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.3 },
                3.1
            );
        }
        if (heartRef.current) {
            tl.fromTo(heartRef.current,
                { opacity: 0, scale: 0.6 },
                { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' },
                4.3
            );
        }
        if (hugRef.current) {
            tl.fromTo(hugRef.current,
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.5 },
                4.8
            );
        }
        if (bunniesRef.current) {
            tl.fromTo(bunniesRef.current.children,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.25 },
                5.3
            );
        }
        if (coupleRef.current) {
            tl.fromTo(coupleRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.6 },
                5.9
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
                {/* ── LEFT PAGE (tetap seperti semula) ── */}
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

                {/* ── RIGHT PAGE — didesain ulang meniru gambar referensi ── */}
                <div className={`${styles.dummyPage} ${styles.linedPage}`} style={{ zIndex: 10 }}>
                    <div className={styles.pageContent} style={{ position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '1.4rem', left: '1.6rem', fontFamily: 'var(--font-handwriting)', fontSize: '1rem', color: '#999', zIndex: 3 }}>
                            Date:
                        </div>

                        <div style={{ padding: '3.2rem 1.8rem 1.5rem 1.8rem', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                            <div ref={topDoodleRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100px', marginBottom: '1.5rem', width: '100%' }}>
                                {/* scattered hearts / symbols */}
                                <div style={{ position: 'absolute', left: '10px', top: '10px' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffb4cf"><path d="M12 21 C4 15, 1 10, 4 6 C6.5 3, 11 4, 12 8 C13 4, 17.5 3, 20 6 C23 10, 20 15, 12 21 Z"/></svg>
                                </div>
                                <div style={{ position: 'absolute', left: '50px', top: '40px' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffd1e3"><path d="M12 21 C4 15, 1 10, 4 6 C6.5 3, 11 4, 12 8 C13 4, 17.5 3, 20 6 C23 10, 20 15, 12 21 Z"/></svg>
                                </div>
                                <div style={{ position: 'absolute', left: '5px', top: '60px', fontFamily: 'var(--font-handwriting)', fontSize: '1.2rem', color: '#1a1a1a', fontWeight: 'bold' }}>
                                    &gt;&lt;
                                </div>
                                
                                {/* Bunnies and flower in the middle */}
                                <div style={{ position: 'absolute', left: '32%', top: '0', display: 'flex', alignItems: 'flex-end', gap: '5px' }}>
                                    <FlowerDoodle size={20} />
                                    <BunnyDoodle size={45} tilt={-5} dressColor="#f9b4c0" earInnerColor="#f9b4c0" />
                                    <BunnyDoodle size={45} tilt={5} dressColor="#d0e3ff" earInnerColor="#d0e3ff" />
                                    <div style={{ paddingBottom: '10px' }}>
                                        <TulipDoodle size={20} />
                                    </div>
                                </div>

                                {/* Text on the right */}
                                <div style={{ position: 'absolute', right: '0px', top: '25px', fontFamily: 'var(--font-handwriting)', fontSize: '1.2rem', color: '#1a1a1a', lineHeight: 1.3, fontWeight: 'bold' }}>
                                    nda bwOoyeh ada<br/>
                                    yang jahatin <span style={{ position: 'relative' }}>kaka-!!<RedUnderline width={60} style={{ left: '0px', bottom: '-4px' }} /></span> 😡
                                </div>
                            </div>

                            {/* ── Paragraf utama ── */}
                            <div ref={paraRef} style={{ position: 'relative', fontFamily: 'var(--font-handwriting)', fontSize: '1.5rem', fontWeight: 600, color: '#1a1a1a', lineHeight: 1.35, marginTop: '1rem', marginLeft: '1.5rem', zIndex: 5 }}>
                                aishh kalau ada yang jahatin kaka,<br />
                                kaka kasih tau{' '}
                                <span style={{ position: 'relative', display: 'inline-block' }}>
                                    aku
                                    <RedCircle width={55} height={35} style={{ top: '-4px', left: '-5px' }} />
                                </span>{' '}
                                yyaaa-!! 😼
                                <span style={{ position: 'absolute', right: '40px', top: '10px' }}><SparkleDoodle size={20}/></span>
                                <span style={{ position: 'absolute', right: '10px', top: '40px' }}><SparkleDoodle size={26}/></span>
                                <br />
                                aku bakal lindungin kaka, kaka<br />
                                janan takut yaa harus <span style={{ position: 'relative', display: 'inline-block' }}>
                                    berani,
                                    <RedUnderline width={70} style={{ bottom: '-2px', left: '0px' }} />
                                </span><br />
                                yyaaa walau badan aku kecil tapi<br />
                                <span style={{ position: 'relative', display: 'inline-block' }}>
                                    aku
                                    <RedCircle width={50} height={32} style={{ top: '-2px', left: '-5px' }} />
                                </span>{' '}
                                kuat dan pemberani kok-!!
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                                {/* Left side: guard text, heart, hug text */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginLeft: '0.5rem', zIndex: 5 }}>
                                    
                                    <div ref={guardLineRef} style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.4rem', fontWeight: 600, color: '#1a1a1a', lineHeight: 1.3 }}>
                                        aku akan <span style={{ position: 'relative', display: 'inline-block' }}>selalu jaga<RedUnderline width={90} style={{ bottom: '-2px', left: '0px' }} /></span> kaka<br />
                                        di manapun kaka berada
                                    </div>
                                    
                                    <div ref={heartRef} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '0.5rem' }}>
                                        <div style={{ position: 'relative' }}>
                                            <svg width="55" height="50" viewBox="0 0 46 42">
                                                <path d="M23 40 C6 29, 1 17, 8 9 C13 3, 21 6, 23 13 C25 6, 33 3, 38 9 C45 17, 40 29, 23 40 Z" fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinejoin="round" />
                                            </svg>
                                            <span style={{ position: 'absolute', right: '-15px', bottom: '5px', fontFamily: 'var(--font-handwriting)', fontSize: '2.5rem', color: '#1a1a1a', fontWeight: 'bold' }}>!</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '1rem', marginTop: '-20px' }}>
                                            <div style={{ fontSize: '1.8rem' }}>😼💗</div>
                                        </div>
                                    </div>
                                    
                                    <div ref={hugRef} style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.4rem', fontWeight: 600, color: '#1a1a1a', textAlign: 'center', marginTop: '0.2rem' }}>
                                        sini - sini aku <span style={{ position: 'relative', display: 'inline-block' }}>peluk<RedCircle width={65} height={35} style={{ top: '-4px', left: '-5px' }} /></span> hihi<br />
                                        <div style={{ fontSize: '1.6rem', marginTop: '0.3rem', fontWeight: 'normal', letterSpacing: '1px' }}>(づ｡•‿‿•｡)づ</div>
                                    </div>
                                </div>
                                
                                {/* Right side: stick figures */}
                                <div ref={sceneRef} style={{ position: 'relative', width: '200px' }}>
                                    {/* Villain */}
                                    <div style={{ position: 'absolute', bottom: '20px', left: '0' }}>
                                        <StickFigure variant="villain" size={45} />
                                        {/* arrow & label */}
                                        <svg width="40" height="40" style={{ position: 'absolute', top: '-15px', left: '-30px', overflow: 'visible' }}>
                                            <path d="M30 15 Q20 5 10 15 Q0 25 15 30" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
                                            <polygon points="12,27 18,31 12,33" fill="#1a1a1a" />
                                        </svg>
                                        <div style={{ position: 'absolute', top: '-5px', left: '-45px', fontFamily: 'var(--font-handwriting)', fontSize: '0.75rem', lineHeight: 1, textAlign: 'center', fontWeight: 'bold' }}>orang<br/>jahat</div>
                                    </div>

                                    {/* Heroes */}
                                    <div style={{ position: 'absolute', bottom: '60px', right: '0', display: 'flex', alignItems: 'flex-end', gap: '5px' }}>
                                        <div style={{ position: 'relative' }}>
                                            <StickFigure variant="bunnyGirl" size={45} />
                                            <div style={{ position: 'absolute', bottom: '-25px', left: '15px', fontFamily: 'var(--font-handwriting)', fontSize: '1rem', fontWeight: 'bold' }}>Aku</div>
                                            <svg width="20" height="30" style={{ position: 'absolute', bottom: '-15px', left: '15px', overflow: 'visible' }}>
                                                <path d="M10 0 L10 15" stroke="#1a1a1a" strokeWidth="1.5" />
                                                <polygon points="7,5 10,0 13,5" fill="#1a1a1a" />
                                            </svg>
                                        </div>
                                        <div style={{ position: 'relative', left: '-5px' }}>
                                            <StickFigure variant="normal" size={50} />
                                            <div style={{ position: 'absolute', top: '-10px', right: '-45px', fontFamily: 'var(--font-handwriting)', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                                <svg width="30" height="20" style={{ overflow: 'visible', marginRight: '5px' }}>
                                                    <path d="M0 10 L25 10" stroke="#1a1a1a" strokeWidth="1.5" />
                                                    <polygon points="5,5 0,10 5,15" fill="#1a1a1a" />
                                                </svg>
                                                kaka<br/>(you)
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Pasangan kelinci you/me dan peluk ── */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingBottom: '0.5rem', paddingLeft: '0.5rem' }}>
                                
                                {/* Pasangan berpelukan, pojok bawah */}
                                <div ref={coupleRef}>
                                    <svg width="90" height="90" viewBox="0 0 90 90">
                                        {/* rambut pacar */}
                                        <path d="M18 28 C16 14, 30 6, 42 12 C50 16, 50 26, 46 30 L44 24 C40 20, 30 18, 26 24 L24 30 C20 28, 18 30, 18 28 Z" fill="#fff" stroke="#1a1a1a" strokeWidth="2" />
                                        {/* kepala pacar */}
                                        <circle cx="34" cy="34" r="15" fill="#fff" stroke="#1a1a1a" strokeWidth="2" />
                                        <circle cx="24" cy="38" r="2.2" fill="#f4a3c4" opacity="0.7" />
                                        <circle cx="41" cy="38" r="2.2" fill="#f4a3c4" opacity="0.7" />
                                        {/* badan pacar */}
                                        <path d="M20 48 C18 60, 20 80, 22 88 L46 88 C48 78, 47 58, 44 48 Z" fill="#fff" stroke="#1a1a1a" strokeWidth="2" />
                                        {/* kepala kaka (belakang, sedikit terlihat) */}
                                        <circle cx="60" cy="40" r="14" fill="#fff" stroke="#1a1a1a" strokeWidth="2" />
                                        <path d="M50 34 C48 22, 60 16, 68 22 C72 26, 70 32, 68 34" fill="#fff" stroke="#1a1a1a" strokeWidth="2" />
                                        {/* badan kaka */}
                                        <path d="M46 52 C44 64, 46 80, 48 88 L74 88 C76 76, 74 58, 70 52 Z" fill="#fff" stroke="#1a1a1a" strokeWidth="2" />
                                        {/* lengan berpelukan */}
                                        <path d="M46 52 C40 56, 38 64, 42 70" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M44 48 C50 44, 58 44, 62 48" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>

                                {/* bunnies */}
                                <div ref={bunniesRef} style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', paddingRight: '1rem' }}>
                                    <div style={{ position: 'relative', textAlign: 'center' }}>
                                        <div style={{ position: 'absolute', top: '-15px', width: '100%', display: 'flex', justifyContent: 'center', gap: '15px', fontFamily: 'var(--font-handwriting)', color: '#d64545', fontWeight: 'bold', fontSize: '1rem' }}>
                                            <span>you</span>
                                            <span>me</span>
                                        </div>
                                        <div style={{ display: 'flex' }}>
                                            <BunnyDoodle size={45} tilt={-5} dressColor="#d0e3ff" />
                                            <BunnyDoodle size={45} tilt={5} dressColor="#f9b4c0" />
                                        </div>
                                        <span style={{ position: 'absolute', top: '10px', right: '-15px', fontSize: '1.2rem', color: '#ffb4cf' }}>♡</span>
                                    </div>

                                    <div style={{ position: 'relative', textAlign: 'center' }}>
                                        <span style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-handwriting)', color: '#d64545', fontWeight: 'bold', fontSize: '1rem' }}>me</span>
                                        <BunnyDoodle size={45} dressColor="#f9b4c0" />
                                        <span style={{ position: 'absolute', top: '5px', right: '-10px', fontSize: '1rem', color: '#ffb4cf' }}>♡</span>
                                        <span style={{ position: 'absolute', top: '-5px', left: '-10px', fontSize: '1rem', color: '#ffb4cf' }}>♡</span>
                                        <span style={{ position: 'absolute', bottom: '10px', right: '-15px', fontSize: '0.8rem', color: '#ffb4cf' }}>♡</span>
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