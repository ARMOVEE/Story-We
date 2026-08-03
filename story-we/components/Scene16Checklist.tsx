"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';
import cx from '../styles/checklist.module.css';

interface Scene16ChecklistProps {
    isActive?: boolean;
    onNext?: () => void;
    onPrev?: () => void;
}

/* ─── Heart Checkbox Component ─── */
function HeartCheckbox({ id, label }: { id: string; label: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className={cx.heartContainer} title="Like">
                <input type="checkbox" className={cx.heartCheckbox} id={id} />
                <div className={cx.svgContainer}>
                    <svg viewBox="0 0 24 24" className={cx.svgOutline} xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z" />
                    </svg>
                    <svg viewBox="0 0 24 24" className={cx.svgFilled} xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
                    </svg>
                    <svg className={cx.svgCelebrate} width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="10,10 20,20" />
                        <polygon points="10,50 20,50" />
                        <polygon points="20,80 30,70" />
                        <polygon points="90,10 80,20" />
                        <polygon points="90,50 80,50" />
                        <polygon points="80,80 70,70" />
                    </svg>
                </div>
            </div>
            <span style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.35rem', color: '#333' }}>{label}</span>
        </div>
    );
}

/* ─── Notebook Strikethrough Checkbox Component ─── */
function NotebookCheckbox({ id, label }: { id: string; label: string }) {
    return (
        <label className={cx.notebookCheckbox} htmlFor={id}>
            <input type="checkbox" id={id} />
            <span className={cx.checkmark}></span>
            <span className={cx.text}>
                <span className={cx.textContent}>{label}</span>
                <svg preserveAspectRatio="none" viewBox="0 0 400 20" className={cx.cutLine}>
                    <path d="M0,10 H400" />
                </svg>
            </span>
        </label>
    );
}

export default function Scene16Checklist({ onNext, onPrev, isActive = true }: Scene16ChecklistProps) {
    const titleRef = useRef<HTMLDivElement>(null);
    const subtitleRef = useRef<HTMLDivElement>(null);
    const checklistRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);
    const ghostRef = useRef<HTMLDivElement>(null);
    const smudgeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isActive) return;
        const tl = gsap.timeline();

        // Left page ghost text
        if (ghostRef.current) {
            tl.fromTo(ghostRef.current,
                { opacity: 0 },
                { opacity: 0.1, duration: 1.2 },
                0.3
            );
        }

        if (smudgeRef.current) {
            tl.fromTo(smudgeRef.current,
                { opacity: 0, scale: 0 },
                { opacity: 0.4, scale: 1, duration: 0.4 },
                1.0
            );
        }

        // Title
        if (titleRef.current) {
            tl.fromTo(titleRef.current,
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.6 },
                1.0
            );
        }

        // Subtitle
        if (subtitleRef.current) {
            tl.fromTo(subtitleRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.5 },
                1.5
            );
        }

        // Checklist items stagger
        if (checklistRef.current) {
            tl.fromTo(checklistRef.current.children,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.5, stagger: 0.5 },
                2.0
            );
        }

        // Footer
        if (footerRef.current) {
            tl.fromTo(footerRef.current.children,
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.3 },
                4.5
            );
        }

        return () => { tl.kill(); };
    }, []);

    return (
        <>
            {/* SVG filter for hand-drawn noise effect (used by notebook checkbox) */}
            <svg height="0" width="0" style={{ position: 'absolute' }}>
                <filter id="handDrawnNoise">
                    <feTurbulence
                        result="noise"
                        numOctaves={8}
                        baseFrequency={0.1}
                        type="fractalNoise"
                    />
                    <feDisplacementMap
                        yChannelSelector="G"
                        xChannelSelector="R"
                        scale={3}
                        in2="noise"
                        in="SourceGraphic"
                    />
                </filter>
            </svg>

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

                        {/* Ghost bleed-through text (mirrored) */}
                        <div ref={ghostRef} style={{
                            position: 'absolute', top: '5rem', left: '1.5rem', right: '1.5rem',
                            fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#777',
                            transform: 'scaleX(-1)', opacity: 0, lineHeight: '2.3rem',
                        }}>
                            <div>Kalo lagi berantem</div>
                            <div style={{ marginLeft: '3rem' }}>Indonesia</div>
                            <div>Kalian Kembali</div>
                            <div>Jadi cari me babe ❤️</div>
                            <div style={{ marginTop: '4rem' }}>CARI ME SAYANG</div>
                        </div>

                        {/* Purple smudge */}
                        <div ref={smudgeRef} style={{
                            position: 'absolute', bottom: '5rem', left: '3rem',
                            width: '30px', height: '35px',
                            backgroundColor: '#9B59B6', borderRadius: '50%',
                            filter: 'blur(4px)', opacity: 0,
                        }} />

                        {/* Faded number "3" */}
                        <div style={{
                            position: 'absolute', bottom: '4rem', left: '50%',
                            transform: 'translateX(-50%)',
                            fontFamily: 'var(--font-handwriting)', fontSize: '5rem',
                            color: '#ddd', opacity: 0.15,
                        }}>
                            3
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PAGE ── */}
                <div className={`${styles.dummyPage} ${styles.linedPage}`} style={{ zIndex: 10 }}>
                    <div className={styles.pageContent} style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999' }}>
                            Date:
                        </div>

                        <div style={{ padding: '5rem 2rem 2rem 2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>

                            {/* Title */}
                            <div ref={titleRef} style={{
                                fontFamily: 'var(--font-handwriting)', fontSize: '2rem', color: '#333',
                                textAlign: 'center', marginBottom: '0.3rem',
                                textDecoration: 'underline', textUnderlineOffset: '5px',
                                fontWeight: 'bold',
                            }}>
                                List Perasaan Kamu
                            </div>

                            {/* Subtitle */}
                            <div ref={subtitleRef} style={{
                                fontFamily: 'var(--font-handwriting)', fontSize: '1.15rem', color: '#555',
                                textAlign: 'center', marginBottom: '1.5rem',
                            }}>
                                Ceklis (✓) kalo masih sesuai
                            </div>

                            {/* Checklist items */}
                            <div ref={checklistRef} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                {/* Heart checkboxes for love items */}
                                <HeartCheckbox id="heart-cinta" label="Masih cinta aku ?" />
                                <HeartCheckbox id="heart-sayang" label="Masih sayang aku ga?" />

                                {/* Notebook strikethrough for negative items */}
                                <NotebookCheckbox id="nb-bosen" label="Bosen gak sama aku?" />
                                <NotebookCheckbox id="nb-cape" label="Cape gak sama sikap aku?" />
                            </div>

                            {/* Footer text */}
                            <div ref={footerRef} style={{
                                fontFamily: 'var(--font-handwriting)', fontSize: '1.2rem', color: '#333',
                                display: 'flex', flexDirection: 'column', gap: '0.8rem',
                                marginTop: 'auto', marginBottom: '1.5rem', lineHeight: '1.8',
                            }}>
                                <div>Jawab jujur sebelum insak</div>
                                <div>harus se jujur-jujurnya.</div>
                                <div>nanti ceklis sama kamu ya</div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
