"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene11MusicProps {
    onNext?: () => void;
}

export default function Scene11Music({ onNext }: Scene11MusicProps) {
    const titleRef = useRef<HTMLDivElement>(null);
    const playerBoxRef = useRef<HTMLDivElement>(null);
    const vinylRef = useRef<SVGSVGElement>(null);
    const songInfoRef = useRef<HTMLDivElement>(null);
    const controlsRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const leftFadeRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const totalDuration = 268; // 4:28 in seconds

    // Vinyl spin tween ref so we can pause/resume
    const vinylTweenRef = useRef<gsap.core.Tween | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Format seconds → M:SS
    const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

        // Left page faint heart bleed-through
        if (leftFadeRef.current) {
            tl.fromTo(leftFadeRef.current,
                { opacity: 0 }, { opacity: 1, duration: 1.5 }, 0);
        }

        // Title
        if (titleRef.current) {
            tl.fromTo(titleRef.current,
                { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.6 }, 0.4);
        }

        // Player box draw-in
        if (playerBoxRef.current) {
            tl.fromTo(playerBoxRef.current,
                { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.4)' }, 0.8);
        }

        // Song info + controls
        if (songInfoRef.current) {
            tl.fromTo(songInfoRef.current,
                { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 1.2);
        }
        if (progressRef.current) {
            tl.fromTo(progressRef.current,
                { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.5);
        }
        if (controlsRef.current) {
            tl.fromTo(controlsRef.current,
                { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5 }, 1.6);
        }

        // Vinyl spin
        vinylTweenRef.current = gsap.to(vinylRef.current, {
            rotation: 360,
            transformOrigin: 'center center',
            repeat: -1,
            duration: 3,
            ease: 'none',
        });

        // Progress ticker
        timerRef.current = setInterval(() => {
            setCurrentTime(t => {
                if (t >= totalDuration) { clearInterval(timerRef.current!); return totalDuration; }
                return t + 1;
            });
        }, 1000);

        return () => {
            tl.kill();
            vinylTweenRef.current?.kill();
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // Toggle play / pause
    const togglePlay = () => {
        setIsPlaying(p => {
            const next = !p;
            if (vinylTweenRef.current) {
                next ? vinylTweenRef.current.resume() : vinylTweenRef.current.pause();
            }
            if (next) {
                timerRef.current = setInterval(() => {
                    setCurrentTime(t => {
                        if (t >= totalDuration) { clearInterval(timerRef.current!); return totalDuration; }
                        return t + 1;
                    });
                }, 1000);
            } else {
                if (timerRef.current) clearInterval(timerRef.current);
            }
            return next;
        });
    };

    const progressPct = (currentTime / totalDuration) * 100;

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
                {/* ── LEFT PAGE — mostly blank with faint heart bleed-through ── */}
                <div className={`${styles.pageLeft} ${styles.linedPage}`}>
                    <div className={styles.pageContent}>
                        <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999' }}>
                            Date:
                        </div>
                        {/* Faint heart bleed-through (ghost from back of previous page) */}
                        <div ref={leftFadeRef} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0, pointerEvents: 'none' }}>
                            <svg viewBox="0 0 200 200" width="200" height="200" style={{ opacity: 0.08 }}>
                                <path d="M100 170 C100 170,20 110,20 55 C20 20,60 12,100 55 C140 12,180 20,180 55 C180 110,100 170,100 170Z" fill="#cc3333" />
                            </svg>
                        </div>
                        {/* Small handwritten note bottom-left */}
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

                        {/* Title */}
                        <div ref={titleRef} style={{ marginTop: '4.5rem', paddingLeft: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '2rem', color: '#333', letterSpacing: '1px' }}>
                            kamu itu
                        </div>

                        {/* Sub line */}
                        <div style={{ paddingLeft: '2.2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#888', fontStyle: 'italic', marginTop: '0.3rem' }}>
                            Orya sayang, aku mungkin...
                        </div>

                        {/* Hand-drawn Player Box */}
                        <div ref={playerBoxRef} style={{ margin: '1.2rem auto 0', width: '82%', maxWidth: '320px' }}>
                            {/* Outer sketch box */}
                            <div style={{
                                border: '2.5px solid #333',
                                borderRadius: '6px',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.6)',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                boxShadow: '2px 2px 0 #aaa'
                            }}>
                                {/* Dot indicators top-left */}
                                <div style={{ position: 'absolute', top: '0.5rem', left: '0.7rem', display: 'flex', gap: '5px' }}>
                                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', border: '1.5px solid #555', background: '#fff' }} />
                                </div>
                                {/* Dot indicators bottom-left */}
                                <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.7rem', display: 'flex', gap: '5px' }}>
                                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', border: '1.5px solid #555', background: '#fff' }} />
                                </div>

                                {/* Vinyl Record */}
                                <svg ref={vinylRef} width="100" height="100" viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
                                    {/* Outer rim */}
                                    <circle cx="50" cy="50" r="46" fill="#222" stroke="#333" strokeWidth="2" />
                                    {/* Grooves */}
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3a3a3a" strokeWidth="1" />
                                    <circle cx="50" cy="50" r="33" fill="none" stroke="#3a3a3a" strokeWidth="1" />
                                    <circle cx="50" cy="50" r="26" fill="none" stroke="#3a3a3a" strokeWidth="1" />
                                    {/* Label */}
                                    <circle cx="50" cy="50" r="18" fill="#555" />
                                    <circle cx="50" cy="50" r="11" fill="#888" />
                                    {/* Center hole */}
                                    <circle cx="50" cy="50" r="4" fill="#eee" stroke="#333" strokeWidth="1" />
                                </svg>

                                {/* Right side — cassette spool sketch */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                                    {[0, 1, 2, 3, 4].map(i => (
                                        <div key={i} style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                                            <div style={{ width: '22px', height: '3px', borderRadius: '2px', background: '#333' }} />
                                            <div style={{ width: '6px', height: '3px', background: 'transparent' }} />
                                            <div style={{ width: '22px', height: '3px', borderRadius: '2px', background: '#333' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Song info */}
                        <div ref={songInfoRef} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingLeft: '2.2rem', marginTop: '0.9rem' }}>
                            <span style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.2rem', color: '#666' }}>+</span>
                            <span style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.7rem', color: '#333', fontWeight: 'bold', letterSpacing: '1px' }}>Sempurna</span>
                        </div>

                        {/* Progress bar */}
                        <div ref={progressRef} style={{ paddingLeft: '2rem', paddingRight: '2rem', marginTop: '0.6rem' }}>
                            {/* Track */}
                            <div style={{ position: 'relative', height: '3px', background: '#ccc', borderRadius: '2px', cursor: 'pointer' }}
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const pct = (e.clientX - rect.left) / rect.width;
                                    setCurrentTime(Math.round(pct * totalDuration));
                                }}>
                                {/* Filled portion */}
                                <div style={{ width: `${progressPct}%`, height: '100%', background: '#333', borderRadius: '2px', transition: 'width 1s linear' }} />
                                {/* Thumb dot */}
                                <div style={{ position: 'absolute', top: '50%', left: `${progressPct}%`, transform: 'translate(-50%,-50%)', width: '10px', height: '10px', borderRadius: '50%', background: '#333', border: '2px solid #fff', boxShadow: '0 0 0 1px #333' }} />
                            </div>
                            {/* Times */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-handwriting)', fontSize: '0.9rem', color: '#888', marginTop: '4px' }}>
                                <span>{fmt(currentTime)}</span>
                                <span>{fmt(totalDuration)}</span>
                            </div>
                        </div>

                        {/* Playback controls */}
                        <div ref={controlsRef} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginTop: '0.4rem' }}>
                            {/* Rewind */}
                            <button onClick={() => setCurrentTime(t => Math.max(0, t - 15))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.3rem', fontSize: '1.4rem', color: '#444' }}>
                                ◀◀
                            </button>
                            {/* Play/Pause */}
                            <button onClick={togglePlay} style={{ background: 'none', border: '2px solid #333', borderRadius: '50%', cursor: 'pointer', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: '#333' }}>
                                {isPlaying ? '⏸' : '▶'}
                            </button>
                            {/* Forward */}
                            <button onClick={() => setCurrentTime(t => Math.min(totalDuration, t + 15))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.3rem', fontSize: '1.4rem', color: '#444' }}>
                                ▶▶
                            </button>
                            {/* Repeat (decorative) */}
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.3rem', fontSize: '1.1rem', color: '#888' }}>
                                🔁
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
