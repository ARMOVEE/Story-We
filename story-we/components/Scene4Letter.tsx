"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene4LetterProps {
    onNext?: () => void;
}

export default function Scene4Letter({ onNext }: Scene4LetterProps) {
    const pageRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (textRef.current) {
            gsap.fromTo(textRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out', delay: 0.5 }
            );
        }
    }, []);

    return (
        <>
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
                        padding: '2.5rem 2rem 1.5rem 3rem', // added left padding to match notebook margin
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
                        <p style={{ margin: 0 }}>Selamat Hari Jadian Sayangku</p>
                        <p style={{ margin: 0 }}>Semoga di waktu kita yang</p>
                        <p style={{ margin: 0 }}>sekarang ini, hubungan kita bisa</p>
                        <p style={{ margin: 0 }}><span className={styles.circledWord} style={{ '--circle-color': '#e74c3c' } as any}>lebih dewasa</span> lagi dan jadi pasangan</p>
                        <p style={{ margin: 0 }}>yang <span className={styles.circledWord} style={{ '--circle-color': '#3498db' } as any}>lebih baik lagi</span>. terus <span className={styles.circledWord} style={{ '--circle-color': '#f1c40f' } as any}>dilancarkan rezekinya</span>,</p>
                        <p style={{ margin: 0 }}><span className={styles.circledWord} style={{ '--circle-color': '#2ecc71' } as any}>sehat selalu</span>, <span className={styles.circledWord} style={{ '--circle-color': '#9b59b6' } as any}>setia terus</span>,</p>
                        <p style={{ margin: 0 }}><span className={styles.circledWord} style={{ '--circle-color': '#e67e22' } as any}>cinta aku terus</span>, <span className={styles.circledWord} style={{ '--circle-color': '#1abc9c' } as any}>sayang aku terus</span></p>
                        <p style={{ margin: 0 }}><span className={styles.circledWord} style={{ '--circle-color': '#ff4757' } as any}>YAA!!</span> awas aja kalo selingkuh</p>
                        <p style={{ margin: 0, textAlign: 'right', marginTop: '1rem', marginRight: '2rem' }}>Rizal liatin weh</p>
                        
                        <p style={{ margin: 0, textAlign: 'center', marginTop: '1.5rem', fontWeight: 'bold' }}>mmuahh</p>
                    </div>
                </div>
            </div>
        </>
    );
}
