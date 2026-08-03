"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';
import FlowerButton from './FlowerButton';

interface Scene5FlowersProps {
    isActive?: boolean;
    onNext?: () => void;
    onPrev?: () => void;
}

const FLOWER_COLORS = [
    '#e74c3c', '#3498db', '#2ecc71', '#f1c40f',
    '#e67e22', '#9b59b6', '#1abc9c', '#ff6b9d',
    '#ff4757', '#70a1ff', '#ffa502', '#7bed9f',
    '#ff6348', '#a29bfe', '#fd79a8', '#00cec9',
];

function HandDrawnFlower({ color, size = 20 }: { color: string; size?: number }) {
    return (
        <svg viewBox="0 0 30 30" width={size} height={size} style={{ overflow: 'visible' }}>
            {[0, 72, 144, 216, 288].map((angle, i) => (
                <ellipse
                    key={i}
                    cx="15" cy="7"
                    rx="4.5" ry="7"
                    fill="none"
                    stroke={color}
                    strokeWidth="1.8"
                    transform={`rotate(${angle} 15 15)`}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            ))}
            <circle cx="15" cy="15" r="3" fill={color} opacity="0.6" />
        </svg>
    );
}

// (HandDrawnParagraphCircle dihapus — diganti gambar kertasLove.webp sebagai latar teks)

function generateBorderFlowerPositions(count: number, yMin: number, yMax: number) {
    const flowers: { x: number; y: number; color: string; size: number; delay: number; rotation: number }[] = [];
    for (let i = 0; i < count; i++) {
        flowers.push({
            x: Math.random() * 90 + 3,
            y: yMin + Math.random() * (yMax - yMin),
            color: FLOWER_COLORS[i % FLOWER_COLORS.length],
            size: 14 + Math.random() * 12,
            delay: 0.3 + Math.random() * 3,
            rotation: Math.random() * 360,
        });
    }
    return flowers;
}

const RIGHT_FLOWERS_TOP = generateBorderFlowerPositions(16, 2, 17);
const RIGHT_FLOWERS_BOTTOM = generateBorderFlowerPositions(22, 75, 97);
const RIGHT_FLOWERS = [...RIGHT_FLOWERS_TOP, ...RIGHT_FLOWERS_BOTTOM];

