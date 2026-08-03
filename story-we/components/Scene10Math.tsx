"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene10MathProps {
    isActive?: boolean;
    onNext?: () => void;
    onPrev?: () => void;
}

export default function Scene10Math({ onNext, onPrev, isActive = true }: Scene10MathProps) {
    const textLeftRef = useRef<HTMLDivElement>(null);
    const heartRef = useRef<SVGSVGElement>(null);
    const mathRef = useRef<HTMLDivElement>(null);
    const simpleTextRef = useRef<HTMLDivElement>(null);
    const underlineRef = useRef<SVGSVGElement>(null);
    const penRef = useRef<HTMLDivElement>(null);
    const mathContentRef = useRef<HTMLDivElement>(null);
    const simpleTextInnerRef = useRef<HTMLDivElement>(null);
    const answerTextRef = useRef<HTMLSpanElement>(null);

    // Lebar garis biru dihitung dari lebar teks "Simple", biar selalu pas.
    const [underlineWidth, setUnderlineWidth] = useState(120);
    // Ukuran hati dihitung dari kotak pembungkus seluruh rumus matematika
    const [heartSize, setHeartSize] = useState(280);

    useLayoutEffect(() => {
        const measure = () => {
            if (mathContentRef.current) {
                const { width, height } = mathContentRef.current.getBoundingClientRect();
                // diagonal blok teks + padding aman, dibulatkan biar hati selalu melingkupi semua teks
                const diagonal = Math.sqrt(width * width + height * height);
                const padding = 90; // ruang aman ekstra di semua sisi
                setHeartSize(Math.max(280, Math.ceil(diagonal + padding)));
            }
            if (simpleTextInnerRef.current) {
                const { width } = simpleTextInnerRef.current.getBoundingClientRect();
                setUnderlineWidth(Math.max(90, Math.ceil(width + 24)));
            }
        };

        measure();

        const ro = new ResizeObserver(measure);
        if (mathContentRef.current) ro.observe(mathContentRef.current);
        if (simpleTextInnerRef.current) ro.observe(simpleTextInnerRef.current);
        if (answerTextRef.current) ro.observe(answerTextRef.current);

        window.addEventListener('resize', measure);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', measure);
        };
    }, []);

    useEffect(() => {
        if (!isActive) return;
        const tl = gsap.timeline();

        // 1. Fade in left page text
        if (textLeftRef.current) {
            tl.fromTo(textLeftRef.current.children,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.3, ease: 'power2.out' },
                0.5
            );
        }

        // (Heart outline moved to after the math writing animation)

        // 3. Math equations "ditulis" pakai pen — clip-path reveal + pen ikut jalan
        if (mathRef.current && penRef.current) {
            const lines = Array.from(mathRef.current.children) as HTMLElement[];
            const pen = penRef.current;

            gsap.set(pen, { opacity: 0 });

            tl.to(pen, { opacity: 1, duration: 0.2 }, "-=0.3");

            lines.forEach((line, i) => {
                // siapkan clip-path awal: teks tersembunyi dari kanan
                gsap.set(line, { clipPath: 'inset(0 100% 0 0)', opacity: 1 });

                const width = line.getBoundingClientRect().width || 200;
                const height = line.getBoundingClientRect().height || 30;
                const top = line.offsetTop;
                const left = line.offsetLeft;

                // posisikan pena di awal baris
                tl.set(pen, { x: left - 10, y: top + height / 2 - 10 }, i === 0 ? "+=0.1" : undefined);

                // tulis baris ini: clip-path membuka dari kiri ke kanan,
                // pena "berjalan" mengikuti ujung tulisan (sedikit goyang biar terasa organik)
                tl.to(line, {
                    clipPath: 'inset(0 0% 0 0)',
                    duration: 0.9,
                    ease: 'power1.inOut',
                }, ">");

                tl.to(pen, {
                    x: left + width - 6,
                    duration: 0.9,
                    ease: 'power1.inOut',
                    onUpdate: function () {
                        // sedikit jitter vertikal biar kesan tulisan tangan
                        const jitter = Math.sin(this.progress() * Math.PI * 8) * 2;
                        gsap.set(pen, { y: top + height / 2 - 10 + jitter });
                    }
                }, "<");

                tl.to({}, { duration: 0.25 }); // jeda kecil antar baris, kayak orang mikir
            });

            tl.to(pen, { opacity: 0, duration: 0.3 });
        }

        // 3b. Coretan hati nge-highlight jawaban akhir "i < 3u"
        if (heartRef.current) {
            const heartPath = heartRef.current.querySelector('path');
            tl.fromTo(heartPath,
                { strokeDasharray: 1000, strokeDashoffset: 1000, opacity: 1 },
                { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' },
                "+=0.15"
            );
            // sedikit "getar" pas garis selesai, lalu detak jantung
            tl.fromTo(heartRef.current,
                { scale: 1 },
                { scale: 1.08, duration: 0.15, yoyo: true, repeat: 1, ease: 'power1.inOut', transformOrigin: '50% 50%' },
                "-=0.1"
            );
            gsap.to(heartRef.current, {
                scale: 1.05,
                repeat: -1,
                yoyo: true,
                duration: 0.8,
                ease: 'sine.inOut',
                delay: 1.5,
                transformOrigin: '50% 50%'
            });
        }

        // 4. "that Simple" text pops in
        if (simpleTextRef.current) {
            tl.fromTo(simpleTextRef.current.children,
                { opacity: 0, scale: 0.8, rotation: -5 },
                { opacity: 1, scale: 1, rotation: 0, duration: 0.5, stagger: 0.4, ease: 'back.out(2)' },
                "+=0.3"
            );
        }

        // 5. Draw double underline
        if (underlineRef.current) {
            const lines = underlineRef.current.querySelectorAll('path');
            tl.fromTo(lines,
                { strokeDasharray: 100, strokeDashoffset: 100 },
                { strokeDashoffset: 0, duration: 0.4, stagger: 0.2, ease: 'power1.out' },
                "-=0.2"
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
                    <div className={styles.pageContent}>
                        <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999' }}>
                            Date:
                        </div>

                        <div ref={textLeftRef} style={{ marginTop: '4rem', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'var(--font-handwriting-draft)', fontSize: '1.6rem', color: '#333', lineHeight: '1.6' }}>
                            <div>Hai sayang, aku punya</div>
                            <div>rumus matematika nih,</div>
                            <div>mau tau ga?</div>
                            <div>jangan mikir lagi cukup</div>
                            <div>liat saja ya manis ^~^</div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PAGE ── */}
                <div className={`${styles.dummyPage} ${styles.linedPage}`} style={{ zIndex: 10 }}>
                    <div className={styles.pageContent} style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999' }}>
                            Date:
                        </div>

                        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '1rem' }}>

                            {/* Math Equations di tengah-tengah — "ditulis" pakai pen */}
                            <div
                                ref={mathContentRef}
                                style={{
                                    position: 'relative',
                                    zIndex: 10,
                                    marginTop: '-3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {/* Giant Heart Outline — ukurannya ngikutin isi seluruh rumus teks, diletakkan tepat di tengah blok teks */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: `${heartSize}px`,
                                        height: `${heartSize}px`,
                                        zIndex: 0,
                                        pointerEvents: 'none',
                                        transition: 'width 0.2s ease, height 0.2s ease',
                                    }}
                                >
                                    <svg ref={heartRef} viewBox="0 0 300 300" width="100%" height="100%" style={{ overflow: 'visible' }}>
                                        <path
                                            d="M 150 260 C 150 260, 20 160, 20 80 C 20 30, 100 20, 150 70 C 200 20, 280 30, 280 80 C 280 160, 150 260, 150 260 Z"
                                            fill="none"
                                            stroke="#ff6b6b"
                                            strokeWidth="3.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            vectorEffect="non-scaling-stroke"
                                        />
                                    </svg>
                                </div>
                                <div ref={mathRef} style={{ position: 'relative', zIndex: 10, fontFamily: 'var(--font-handwriting)', fontSize: '1.5rem', color: '#ff6b6b', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', letterSpacing: '2px' }}>
                                    <div>9x - 7i &gt; 3(3x - 7u)</div>
                                    <div>9x - 7i &gt; 9x - 21u</div>
                                    <div>-7i &gt; -21u</div>
                                    <div style={{ position: 'relative', fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
                                        <span ref={answerTextRef} style={{ position: 'relative', zIndex: 1, display: 'inline-block' }}>
                                            i &lt; 3 u
                                        </span>
                                    </div>
                                </div>

                                {/* Ikon pena yang berjalan mengikuti tulisan */}
                                <div
                                    ref={penRef}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '20px',
                                        height: '20px',
                                        zIndex: 20,
                                        pointerEvents: 'none',
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" width="20" height="20" style={{ transform: 'rotate(45deg)' }}>
                                        <path d="M3 21l3-1 11-11-2-2L4 18l-1 3z" fill="#333" />
                                        <path d="M17 7l-2-2 2.5-2.5a1.5 1.5 0 0 1 2 2L17 7z" fill="#555" />
                                    </svg>
                                </div>
                            </div>

                            {/* "that Simple" text below the heart */}
                            <div style={{ marginTop: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', zIndex: 10 }}>
                                <div ref={simpleTextRef} style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ color: '#e67e22', marginLeft: '-4rem', transform: 'rotate(-5deg)' }}>that</div>
                                    <div ref={simpleTextInnerRef} style={{ color: '#27ae60', letterSpacing: '2px', display: 'inline-block' }}>Simple</div>
                                </div>

                                {/* Blue double underline — lebarnya ngikutin lebar teks "Simple" */}
                                <svg
                                    ref={underlineRef}
                                    width={underlineWidth}
                                    height="15"
                                    viewBox="0 0 120 15"
                                    preserveAspectRatio="none"
                                    style={{ marginTop: '0.2rem', transition: 'width 0.2s ease' }}
                                >
                                    <path d="M 5 5 Q 60 2, 115 5" fill="none" stroke="#3498db" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                                    <path d="M 10 12 Q 50 15, 100 11" fill="none" stroke="#3498db" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                                </svg>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}