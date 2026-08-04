"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene12ChatProps {
    isActive?: boolean;
    onNext?: () => void;
    onPrev?: () => void;
    // Left page — playlist note
    playlistTitle?: string;
    playlistItems?: PlaylistItem[];
    repeatNote?: string;
    randomNostalgiaNote?: string;
    noNewSongsNote?: string;
    cassetteLabel?: string;
    cassetteSubtitle?: string;
}

interface PlaylistItem {
    text: string;
    highlight?: 'yellow' | 'pink';
    underline?: boolean;
}

const messages = [
    { id: 1, side: 'left', sender: 'aku', text: 'hi', delay: 3.5 },
    { id: 2, side: 'right', sender: 'dia', text: 'oke siip', delay: 6.5 },
    { id: 3, side: 'left', sender: 'aku', text: 'punten pket', delay: 9.5 },
    { id: 4, side: 'right', sender: 'dia', text: 'hahaha', delay: 12.5 },
];

const defaultPlaylist: PlaylistItem[] = [
    { text: 'willow – taylor swift' },
    { text: 'me, myself & i – 5sos', highlight: 'yellow' },
    { text: 'who do you love – marianas trench' },
    { text: 'you need me now? – girl in red, sabrina carpenter', underline: true },
    { text: 'close to you – gracie abrams' },
    { text: 'eight – iu, suga' },
    { text: '打上花火 – daoko, kenshi yonezu' },
    { text: "don't stop me now – queen" },
    { text: 'talk love – k.will', highlight: 'pink' },
    { text: 'wait for it – hamilton' },
];

/* ───────────────── Cassette tape (inline SVG) ───────────────── */

const CassetteTape = ({ label, subtitle }: { label: string; subtitle: string }) => (
    <svg viewBox="0 0 340 220" width="100%" height="100%" style={{ overflow: 'visible' }}>
        {/* Body */}
        <rect x="0" y="0" width="340" height="220" rx="18" fill="#c9a3e0" />
        <rect x="6" y="6" width="328" height="208" rx="14" fill="#b892d6" />

        {/* Corner screws */}
        {[[22, 22], [318, 22], [22, 198], [318, 198]].map(([cx, cy], i) => (
            <g key={i}>
                <circle cx={cx} cy={cy} r="7" fill="#8a6bb0" />
                <circle cx={cx} cy={cy} r="7" fill="none" stroke="#6f4f96" strokeWidth="1.5" />
            </g>
        ))}

        {/* Label panel */}
        <rect x="18" y="18" width="304" height="112" rx="8" fill="#eef0e4" />
        <rect x="18" y="18" width="150" height="112" rx="8" fill="#c7ded6" />
        {/* Ruled lines on right side of label */}
        {[0, 1, 2, 3, 4].map(i => (
            <line key={i} x1="176" y1={40 + i * 16} x2="312" y2={40 + i * 16} stroke="#d8d8ce" strokeWidth="1" />
        ))}

        <text x="34" y="88" fontFamily="var(--font-handwriting)" fontSize="34" fontWeight={700} fill="#222">
            music
        </text>
        <text x="184" y="48" fontFamily="var(--font-handwriting)" fontSize="15" fill="#333">
            {subtitle.split('\n')[0]}
        </text>
        <text x="184" y="66" fontFamily="var(--font-handwriting)" fontSize="15" fill="#333">
            {subtitle.split('\n')[1] || ''}
        </text>

        {/* Lower dark window with reels */}
        <rect x="18" y="140" width="304" height="66" rx="8" fill="#3a3a3a" />
        <rect x="34" y="152" width="272" height="42" rx="4" fill="#2a2a2a" />

        {/* Reels */}
        {[95, 245].map((cx, i) => (
            <g key={i}>
                <circle cx={cx} cy={173} r="26" fill="#4a4a4a" />
                <circle cx={cx} cy={173} r="18" fill="#3a3a3a" />
                {Array.from({ length: 8 }).map((_, t) => {
                    const angle = (t / 8) * Math.PI * 2;
                    const x1 = cx + Math.cos(angle) * 8;
                    const y1 = 173 + Math.sin(angle) * 8;
                    const x2 = cx + Math.cos(angle) * 15;
                    const y2 = 173 + Math.sin(angle) * 15;
                    return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#666" strokeWidth="3" strokeLinecap="round" />;
                })}
                <circle cx={cx} cy={173} r="4" fill="#1a1a1a" />
            </g>
        ))}

        {/* Screws on cassette front */}
        {[[57, 173], [283, 173]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="4" fill="#666" />
        ))}
    </svg>
);

