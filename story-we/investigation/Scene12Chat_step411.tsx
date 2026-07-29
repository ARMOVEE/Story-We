"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene12ChatProps {
    onNext?: () => void;
}

const messages = [
    { id: 1, side: 'left', text: 'hi', delay: 3.5 },
    { id: 2, side: 'right', text: 'Okey SIPPP', delay: 6.5 },
    { id: 3, side: 'left', text: 'Punten paket', delay: 9.5 },
    { id: 4, side: 'right', text: 'AHAHAHA', delay: 12.5 },
];

export default function Scene12Chat({ onNext }: Scene12ChatProps) {
    const leftTextRef = useRef<HTMLDivElement>(null);
    const kissRef = useRef<HTMLDivElement>(null);
    const rightIntroRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Which messages are visible and which show typing indicator
    const [visibleMsgs, setVisibleMsgs] = useState<number[]>([]);
    const [typingId, setTypingId] = useState<number | null>(null);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

        // Left text fade in
        if (leftTextRef.current) {
            tl.fromTo(leftTextRef.current.children,
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.7, stagger: 0.35 }, 0.4);
        }

        // Kiss mark pop
        if (kissRef.current) {
            tl.fromTo(kissRef.current,
                { opacity: 0, scale: 0.5, rotation: -15 },
                { opacity: 1, scale: 1, rotation: -8, duration: 0.8, ease: 'back.out(2)' }, 1.2);
        }

        // Right intro text
        if (rightIntroRef.current) {
            tl.fromTo(rightIntroRef.current.children,
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.25 }, 0.6);
        }

        // Sequence of chat messages — each: show typing for ~1.5s, then reveal
        messages.forEach(msg => {
            // Show typing indicator
            tl.call(() => setTypingId(msg.id), [], msg.delay);
            // Reveal actual message
            tl.call(() => {
                setTypingId(null);
                setVisibleMsgs(prev => [...prev, msg.id]);
            }, [], msg.delay + 1.8);
        });

        return () => { tl.kill(); };
    }, []);

    // Scroll chat to bottom when new message appears
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [visibleMsgs, typingId]);

    return (
        <>
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

            <div className={styles.bookWrapper}>
                {/* ── LEFT PAGE ── */}
                <div className={`${styles.pageLeft} ${styles.linedPage}`}>
                    <div className={styles.pageContent} style={{ position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999' }}>
                            Date:
                        </div>

                        {/* Red squiggle doodle at top */}
                        <div style={{ marginTop: '3.8rem', paddingLeft: '1rem' }}>
                            <svg width="160" height="20" viewBox="0 0 160 20">
                                <path d="M 0 10 Q 20 2, 40 10 T 80 10 T 120 10 T 160 10" fill="none" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                            </svg>
                        </div>

                        {/* Main text */}
                        <div ref={leftTextRef} style={{ marginTop: '1.5rem', paddingLeft: '1.2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.5rem', color: '#333', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <div>Aku gak butuh update</div>
                            <div>Versi terbaru...</div>
                            <div>Soalnya versi terbaik aku</div>
                            <div>itu pas lagi sama kamu</div>
                        </div>

                        {/* ── Romantic Kiss Constellation ── */}
                        <div style={{ position: 'absolute', bottom: '1.5rem', left: 0, right: 0, height: '220px', pointerEvents: 'none' }}>

                            {/* Scattered kiss marks — staggered pop */}
                            {[
                                { x: 18,  y: 155, r: -15, s: 0.65, delay: 1.8 },
                                { x: 78,  y: 120, r:   8, s: 0.9,  delay: 2.3 },
                                { x: 10,  y: 80,  r: -28, s: 0.45, delay: 2.7 },
                                { x: 130, y: 140, r:  18, s: 0.55, delay: 3.0 },
                                { x: 55,  y: 60,  r:  -5, s: 0.75, delay: 3.4 },
                                { x: 150, y: 85,  r:  25, s: 0.4,  delay: 3.7 },
                            ].map((k, i) => (
                                <div
                                    key={i}
                                    style={{
                                        position: 'absolute',
                                        left: k.x,
                                        top: k.y,
                                        transform: `rotate(${k.r}deg) scale(${k.s})`,
                                        transformOrigin: 'center center',
                                        opacity: 0,
                                        animation: `kissPopIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${k.delay}s both`,
                                    }}
                                >
                                    <svg viewBox="0 0 110 80" width="110" height="80">
                                        {/* Upper lip */}
                                        <path d="M 10 45 C 25 18, 45 38, 55 43 C 65 38, 85 18, 100 45 C 85 56, 65 48, 55 48 C 45 48, 25 56, 10 45 Z"
                                            fill="#d42200" opacity="0.82" />
                                        {/* Cupid bow indent */}
                                        <path d="M 28 45 Q 42 32, 55 42 Q 68 32, 82 45"
                                            fill="none" stroke="#a01500" strokeWidth="1.5" strokeLinecap="round" />
                                        {/* Lower lip */}
                                        <path d="M 10 50 C 30 78, 80 78, 100 50 C 80 64, 30 64, 10 50 Z"
                                            fill="#d42200" opacity="0.78" />
                                        {/* Gloss highlight */}
                                        <ellipse cx="40" cy="60" rx="10" ry="3.5" fill="#ff7755" opacity="0.35" transform="rotate(-8 40 60)" />
                                    </svg>
                                </div>
                            ))}

                            {/* Floating hearts rising up from the kisses */}
                            {[
                                { x: 45,  size: 14, delay: 2.1, color: '#ff6b81' },
                                { x: 100, size: 10, delay: 2.6, color: '#ff4757' },
                                { x: 25,  size: 8,  delay: 3.0, color: '#ffa0b4' },
                                { x: 130, size: 12, delay: 3.3, color: '#ff6b81' },
                                { x: 70,  size: 9,  delay: 3.8, color: '#ff4757' },
                            ].map((h, i) => (
                                <div key={i} style={{
                                    position: 'absolute',
                                    left: h.x,
                                    bottom: 0,
                                    animation: `heartFloat 3s ease-in ${h.delay}s infinite`,
                                    opacity: 0,
                                }}>
                                    <svg viewBox="0 0 24 24" width={h.size} height={h.size}>
                                        <path d="M12 21C12 21 3 13.5 3 7.5C3 5 5 3 7.5 3C9.24 3 10.91 4 12 5.5C13.09 4 14.76 3 16.5 3C19 3 21 5 21 7.5C21 13.5 12 21 12 21Z"
                                            fill={h.color} />
                                    </svg>
                                </div>
                            ))}

                            <style>{`
                                @keyframes kissPopIn {
                                    0%   { opacity: 0; transform: rotate(var(--r, 0deg)) scale(0); }
                                    60%  { opacity: 1; transform: rotate(var(--r, 0deg)) scale(1.15); }
                                    100% { opacity: 1; transform: rotate(var(--r, 0deg)) scale(1); }
                                }
                                @keyframes heartFloat {
                                    0%   { opacity: 0; transform: translateY(0) scale(0.5); }
                                    15%  { opacity: 1; transform: translateY(-20px) scale(1); }
                                    85%  { opacity: 0.6; transform: translateY(-160px) scale(0.8); }
                                    100% { opacity: 0; transform: translateY(-200px) scale(0.4); }
                                }
                            `}</style>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PAGE ── */}
                <div className={`${styles.dummyPage} ${styles.linedPage}`} style={{ zIndex: 10 }}>
                    <div className={styles.pageContent} style={{ position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999' }}>
                            Date:
                        </div>

                        {/* Intro text */}
                        <div ref={rightIntroRef} style={{ marginTop: '4.5rem', paddingLeft: '1.5rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.3rem', color: '#333', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: 0 }}>
                            <div>Oiya sayang kamu kan</div>
                            <div>Hp nya ke riset ya, nih</div>
                            <div>aku liatin first time</div>
                            <div>kamu chat aku di <strong>13</strong></div>
                            <div><strong>september 2025</strong></div>
                        </div>

                        {/* Chat area */}
                        <div ref={chatContainerRef} style={{ flex: 1, overflowY: 'auto', paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.7rem', scrollbarWidth: 'none' }}>
                            {messages.map(msg => {
                                const isVisible = visibleMsgs.includes(msg.id);
                                const isTyping = typingId === msg.id;
                                if (!isVisible && !isTyping) return null;

                                const isRight = msg.side === 'right';

                                return (
                                    <div key={msg.id} style={{ display: 'flex', justifyContent: isRight ? 'flex-end' : 'flex-start' }}>
                                        {isTyping ? (
                                            /* Typing bubble */
                                            <div style={{
                                                border: '2px solid #555',
                                                borderRadius: isRight ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                                padding: '0.4rem 1rem',
                                                background: 'rgba(255,255,255,0.8)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                fontFamily: 'var(--font-handwriting)',
                                                position: 'relative'
                                            }}>
                                                <style>{`
                                                    @keyframes dotBounce {
                                                        0%, 80%, 100% { transform: translateY(0); opacity:0.4; }
                                                        40% { transform: translateY(-5px); opacity:1; }
                                                    }
                                                `}</style>
                                                {[0, 0.2, 0.4].map((d, i) => (
                                                    <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#555', animation: `dotBounce 1s ${d}s infinite` }} />
                                                ))}
                                            </div>
                                        ) : (
                                            /* Actual message bubble — sketchy hand-drawn look */
                                            <div style={{
                                                position: 'relative',
                                                maxWidth: '75%',
                                                animation: 'bubblePop 0.35s cubic-bezier(0.34,1.56,0.64,1) both'
                                            }}>
                                                <style>{`
                                                    @keyframes bubblePop {
                                                        from { opacity:0; transform:scale(0.5); }
                                                        to   { opacity:1; transform:scale(1); }
                                                    }
                                                `}</style>
                                                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
                                                    <rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)" rx="14" ry="14"
                                                        fill="rgba(255,255,255,0.85)" stroke="#444" strokeWidth="2"
                                                        style={{ width: 'calc(100% - 4px)', height: 'calc(100% - 4px)' }} />
                                                </svg>
                                                <div style={{
                                                    position: 'relative',
                                                    padding: '0.4rem 1rem',
                                                    fontFamily: 'var(--font-handwriting)',
                                                    fontSize: '1.25rem',
                                                    color: '#333',
                                                    border: '2px solid #444',
                                                    borderRadius: isRight ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                                    background: isRight ? 'rgba(255,252,220,0.7)' : 'rgba(255,255,255,0.8)',
                                                    boxShadow: '1px 1px 0 #bbb'
                                                }}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
