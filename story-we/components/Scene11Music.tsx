"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene11MusicProps {
    onNext?: () => void;
    onPrev?: () => void;
    /** Song / artist text shown on the card */
    songTitle?: string;
    artistName?: string;
    /** Optional album art URL. If provided, it's rendered automatically inside the disc.
     *  If omitted, a default illustrated label (stars + moon + mountain) is drawn instead. */
    albumArt?: string;
}

export default function Scene11Music({
    onNext,
    onPrev,
    songTitle = 'Music Name',
    artistName = 'Singer & artist',
    albumArt,
}: Scene11MusicProps) {
    const titleRef = useRef<HTMLDivElement>(null);
    const playerBoxRef = useRef<HTMLDivElement>(null);
    const vinylRef = useRef<SVGSVGElement>(null);
    const vinylWrapRef = useRef<HTMLDivElement>(null);
    const songInfoRef = useRef<HTMLDivElement>(null);
    const controlsRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const leftFadeRef = useRef<HTMLDivElement>(null);
    const playBtnRef = useRef<HTMLButtonElement>(null);
    const repeatIconRef = useRef<HTMLSpanElement>(null);
    const notesLayerRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [isRepeat, setIsRepeat] = useState(false);
    const totalDuration = 268; // 4:28 in seconds

    // Unique id so multiple players on one page don't clash clip-paths
    const [clipId] = useState(() => `vinylClip-${Math.random().toString(36).slice(2, 9)}`);

    const vinylTweenRef = useRef<gsap.core.Tween | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const noteIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

    // ── Little notes floating up near the disc while playing ──
    const spawnNote = () => {
        if (!notesLayerRef.current) return;
        const note = document.createElement('div');
        const glyphs = ['♪', '♫', '♬'];
        note.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
        note.style.position = 'absolute';
        note.style.left = `${20 + Math.random() * 30}px`;
        note.style.bottom = '0px';
        note.style.fontSize = `${0.8 + Math.random() * 0.5}rem`;
        note.style.color = '#b8b0c9';
        note.style.pointerEvents = 'none';
        note.style.opacity = '0';
        notesLayerRef.current.appendChild(note);

        gsap.fromTo(note,
            { y: 0, opacity: 0, rotate: 0 },
            {
                y: -60 - Math.random() * 15,
                x: (Math.random() - 0.5) * 30,
                rotate: (Math.random() - 0.5) * 30,
                opacity: 1,
                duration: 1.6,
                ease: 'power1.out',
                onComplete: () => note.remove(),
            }
        );
        gsap.to(note, { opacity: 0, duration: 0.5, delay: 1.0, ease: 'power1.in' });
    };

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

        if (leftFadeRef.current) {
            tl.fromTo(leftFadeRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5 }, 0);
        }
        if (titleRef.current) {
            tl.fromTo(titleRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.6 }, 0.4);
        }
        if (playerBoxRef.current) {
            tl.fromTo(playerBoxRef.current, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.4)' }, 0.8);
        }
        if (songInfoRef.current) {
            tl.fromTo(songInfoRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 1.2);
        }
        if (progressRef.current) {
            tl.fromTo(progressRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.5);
        }
        if (controlsRef.current) {
            tl.fromTo(controlsRef.current, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5 }, 1.6);
        }

        vinylTweenRef.current = gsap.to(vinylRef.current, {
            rotation: 360,
            transformOrigin: 'center center',
            repeat: -1,
            duration: 3,
            ease: 'none',
        });

        timerRef.current = setInterval(() => {
            setCurrentTime(t => {
                if (t >= totalDuration) { clearInterval(timerRef.current!); return totalDuration; }
                return t + 1;
            });
        }, 1000);

        noteIntervalRef.current = setInterval(spawnNote, 900);

        return () => {
            tl.kill();
            vinylTweenRef.current?.kill();
            if (timerRef.current) clearInterval(timerRef.current);
            if (noteIntervalRef.current) clearInterval(noteIntervalRef.current);
        };
    }, []);

    // Notes only float while playing
    useEffect(() => {
        if (isPlaying) {
            if (!noteIntervalRef.current) noteIntervalRef.current = setInterval(spawnNote, 900);
        } else if (noteIntervalRef.current) {
            clearInterval(noteIntervalRef.current);
            noteIntervalRef.current = null;
        }
    }, [isPlaying]);

    const togglePlay = () => {
        if (playBtnRef.current) {
            gsap.fromTo(playBtnRef.current, { scale: 0.75 }, { scale: 1, duration: 0.45, ease: 'elastic.out(1.1, 0.5)' });
        }
        setIsPlaying(p => {
            const next = !p;
            if (vinylTweenRef.current) next ? vinylTweenRef.current.resume() : vinylTweenRef.current.pause();
            if (next) {
                timerRef.current = setInterval(() => {
                    setCurrentTime(t => {
                        if (t >= totalDuration) { clearInterval(timerRef.current!); return totalDuration; }
                        return t + 1;
                    });
                }, 1000);
            } else if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            return next;
        });
    };

    const nudgeVinyl = () => {
        if (!vinylRef.current) return;
        gsap.to(vinylRef.current, { scale: 0.94, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' });
    };

    const handleSkip = (delta: number) => {
        setCurrentTime(t => Math.max(0, Math.min(totalDuration, t + delta)));
        nudgeVinyl();
    };

    const toggleRepeat = () => {
        setIsRepeat(r => !r);
        if (repeatIconRef.current) {
            gsap.fromTo(repeatIconRef.current, { rotate: 0 }, { rotate: 360, duration: 0.6, ease: 'power2.out' });
        }
    };

    const handleBoxEnter = () => {
        if (!playerBoxRef.current) return;
        gsap.to(playerBoxRef.current, { y: -3, boxShadow: '0 14px 32px rgba(0,0,0,0.16)', duration: 0.3, ease: 'power2.out' });
    };
    const handleBoxLeave = () => {
        if (!playerBoxRef.current) return;
        gsap.to(playerBoxRef.current, { y: 0, boxShadow: '0 10px 26px rgba(0,0,0,0.12)', duration: 0.4, ease: 'power2.out' });
    };

    const progressPct = (currentTime / totalDuration) * 100;

    useEffect(() => {
        if (!thumbRef.current) return;
        if (isPlaying) {
            const t = gsap.to(thumbRef.current, { scale: 1.2, duration: 0.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
            return () => { t.kill(); gsap.set(thumbRef.current, { scale: 1 }); };
        }
    }, [isPlaying]);

    return (
        <>
            {onPrev && (
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
                {/* ── LEFT PAGE — mostly blank with faint heart bleed-through ── */}
                <div className={`${styles.pageLeft} ${styles.linedPage}`}>
                    <div className={styles.pageContent}>
                        <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999' }}>
                            Date:
                        </div>
                        <div ref={leftFadeRef} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0, pointerEvents: 'none' }}>
                            <svg viewBox="0 0 200 200" width="200" height="200" style={{ opacity: 0.08 }}>
                                <path d="M100 170 C100 170,20 110,20 55 C20 20,60 12,100 55 C140 12,180 20,180 55 C180 110,100 170,100 170Z" fill="#cc3333" />
                            </svg>
                        </div>
                        <div style={{ position: 'absolute', bottom: '6rem', left: '1.5rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.2rem', color: '#bbb', transform: 'rotate(-6deg)' }}>
                            ♪ ♫
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PAGE ── */}
                <div className={`${styles.dummyPage} ${styles.linedPage}`} style={{ zIndex: 10 }}>
                    <div className={styles.pageContent} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 0 }}>
                        <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999' }}>
                            Date:
                        </div>

                        <div ref={titleRef} style={{ marginTop: '4.5rem', paddingLeft: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '2rem', color: '#333', letterSpacing: '1px' }}>
                            kamu itu
                        </div>

                        <div style={{ paddingLeft: '2.2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#888', fontStyle: 'italic', marginTop: '0.3rem' }}>
                            Orya sayang, aku mungkin...
                        </div>

                        {/* ══ Clean white player card (matches reference) ══ */}
                        <div style={{ position: 'relative', width: '86%', maxWidth: '320px', margin: '2.6rem auto 0' }}>

                            {/* Disc — peeks out of the top-left corner of the card */}
                            <div
                                ref={vinylWrapRef}
                                style={{ position: 'absolute', top: '-30px', left: '14px', width: '86px', height: '86px', zIndex: 3 }}
                            >
                                <div style={{ position: 'absolute', inset: '-4px', borderRadius: '50%', background: '#fff', boxShadow: '0 6px 14px rgba(0,0,0,0.22)' }} />
                                <svg
                                    ref={vinylRef}
                                    width={86} height={86} viewBox="0 0 128 128"
                                    style={{ position: 'relative', borderRadius: '50%' }}
                                >
                                    <defs>
                                        <clipPath id={clipId}>
                                            <circle cx={64} cy={64} r={64} />
                                        </clipPath>
                                    </defs>
                                    <g clipPath={`url(#${clipId})`}>
                                        {albumArt ? (
                                            // Auto-renders the provided album art, cropped to a circle
                                            <image href={albumArt} x={0} y={0} width={128} height={128} preserveAspectRatio="xMidYMid slice" />
                                        ) : (
                                            // Default illustrated label when no album art is supplied
                                            <>
                                                <rect width={128} height={128} fill="#111318" />
                                                <circle cx={20} cy={20} r={2} fill="#fff" />
                                                <circle cx={40} cy={30} r={2} fill="#fff" />
                                                <circle cx={60} cy={10} r={2} fill="#fff" />
                                                <circle cx={80} cy={40} r={2} fill="#fff" />
                                                <circle cx={100} cy={20} r={2} fill="#fff" />
                                                <circle cx={120} cy={50} r={2} fill="#fff" />
                                                <circle cx={90} cy={30} r={10} fill="#fff" fillOpacity="0.5" />
                                                <circle cx={90} cy={30} r={8} fill="#fff" />
                                                <path d="M0 128 Q32 64 64 128 T128 128" fill="#7e3ff2" opacity="0.9" />
                                                <path d="M0 128 Q32 48 64 128 T128 128" fill="#9b6bf0" opacity="0.9" />
                                                <path d="M0 128 Q32 32 64 128 T128 128" fill="#5b2fc7" opacity="0.9" />
                                                <path d="M0 128 Q16 64 32 128 T64 128" fill="#7e3ff2" opacity="0.9" />
                                                <path d="M64 128 Q80 64 96 128 T128 128" fill="#9b6bf0" opacity="0.9" />
                                            </>
                                        )}
                                    </g>
                                </svg>
                                <div ref={notesLayerRef} style={{ position: 'absolute', top: '-40px', left: 0, width: '90px', height: '40px', pointerEvents: 'none', overflow: 'visible' }} />
                            </div>

                            {/* Card body */}
                            <div
                                ref={playerBoxRef}
                                onMouseEnter={handleBoxEnter}
                                onMouseLeave={handleBoxLeave}
                                style={{
                                    background: '#fff',
                                    borderRadius: '20px',
                                    boxShadow: '0 10px 26px rgba(0,0,0,0.12)',
                                    padding: '1.6rem 1.2rem 1.1rem 1.2rem',
                                    position: 'relative',
                                }}
                            >
                                {/* Title + artist, offset right so the disc doesn't overlap the text */}
                                <div ref={songInfoRef} style={{ marginLeft: '78px', minHeight: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <span style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', fontSize: '1.15rem', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}>
                                        {songTitle}
                                    </span>
                                    <span style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', fontSize: '0.95rem', color: '#8a8a8a', marginTop: '2px' }}>
                                        {artistName}
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div ref={progressRef} style={{ marginTop: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: '#9a9a9a', minWidth: '30px' }}>{fmt(currentTime)}</span>
                                    <div
                                        style={{ position: 'relative', flex: 1, height: '4px', background: '#e6e6ea', borderRadius: '3px', cursor: 'pointer' }}
                                        onClick={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const pct = (e.clientX - rect.left) / rect.width;
                                            setCurrentTime(Math.round(pct * totalDuration));
                                        }}
                                    >
                                        <div style={{ width: `${progressPct}%`, height: '100%', background: '#c9c6d6', borderRadius: '3px', transition: 'width 1s linear' }} />
                                        <div ref={thumbRef} style={{ position: 'absolute', top: '50%', left: `${progressPct}%`, transform: 'translate(-50%,-50%)', width: '11px', height: '11px', borderRadius: '50%', background: '#fff', border: '2px solid #9b93b0', boxShadow: '0 1px 3px rgba(0,0,0,0.25)' }} />
                                    </div>
                                    <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: '#9a9a9a', minWidth: '30px', textAlign: 'right' }}>{fmt(totalDuration)}</span>
                                </div>

                                {/* Controls */}
                                <div ref={controlsRef} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.4rem', marginTop: '0.9rem' }}>

                                    {/* Repeat */}
                                    <button
                                        onClick={toggleRepeat}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}
                                    >
                                        <span ref={repeatIconRef} style={{ display: 'inline-flex' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={isRepeat ? '#333' : '#9a9a9a'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="17 1 21 5 17 9" />
                                                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                                                <polyline points="7 23 3 19 7 15" />
                                                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                                            </svg>
                                        </span>
                                    </button>

                                    {/* Skip back */}
                                    <button
                                        onClick={() => handleSkip(-15)}
                                        onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.15, duration: 0.2 })}
                                        onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="19 20 9 12 19 4 19 20" />
                                            <line x1={5} y1={19} x2={5} y2={5} />
                                        </svg>
                                    </button>

                                    {/* Play / Pause */}
                                    <button
                                        ref={playBtnRef}
                                        onClick={togglePlay}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}
                                    >
                                        {isPlaying ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width={26} height={26} viewBox="0 0 24 24" fill="#1a1a1a">
                                                <rect x={6} y={4} width={4} height={16} rx={1} />
                                                <rect x={14} y={4} width={4} height={16} rx={1} />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                                <polygon points="5 3 19 12 5 21 5 3" />
                                            </svg>
                                        )}
                                    </button>

                                    {/* Skip forward */}
                                    <button
                                        onClick={() => handleSkip(15)}
                                        onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.15, duration: 0.2 })}
                                        onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="5 4 15 12 5 20 5 4" />
                                            <line x1={19} y1={5} x2={19} y2={19} />
                                        </svg>
                                    </button>

                                    {/* List */}
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#9a9a9a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <line x1={8} y1={6} x2={21} y2={6} />
                                            <line x1={8} y1={12} x2={21} y2={12} />
                                            <line x1={8} y1={18} x2={21} y2={18} />
                                            <line x1={3} y1={6} x2="3.01" y2={6} />
                                            <line x1={3} y1={12} x2="3.01" y2={12} />
                                            <line x1={3} y1={18} x2="3.01" y2={18} />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}