export default function Scene5Flowers({ onNext, onPrev, isActive = true }: Scene5FlowersProps) {
    const pageRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const rightFlowersRef = useRef<(HTMLDivElement | null)[]>([]);
    const hangingRef = useRef<HTMLImageElement>(null);
    const bingkaiRef = useRef<HTMLImageElement>(null);
    const kiriRef = useRef<HTMLImageElement>(null);
    const kananRef = useRef<HTMLImageElement>(null);

    // Animasi khusus dekorasi halaman kiri — TIDAK digantungkan pada isActive,
    // supaya gambar tidak pernah nyangkut di opacity:0 kalau scene ini sempat
    // ter-render sebelum isActive jadi true.
    useEffect(() => {
        // Fallback pengaman: pastikan selalu terlihat walau animasi gagal jalan
        gsap.set([hangingRef.current, bingkaiRef.current, kiriRef.current, kananRef.current], { opacity: 1 });

        const tl = gsap.timeline();

        // Gantungan love jatuh dari atas seperti digantung
        if (hangingRef.current) {
            tl.fromTo(hangingRef.current,
                { opacity: 0, y: -40, rotation: -8 },
                { opacity: 1, y: 0, rotation: 0, duration: 0.9, ease: 'bounce.out' }, 0.2
            );
            // ayunan pelan terus menerus setelah jatuh
            tl.to(hangingRef.current, {
                rotation: 6,
                duration: 1.6,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                transformOrigin: 'top center',
            }, 1.1);
        }

        // Bingkai foto muncul di tengah halaman
        if (bingkaiRef.current) {
            tl.fromTo(bingkaiRef.current,
                { opacity: 0, scale: 0.85 },
                { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.6)' }, 0.9
            );
        }

        // Dua bunga bawah muncul saling berhadapan
        if (kiriRef.current) {
            tl.fromTo(kiriRef.current,
                { opacity: 0, x: -30, scale: 0.7 },
                { opacity: 1, x: 0, scale: 1, duration: 0.7, ease: 'back.out(1.7)' }, 0.6
            );
        }
        if (kananRef.current) {
            tl.fromTo(kananRef.current,
                { opacity: 0, x: 30, scale: 0.7 },
                { opacity: 1, x: 0, scale: 1, duration: 0.7, ease: 'back.out(1.7)' }, 0.6
            );
        }

        return () => { tl.kill(); };
    }, []);

    useEffect(() => {
        if (!isActive) return;
        const tl = gsap.timeline();

        if (textRef.current) {
            tl.fromTo(textRef.current,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' }, 0.3
            );
        }

        rightFlowersRef.current.forEach((el, i) => {
            if (el) {
                tl.fromTo(el,
                    { scale: 0, opacity: 0, rotation: 30 },
                    { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)' },
                    RIGHT_FLOWERS[i].delay
                );

                const spinDuration = 12 + Math.random() * 10;
                const direction = Math.random() > 0.5 ? 360 : -360;
                tl.to(el, {
                    rotation: `+=${direction}`,
                    duration: spinDuration,
                    ease: 'none',
                    repeat: -1,
                }, RIGHT_FLOWERS[i].delay + 0.5);
            }
        });

        return () => { tl.kill(); };
    }, []);

    return (
        <>
            {onPrev && (
                <div className={styles.navBtnWrapperLeft} style={{ zIndex: 100 }}>
                    <FlowerButton onClick={onPrev} text="Go Back" />
                </div>
            )}

            <div className={styles.navBtnWrapperRight} style={{ zIndex: 100 }}>
                <FlowerButton onClick={onNext} text="Lanjutkan" />
            </div>

            <div className={styles.bookWrapper} ref={pageRef}>
                <div
                    className={styles.pageLeft}
                    style={{
                        background: '#faf9f6',
                        backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 31px, #d4e3f5 31px, #d4e3f5 32px)',
                        backgroundPosition: '0 40px',
                        overflow: 'hidden',
                    }}
                >
                    <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999' }}>
                        Date:
                    </div>

                    {/* Overlay khusus dekorasi — tidak mengubah style pageLeft asli sama sekali */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            zIndex: 6,
                            pointerEvents: 'none',
                        }}
                    >
                        {/* Gantungan love di posisi atas tengah, seolah tergantung */}
                        <img
                            ref={hangingRef}
                            src="/animations/gantung%20love.webp"
                            alt="gantungan love"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                transformOrigin: 'top center',
                                width: '100%',
                                maxWidth: '380px',
                            }}
                        />

                        {/* Bingkai foto di tengah halaman, mengisi area kosong */}
                        <img
                            ref={bingkaiRef}
                            src="/animations/bingkai.webp"
                            alt="bingkai foto"
                            style={{
                                position: 'absolute',
                                top: '30%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '200%',
                                maxWidth: '500px',
                            }}
                        />

                        {/* Dua bunga saling berhadapan di posisi bawah */}
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '1.5rem',
                                left: 0,
                                right: 0,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end',
                                padding: '0 1.5rem',
                            }}
                        >
                            <img
                                ref={kiriRef}
                                src="/animations/kiri.gif"
                                alt="bunga kiri"
                                style={{ width: '100px' }}
                            />
                            <img
                                ref={kananRef}
                                src="/animations/kanan.gif"
                                alt="bunga kanan"
                                style={{ width: '100px' }}
                            />
                        </div>
                    </div>
                </div>

                <div
                    className={styles.dummyPage}
                    style={{
                        zIndex: 20,
                        background: '#faf9f6',
                        backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 31px, #d4e3f5 31px, #d4e3f5 32px)',
                        backgroundPosition: '0 40px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2.5rem 2rem 1.5rem 2rem',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999' }}>
                        Date:
                    </div>

                    <div
                        ref={textRef}
                        style={{
                            marginTop: 0,
                            width: '100%',
                            fontFamily: 'var(--font-handwriting)',
                            color: '#333',
                            lineHeight: '32px',
                            fontSize: '1.15rem',
                            paddingLeft: '0.5rem',
                            position: 'relative',
                            zIndex: 10,
                        }}
                    >
                        <div
                            style={{
                                position: 'relative',
                                display: 'inline-block',
                                width: '380px',
                                marginLeft: '2rem',
                                padding: '2.6rem 3.6rem 4rem',
                                boxSizing: 'border-box',
                                textAlign: 'center',
                            }}
                        >
                            <img
                                src="/animations/kertasLove.webp"
                                alt=""
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'fill',
                                    zIndex: -1,
                                    pointerEvents: 'none',
                                }}
                            />
                            <p style={{ margin: 0 }}>Ini ulang tahun pertama</p>
                            <p style={{ margin: 0 }}>kita yang sama-sama</p>
                            <p style={{ margin: 0 }}>Aku dan kamu rayakan.</p>
                            <p style={{ margin: 0 }}>Dan akan seterusnya sama</p>
                            <p style={{ margin: 0 }}>kamu sayangggg</p>
                        </div>
                    </div>

                    {RIGHT_FLOWERS.map((f, i) => (
                        <div
                            key={`rf-${i}`}
                            ref={el => { rightFlowersRef.current[i] = el; }}
                            style={{
                                position: 'absolute',
                                left: `${f.x}%`,
                                top: `${f.y}%`,
                                transform: `rotate(${f.rotation}deg)`,
                                opacity: 0,
                                zIndex: 5,
                            }}
                        >
                            <HandDrawnFlower color={f.color} size={f.size} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}