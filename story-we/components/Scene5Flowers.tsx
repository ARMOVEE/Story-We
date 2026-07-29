"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';
import FlowerButton from './FlowerButton';

interface Scene5FlowersProps {
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

// Organic hand-drawn wobbly outline that follows per-line text widths
function HandDrawnParagraphCircle() {
    return (
        <svg
            viewBox="0 0 280 195"
            style={{
                position: 'absolute',
                top: '-18px',
                left: '-22px',
                width: 'calc(100% + 44px)',
                height: 'calc(100% + 36px)',
                pointerEvents: 'none',
                zIndex: -1,
            }}
            preserveAspectRatio="none"
        >
            {/* Organic blob — each side follows the text width per line */}
            <path
                d="
                    M 42 12
                    C 80 5, 170 3, 225 10
                    Q 252 14, 258 28
                    C 263 38, 260 48, 255 55
                    Q 248 62, 235 68
                    C 240 74, 248 80, 250 90
                    Q 252 100, 248 108
                    C 244 116, 238 120, 260 126
                    Q 272 132, 268 142
                    C 264 152, 250 156, 240 160
                    Q 228 165, 200 170
                    C 165 178, 100 180, 60 175
                    Q 30 172, 18 162
                    C 8 152, 6 140, 10 130
                    Q 14 120, 20 115
                    C 12 108, 6 100, 5 90
                    Q 3 78, 8 68
                    C 12 58, 18 52, 14 44
                    Q 10 36, 14 26
                    C 18 16, 28 14, 42 12
                    Z
                "
                fill="none"
                stroke="#e74c3c"
                strokeWidth="1.8"
                strokeDasharray="6 5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.7"
            />
        </svg>
    );
}

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

export default function Scene5Flowers({ onNext, onPrev }: Scene5FlowersProps) {
    const pageRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const rightFlowersRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
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
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        padding: '2.5rem 2rem 1.5rem 3rem',
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
                            marginTop: '5rem',
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
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <HandDrawnParagraphCircle />
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