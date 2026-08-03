"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene4LetterProps {
    isActive?: boolean;
    onNext?: () => void;
    onPrev?: () => void;
}

export default function Scene4Letter({ onNext, onPrev, isActive = true }: Scene4LetterProps) {
    const pageRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isActive) return;

        if (textRef.current) {
            gsap.fromTo(textRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out', delay: 0.5 }
            );
        }

        // Pulse/heartbeat (lebih besar) + getaran/vibration kecil buat kata-kata
        // yang dilingkari — dua animasi jalan bareng di elemen yang sama.
        const circles = textRef.current?.querySelectorAll(`.${styles.circledWord}`);
        if (circles && circles.length > 0) {
            circles.forEach((circle, i) => {
                // Pulse — membesar-mengecil, agak besar sekarang
                gsap.to(circle, {
                    scale: 1.18,
                    duration: 0.8,
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                    transformOrigin: 'center center',
                    delay: 1.7 + i * 0.1,
                });
                // Getaran — jitter kecil & cepat, jalan bareng pulse-nya
                gsap.to(circle, {
                    x: () => gsap.utils.random(-2, 2),
                    y: () => gsap.utils.random(-2, 2),
                    duration: 0.06,
                    ease: 'steps(1)',
                    repeat: -1,
                    repeatRefresh: true,
                    delay: 1.7 + i * 0.1,
                });
            });
        }
    }, []);

    return (
        <>
            {/* ── speker.webp & awan.webp: ditampilkan langsung (statis, tanpa animasi) ── */}
            {isActive && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 500,
                        pointerEvents: 'none',
                    }}
                >
                    <img
                        src="/animations/speker.webp"
                        alt=""
                        style={{
                            position: 'absolute',
                            top: '58%',
                            left: '25%',
                            transform: 'translate(-50%, -50%) rotate(-25deg)',
                            transformOrigin: 'center center',
                            width: 'clamp(140px, 18vw, 230px)',
                            height: 'auto',
                            pointerEvents: 'none',
                            userSelect: 'none',
                        }}
                    />
                    <img
                        src="/animations/awan.webp"
                        alt=""
                        style={{
                            position: 'absolute',
                            top: '39%',
                            left: '35%',
                            transform: 'translate(-50%, -50%)',
                            width: 'clamp(200px, 25vw, 320px)',
                            height: 'auto',
                            pointerEvents: 'none',
                            userSelect: 'none',
                        }}
                    />
                </div>
            )}

            {/* ── Back button ── */}
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

            {/* ── Next button ── */}
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

            {/* ── Book wrapper ── */}
            <div className={styles.bookWrapper} ref={pageRef} style={{ position: 'relative' }}>

                {/* Dekorasi statis 4 pojok, pakai love.webp — pola sama kayak
                    arrow/star/mask/omg di Scene3 (position absolute, relatif
                    ke bookWrapper, bukan ke viewport). */}
                {isActive && (
                    <>
                        <img
                            src="/animations/love.webp"
                            alt=""
                            style={{
                                position: 'absolute',
                                top: '-20px',
                                left: '-20px',
                                width: 'clamp(60px, 7vw, 100px)',
                                height: 'auto',
                                pointerEvents: 'none',
                                userSelect: 'none',
                                zIndex: 60,
                                transformOrigin: 'center center',
                                animation: 'loveHeartbeat 1.6s ease-in-out infinite',
                            }}
                        />
                        <img
                            src="/animations/love.webp"
                            alt=""
                            style={{
                                position: 'absolute',
                                top: '-20px',
                                right: '-20px',
                                width: 'clamp(60px, 7vw, 100px)',
                                height: 'auto',
                                pointerEvents: 'none',
                                userSelect: 'none',
                                zIndex: 60,
                                transformOrigin: 'center center',
                                animation: 'loveHeartbeat 1.6s ease-in-out infinite',
                            }}
                        />
                        <img
                            src="/animations/love.webp"
                            alt=""
                            style={{
                                position: 'absolute',
                                bottom: '-20px',
                                left: '-20px',
                                width: 'clamp(60px, 7vw, 100px)',
                                height: 'auto',
                                pointerEvents: 'none',
                                userSelect: 'none',
                                zIndex: 60,
                                transformOrigin: 'center center',
                                animation: 'loveHeartbeat 1.6s ease-in-out infinite',
                            }}
                        />
                        <img
                            src="/animations/love.webp"
                            alt=""
                            style={{
                                position: 'absolute',
                                bottom: '-20px',
                                right: '-20px',
                                width: 'clamp(60px, 7vw, 100px)',
                                height: 'auto',
                                pointerEvents: 'none',
                                userSelect: 'none',
                                zIndex: 60,
                                transformOrigin: 'center center',
                                animation: 'loveHeartbeat 1.6s ease-in-out infinite',
                            }}
                        />
                    </>
                )}

                {/* Left lined page (blank) */}
                <div
                    className={styles.pageLeft}
                    style={{
                        background: '#faf9f6',
                        backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 31px, #d4e3f5 31px, #d4e3f5 32px)',
                        backgroundPosition: '0 40px',
                    }}
                >
                    <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999' }}>
                        Date:
                    </div>
                </div>

                {/* Right lined page (letter content) */}
                <div
                    className={styles.dummyPage}
                    style={{
                        zIndex: 20,
                        background: '#faf9f6',
                        backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 31px, #d4e3f5 31px, #d4e3f5 32px)',
                        backgroundPosition: '0 40px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        padding: '2.5rem 2rem 1.5rem 3rem',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                    }}
                >
                    {/* Date label */}
                    <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999' }}>
                        Date:
                    </div>

                    {/* ── Text block ── */}
                    <div ref={textRef} style={{ marginTop: '2.2rem', width: '100%', fontFamily: 'var(--font-handwriting)', color: '#333', lineHeight: '32px', fontSize: '1.2rem', paddingLeft: '0.5rem' }}>
                        <p style={{ margin: 0 }}>Selamat Ulang Tahun Sayangku</p>
                        <p style={{ margin: 0 }}>Semoga di umur kamu yang</p>
                        <p style={{ margin: 0 }}>sekarang ini, kamu bisa <span className={styles.circledWord} style={{ '--circle-color': '#e85d75' } as any}>lebih</span></p>
                        <p style={{ margin: 0 }}><span className={styles.circledWord} style={{ '--circle-color': '#e85d75' } as any}>dewasa</span> lagi dan jadi manusia</p>
                        <p style={{ margin: 0 }}>yang <span className={styles.circledWord} style={{ '--circle-color': '#e85d75' } as any}>lebih baik lagi</span>. terus <span className={styles.circledWord} style={{ '--circle-color': '#e85d75' } as any}>dilancarkan</span></p>
                        <p style={{ margin: 0 }}><span className={styles.circledWord} style={{ '--circle-color': '#e85d75' } as any}>rezekinya</span>, sehat selalu, setia terus,</p>
                        <p style={{ margin: 0 }}>cinta aku terus, sayang aku terus</p>
                        <p style={{ margin: 0 }}>YAA!! awas aja kalo selingkuh</p>
                        <p style={{ margin: 0, textAlign: 'right', marginTop: '1rem', marginRight: '2rem' }}>Rizal liatin weh</p>

                        <p style={{ margin: 0, textAlign: 'center', marginTop: '1.5rem', fontWeight: 'bold' }}>mmuahh</p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes loveHeartbeat {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.12); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </>
    );
}