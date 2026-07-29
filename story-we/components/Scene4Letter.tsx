"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene4LetterProps {
    onNext?: () => void;
    onPrev?: () => void;
}

export default function Scene4Letter({ onNext, onPrev }: Scene4LetterProps) {
    const pageRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (textRef.current) {
            gsap.fromTo(textRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out', delay: 0.5 }
            );
        }

        // Jittery hand-drawn wiggle for circled words
        const circles = textRef.current?.querySelectorAll(`.${styles.circledWord}`);
        if (circles && circles.length > 0) {
            circles.forEach((circle, i) => {
                gsap.to(circle, {
                    rotation: () => gsap.utils.random(-3, 3),
                    x: () => gsap.utils.random(-1.5, 1.5),
                    y: () => gsap.utils.random(-1, 1),
                    duration: 0.15,
                    ease: 'steps(1)',
                    repeat: -1,
                    repeatRefresh: true,
                    delay: 1.7 + i * 0.1, // start after text fade-in settles
                });
            });
        }
    }, []);

    return (
        <>
            {/* ── Back button ── */}
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

            {/* ── Next button ── */}
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

            {/* ── Book wrapper ── */}
            <div className={styles.bookWrapper} ref={pageRef}>
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
        </>
    );
}