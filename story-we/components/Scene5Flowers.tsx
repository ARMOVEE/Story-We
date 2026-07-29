"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene5FlowersProps {
    onNext?: () => void;
}

// ── Flower colors matching the image ──────────────────────────────────────────
const FLOWER_COLORS = [
    '#e74c3c', '#3498db', '#2ecc71', '#f1c40f',
    '#e67e22', '#9b59b6', '#1abc9c', '#ff6b9d',
    '#ff4757', '#70a1ff', '#ffa502', '#7bed9f',
    '#ff6348', '#a29bfe', '#fd79a8', '#00cec9',
];

// ── SVG flower shapes ─────────────────────────────────────────────────────────
function HandDrawnFlower({ color, size = 20 }: { color: string; size?: number }) {
    return (
        <svg viewBox="0 0 30 30" width={size} height={size} style={{ overflow: 'visible' }}>
            {/* 5 petals */}
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
            {/* Center */}
            <circle cx="15" cy="15" r="3" fill={color} opacity="0.6" />
        </svg>
    );
}

// ── Generate random flower positions ──────────────────────────────────────────
function generateFlowerPositions(count: number) {
    const flowers: { x: number; y: number; color: string; size: number; delay: number; rotation: number }[] = [];
    for (let i = 0; i < count; i++) {
        flowers.push({
            x: Math.random() * 90 + 5,   // 5% - 95%
            y: Math.random() * 85 + 5,   // 5% - 90%
            color: FLOWER_COLORS[i % FLOWER_COLORS.length],
            size: 14 + Math.random() * 12,
            delay: 0.3 + Math.random() * 2.5,
            rotation: Math.random() * 360,
        });
    }
    return flowers;
}

const LEFT_FLOWERS = generateFlowerPositions(18);
const RIGHT_FLOWERS = generateFlowerPositions(22);

export default function Scene5Flowers({ onNext }: Scene5FlowersProps) {
    const pageRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const leftFlowersRef = useRef<(HTMLDivElement | null)[]>([]);
    const rightFlowersRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const tl = gsap.timeline();

        // Animate text in
        if (textRef.current) {
            tl.fromTo(textRef.current,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' }, 0.3
            );
        }

        // Animate flowers blooming on left page
        leftFlowersRef.current.forEach((el, i) => {
            if (el) {
                tl.fromTo(el,
                    { scale: 0, opacity: 0, rotation: -30 },
                    { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)' },
                    LEFT_FLOWERS[i].delay
                );
            }
        });

        // Animate flowers blooming on right page
        rightFlowersRef.current.forEach((el, i) => {
            if (el) {
                tl.fromTo(el,
                    { scale: 0, opacity: 0, rotation: 30 },
                    { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)' },
                    RIGHT_FLOWERS[i].delay
                );
            }
        });

        return () => { tl.kill(); };
    }, []);

    return (
        <>
            {/* ── Next button ── */}
            <div className={styles.navBtnWrapperRight} style={{ zIndex: 100 }}>
                <FlowerButton onClick={onNext} text="Lanjutkan" />
            </div>

            {/* ── Book wrapper ── */}
            <div className={styles.bookWrapper} ref={pageRef}>
                {/* Left page — flowers only */}
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
                    {/* Scattered flowers on left page */}
                    {LEFT_FLOWERS.map((f, i) => (
                        <div
                            key={`lf-${i}`}
                            ref={el => { leftFlowersRef.current[i] = el; }}
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

                {/* Right page — text + flowers */}
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

                    {/* ── Main text with dashed red circle ── */}
                    <div
                        ref={textRef}
                        style={{
                            marginTop: '3rem',
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
                        {/* Dashed red circle around text block */}
                        <div className={styles.dashedCircleWrap}>
                            <p style={{ margin: 0 }}>Ini hari jadian pertama</p>
                            <p style={{ margin: 0 }}>kita yang sama-sama</p>
                            <p style={{ margin: 0 }}>Aku dan kamu rayakan.</p>
                            <p style={{ margin: 0 }}>Dan akan seterusnya sama</p>
                            <p style={{ margin: 0 }}>kamu sayangggg 💕</p>
                        </div>
                    </div>

                    {/* Scattered flowers on right page */}
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