export default function Scene12Chat({
    onNext,
    onPrev,
    isActive = true,
    playlistTitle = 'playlist',
    playlistItems = defaultPlaylist,
    repeatNote = 'on repeat since\ni heard it live (!!)',
    randomNostalgiaNote = '?? random\nnostalgia',
    noNewSongsNote = 'no new songs??\nidk why',
    cassetteLabel = 'music',
    cassetteSubtitle = 'songs i had\non repeat',
}: Scene12ChatProps) {
    const noteRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const repeatNoteRef = useRef<HTMLDivElement>(null);
    const braceNoteRef = useRef<HTMLDivElement>(null);
    const pinkNoteRef = useRef<HTMLDivElement>(null);
    const cassetteRef = useRef<HTMLDivElement>(null);

    const rightIntroRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Which messages are visible and which show typing indicator
    const [visibleMsgs, setVisibleMsgs] = useState<number[]>([]);
    const [typingId, setTypingId] = useState<number | null>(null);

    useEffect(() => {
        if (!isActive) return;
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

        // Torn paper note drops in
        if (noteRef.current) {
            tl.fromTo(noteRef.current,
                { opacity: 0, y: -30, rotate: -6 },
                { opacity: 1, y: 0, rotate: -2, duration: 0.7, ease: 'back.out(1.5)' }, 0.2);
        }
        if (titleRef.current) {
            tl.fromTo(titleRef.current, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.5 }, 0.5);
        }
        if (listRef.current) {
            tl.fromTo(listRef.current.children,
                { opacity: 0, x: -8 },
                { opacity: 1, x: 0, duration: 0.35, stagger: 0.08 }, 0.7);
        }
        if (repeatNoteRef.current) {
            tl.fromTo(repeatNoteRef.current, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 1.4);
        }
        if (braceNoteRef.current) {
            tl.fromTo(braceNoteRef.current, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.4 }, 1.6);
        }
        if (pinkNoteRef.current) {
            tl.fromTo(pinkNoteRef.current, { opacity: 0, x: 8 }, { opacity: 1, x: 0, duration: 0.4 }, 1.7);
        }
        if (cassetteRef.current) {
            tl.fromTo(cassetteRef.current,
                { opacity: 0, y: 40, rotate: 4 },
                { opacity: 1, y: 0, rotate: -3, duration: 0.8, ease: 'back.out(1.4)' }, 1.0);
        }

        // Right intro text
        if (rightIntroRef.current) {
            tl.fromTo(rightIntroRef.current.children,
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.25 }, 0.6);
        }

        // Sequence of chat messages — each: show typing for ~1.5s, then reveal
        messages.forEach(msg => {
            tl.call(() => setTypingId(msg.id), [], msg.delay);
            tl.call(() => {
                setTypingId(null);
                setVisibleMsgs(prev => [...prev, msg.id]);
            }, [], msg.delay + 1.8);
        });

        return () => { tl.kill(); };
    }, []);

    // Scroll chat to bottom when new message appears
    useEffect(() => {
        if (!isActive) return;
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [visibleMsgs, typingId]);

    // Jagged torn-paper top edge as a clip-path polygon
    const tornClipPath = `polygon(
        0% 6%, 4% 3%, 8% 7%, 13% 2%, 18% 5%, 23% 1%, 28% 6%, 33% 2%,
        38% 5%, 43% 0%, 48% 4%, 53% 1%, 58% 6%, 63% 2%, 68% 5%, 73% 1%,
        78% 6%, 83% 2%, 88% 5%, 93% 1%, 97% 5%, 100% 3%,
        100% 100%, 0% 100%
    )`;

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
                {/* ══════════════ LEFT PAGE — playlist note + cassette ══════════════ */}
                <div className={`${styles.pageLeft} ${styles.linedPage}`}>
                    <div
                        className={styles.pageContent}
                        style={{
                            position: 'relative',
                            overflow: 'hidden',
                            background: 'radial-gradient(ellipse at 30% 20%, #c9a06b 0%, #b8895a 45%, #a87849 100%)',
                        }}
                    >
                        {/* subtle kraft-paper grain */}
                        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15, mixBlendMode: 'multiply' }}>
                            <filter id="grain">
                                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
                                <feColorMatrix type="saturate" values="0" />
                            </filter>
                            <rect width="100%" height="100%" filter="url(#grain)" />
                        </svg>

                        {/* Torn white note */}
                        <div
                            ref={noteRef}
                            style={{
                                position: 'absolute',
                                top: '1.6rem',
                                left: '50%',
                                transform: 'translateX(-50%) rotate(-2deg)',
                                width: '87%',
                                background: '#f7f4ee',
                                clipPath: tornClipPath,
                                boxShadow: '0 12px 24px rgba(0,0,0,0.28)',
                                padding: '1.6rem 1.3rem 1.1rem 1.3rem',
                                minHeight: '17rem',
                            }}
                        >
                            {/* Title */}
                            <div
                                ref={titleRef}
                                style={{
                                    fontFamily: 'var(--font-handwriting)',
                                    fontWeight: 800,
                                    fontSize: '2rem',
                                    color: '#1a1a1a',
                                }}
                            >
                                {playlistTitle}
                            </div>

                            {/* "on repeat since i heard it live" annotation + arrow */}
                            <div
                                ref={repeatNoteRef}
                                style={{
                                    position: 'absolute',
                                    top: '0.9rem',
                                    right: '0.6rem',
                                    width: '7.2rem',
                                    textAlign: 'right',
                                    fontFamily: 'var(--font-handwriting)',
                                    fontSize: '0.72rem',
                                    color: '#c23b2f',
                                    lineHeight: 1.3,
                                    fontStyle: 'italic',
                                }}
                            >
                                {repeatNote.split('\n').map((l, i) => <div key={i}>{l}</div>)}
                                <svg width="34" height="20" viewBox="0 0 34 20" style={{ marginTop: '2px', marginLeft: 'auto' }}>
                                    <path d="M2 4 C14 2, 20 14, 30 12" fill="none" stroke="#c23b2f" strokeWidth="1.6" strokeLinecap="round" />
                                    <path d="M24 8 L30 12 L25 16" fill="none" stroke="#c23b2f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            {/* Numbered list */}
                            <div
                                ref={listRef}
                                style={{
                                    marginTop: '0.9rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.32rem',
                                    fontFamily: 'var(--font-handwriting)',
                                    fontSize: '0.92rem',
                                    color: '#222',
                                    position: 'relative',
                                }}
                            >
                                {playlistItems.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', lineHeight: 1.35 }}>
                                        <span style={{ minWidth: '1.1rem' }}>{i + 1}.</span>
                                        <span
                                            style={{
                                                background: item.highlight === 'yellow' ? '#f5d76e' : item.highlight === 'pink' ? '#f3b8cc' : 'transparent',
                                                textDecoration: item.underline ? 'underline' : 'none',
                                                textDecorationColor: '#c23b2f',
                                                textDecorationThickness: '2px',
                                                padding: item.highlight ? '0 0.2rem' : 0,
                                                borderRadius: item.highlight ? '3px' : 0,
                                            }}
                                        >
                                            {item.text}
                                        </span>
                                    </div>
                                ))}

                                {/* Brace + "random nostalgia" note beside items 6–8 */}
                                <div
                                    ref={braceNoteRef}
                                    style={{
                                        position: 'absolute',
                                        left: '-3.6rem',
                                        top: '4.55rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.2rem',
                                    }}
                                >
                                    <div style={{ textAlign: 'right', fontFamily: 'var(--font-handwriting)', fontSize: '0.65rem', color: '#c23b2f', lineHeight: 1.2, fontStyle: 'italic' }}>
                                        {randomNostalgiaNote.split('\n').map((l, i) => <div key={i}>{l}</div>)}
                                    </div>
                                    <svg width="14" height="52" viewBox="0 0 14 52">
                                        <path d="M12 2 C4 2, 8 24, 2 26 C8 28, 4 50, 12 50" fill="none" stroke="#c23b2f" strokeWidth="1.4" />
                                    </svg>
                                </div>

                                {/* "no new songs?? idk why" beside item 9 */}
                                <div
                                    ref={pinkNoteRef}
                                    style={{
                                        position: 'absolute',
                                        right: '-4.4rem',
                                        top: '6.55rem',
                                        width: '4.6rem',
                                        fontFamily: 'var(--font-handwriting)',
                                        fontSize: '0.65rem',
                                        color: '#c23b2f',
                                        lineHeight: 1.2,
                                        fontStyle: 'italic',
                                    }}
                                >
                                    {noNewSongsNote.split('\n').map((l, i) => <div key={i}>{l}</div>)}
                                </div>
                            </div>
                        </div>

                        {/* Cassette tape — overlaps bottom of the note */}
                        <div
                            ref={cassetteRef}
                            style={{
                                position: 'absolute',
                                bottom: '-1.4rem',
                                left: '50%',
                                transform: 'translateX(-50%) rotate(-3deg)',
                                width: '78%',
                                maxWidth: '260px',
                                filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.35))',
                            }}
                        >
                            <CassetteTape label={cassetteLabel} subtitle={cassetteSubtitle} />
                        </div>
                    </div>
                </div>

                {/* ══════════════ RIGHT PAGE — unchanged chat scene ══════════════ */}
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
                                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isRight ? 'flex-end' : 'flex-start' }}>
                                        <div style={{
                                            fontFamily: 'var(--font-handwriting)',
                                            fontSize: '0.85rem',
                                            color: '#888',
                                            marginBottom: '0.2rem',
                                            marginLeft: isRight ? 0 : '0.5rem',
                                            marginRight: isRight ? '0.5rem' : 0,
                                        }}>
                                            {msg.sender}
                                        </div>
                                        {isTyping ? (
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