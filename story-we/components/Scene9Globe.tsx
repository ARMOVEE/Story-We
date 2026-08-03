"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene9GlobeProps {
    isActive?: boolean;
    onNext?: () => void;
    onPrev?: () => void;
}

export default function Scene9Globe({ onNext, onPrev, isActive = true }: Scene9GlobeProps) {
    const textRightRef = useRef<HTMLDivElement>(null);
    const underlineRef = useRef<SVGSVGElement>(null);
    const circleRef = useRef<SVGSVGElement>(null);
    const globeRef = useRef<HTMLImageElement>(null);
    const hangRef = useRef<HTMLImageElement>(null);

    // Left page: camera + photo frame
    const kameraRef = useRef<HTMLImageElement>(null);
    const flashRef = useRef<HTMLDivElement>(null);
    const frameFotoRef = useRef<HTMLImageElement>(null);
    const queenRef = useRef<HTMLImageElement>(null);
    const favoriteRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (!isActive) return;
        const tl = gsap.timeline();

        // Queen (top-left corner of kamera) and Favorite (top-right corner
        // of kamera) pop in before the camera itself.
        if (queenRef.current) {
            tl.fromTo(queenRef.current,
                { opacity: 0, scale: 0.6, rotation: -15 },
                { 
                    opacity: 1, 
                    scale: 1, 
                    rotation: 0, 
                    duration: 0.6, 
                    ease: 'back.out(2)',
                    onComplete: () => {
                        gsap.to(queenRef.current, {
                            rotation: 18,
                            duration: 0.4,
                            ease: 'steps(3)',
                            repeat: -1,
                            yoyo: true,
                            transformOrigin: '50% 50%'
                        });
                    }
                }
            );
        }
        if (favoriteRef.current) {
            tl.fromTo(favoriteRef.current,
                { opacity: 0, scale: 0.6, rotation: 15 },
                { 
                    opacity: 1, 
                    scale: 1, 
                    rotation: 0, 
                    duration: 0.6, 
                    ease: 'back.out(2)',
                    onComplete: () => {
                        gsap.to(favoriteRef.current, {
                            rotation: -18,
                            duration: 0.4,
                            ease: 'steps(3)',
                            repeat: -1,
                            yoyo: true,
                            transformOrigin: '50% 50%'
                        });
                    }
                },
                "<"
            );
        }

        // Kamera pops in below the handwritten text
        if (kameraRef.current) {
            tl.fromTo(kameraRef.current,
                { opacity: 0, scale: 0.7 },
                { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }
            );

            // "Crek" — quick shutter-click punch: camera snaps in/out fast
            tl.to(kameraRef.current, {
                scale: 0.9,
                duration: 0.07,
                yoyo: true,
                repeat: 1,
                ease: 'power1.inOut'
            });
        }

        // Flash burst right at the camera lens (center), on the "crek" moment
        if (flashRef.current) {
            tl.fromTo(flashRef.current,
                { opacity: 0, scale: 0.3 },
                { opacity: 1, scale: 1.6, duration: 0.12, ease: 'power1.out' },
                "<"
            );
            tl.to(flashRef.current, { opacity: 0, scale: 2, duration: 0.35, ease: 'power1.out' });
        }

        // Frame foto ejects from behind the camera like a Polaroid sliding
        // out of the slot: it's progressively revealed top-to-bottom while
        // drifting down slightly, instead of just fading in already fully
        // visible. The reveal is driven by `clip-path` rather than
        // `height` — clip-path is GPU-composited so it stays smooth,
        // whereas animating height forces a layout recalculation on every
        // frame and looks janky.
        if (frameFotoRef.current) {
            tl.fromTo(frameFotoRef.current,
                { y: -30, clipPath: 'inset(0% 0% 100% 0%)' },
                { y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'sine.out' },
                "+=0.15"
            );
        }

        // Right text animation
        if (textRightRef.current) {
            tl.fromTo(textRightRef.current.children,
                { opacity: 0, x: -10 },
                { opacity: 1, x: 0, duration: 0.5, stagger: 0.3, ease: 'power1.out' },
                "-=0.5"
            );
        }

        // Highlights (red underline under "Hebat", yellow circle around "KAMU")
        const highlightPaths: SVGPathElement[] = [];
        if (underlineRef.current) highlightPaths.push(...Array.from(underlineRef.current.querySelectorAll('path')));
        if (circleRef.current) highlightPaths.push(...Array.from(circleRef.current.querySelectorAll('path')));
        if (highlightPaths.length) {
            tl.fromTo(highlightPaths,
                { strokeDasharray: 300, strokeDashoffset: 300 },
                { strokeDashoffset: 0, duration: 0.7, stagger: 0.4, ease: 'power2.out' },
                "-=0.2"
            );
        }

        // Right side (Globe and Hang)
        if (globeRef.current) {
            tl.fromTo(globeRef.current,
                { opacity: 0, scale: 0.5 },
                { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)' },
                "-=0.5"
            );

            // Continuous rotation for globe
            gsap.to(globeRef.current, {
                rotation: 360,
                duration: 20,
                repeat: -1,
                ease: 'none'
            });
        }

        if (hangRef.current) {
            tl.fromTo(hangRef.current,
                { opacity: 0, y: -50 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'bounce.out' },
                "-=0.2"
            );
        }

        return () => {
            tl.kill();
            if (globeRef.current) {
                gsap.killTweensOf(globeRef.current);
            }
            if (queenRef.current) {
                gsap.killTweensOf(queenRef.current);
            }
            if (favoriteRef.current) {
                gsap.killTweensOf(favoriteRef.current);
            }
        };
    }, [isActive]);

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

                        {/* Kamera + Frame Foto: camera pops in, does a quick shutter
                            "crek" (punch + flash), then the photo ejects slowly from
                            behind the camera (like the reference gif's slot-eject
                            motion) — a clipping wrapper reveals the photo top-to-bottom
                            as it drifts down, instead of just fading/sliding in whole. */}
                        <div style={{ marginTop: '0', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            <div style={{ position: 'relative', zIndex: 2 }}>
                                <img
                                    ref={kameraRef}
                                    src="/animations/kamera.webp"
                                    alt="Kamera"
                                    style={{ width: '175px', objectFit: 'contain', display: 'block' }}
                                />
                                {/* Queen: sits at the top-left corner of kamera.webp */}
                                <img
                                    ref={queenRef}
                                    src="/animations/queen.webp"
                                    alt="Queen"
                                    style={{
                                        position: 'absolute',
                                        top: '-45px',
                                        left: '-60px',
                                        width: '150px',
                                        objectFit: 'contain',
                                        zIndex: 3
                                    }}
                                />
                                {/* Favorite: sits at the top-right corner of kamera.webp */}
                                <img
                                    ref={favoriteRef}
                                    src="/animations/favorite.webp"
                                    alt="Favorite"
                                    style={{
                                        position: 'absolute',
                                        top: '-5px',
                                        right: '-100px',
                                        width: '250px',
                                        objectFit: 'contain',
                                        zIndex: 3
                                    }}
                                />
                                {/* Flash: a small circular burst centered on the camera
                                    (the lens), not a full overlay — reads as an actual
                                    camera flash rather than a screen-wide whiteout. */}
                                <div
                                    ref={flashRef}
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        width: '45%',
                                        height: '45%',
                                        transform: 'translate(-50%, -50%)',
                                        borderRadius: '50%',
                                        background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 55%, rgba(255,255,255,0) 75%)',
                                        opacity: 0,
                                        pointerEvents: 'none'
                                    }}
                                />
                            </div>

                            {/* Photo emerges from behind the camera slot: revealed via
                                clip-path (GPU-composited, smooth) while drifting down. */}
                            <img
                                ref={frameFotoRef}
                                src="/animations/frameFoto.webp"
                                alt="Frame Foto"
                                style={{
                                    width: '220px',
                                    marginTop: '-95px',
                                    objectFit: 'contain',
                                    display: 'block',
                                    position: 'relative',
                                    zIndex: 1
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PAGE ── */}
                <div className={`${styles.dummyPage} ${styles.linedPage}`} style={{ zIndex: 10 }}>
                    <div className={styles.pageContent} style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999' }}>
                            Date:
                        </div>

                        <div style={{ marginTop: '2.5rem', paddingLeft: '2rem', paddingRight: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            {/* Text from before */}
                            <div ref={textRightRef} style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.4rem', color: '#333', lineHeight: '2.2', position: 'relative', zIndex: 20 }}>
                                <div style={{ paddingLeft: '1.5rem' }}>Bumi memiliki</div>
                                <div style={{ paddingLeft: '0.5rem' }}>banyak orang</div>

                                <div style={{ paddingLeft: '1rem' }}>
                                    <span style={{ position: 'relative', display: 'inline-block', color: '#e74c3c', fontWeight: 'bold' }}>
                                        Hebat
                                        <svg ref={underlineRef} width="86" height="18" viewBox="0 0 86 18" style={{ position: 'absolute', bottom: '-8px', left: '0', overflow: 'visible' }}>
                                            <path d="M 2 8 Q 22 14, 43 6 Q 64 -1, 83 9" fill="none" stroke="#e74c3c" strokeWidth="2.5" strokeLinecap="round" />
                                        </svg>
                                    </span>
                                </div>

                                <div style={{ paddingLeft: '2rem' }}>yaitu...</div>

                                <div style={{ paddingLeft: '0.25rem' }}>
                                    <span style={{ position: 'relative', display: 'inline-block', fontWeight: 'bold', padding: '0 0.35rem' }}>
                                        KAMU
                                        <svg ref={circleRef} width="128" height="56" viewBox="0 0 128 56" style={{ position: 'absolute', top: '-13px', left: '-14px', overflow: 'visible' }}>
                                            <path
                                                d="M 20 28 C 18 8, 45 4, 64 5 C 85 4, 112 9, 110 29
                                                   C 112 49, 85 53, 64 52 C 45 53, 18 48, 20 28 Z"
                                                fill="none" stroke="#f1c40f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                            />
                                        </svg>
                                    </span>
                                </div>

                                <div style={{ paddingLeft: '1.75rem' }}>Salah</div>
                                <div style={{ paddingLeft: '3rem' }}>satunya</div>
                            </div>

                            {/* Globe animation — moved up: justifyContent switched from
                                'flex-end' (bottom) to 'flex-start' (top of the remaining
                                space), and marginTop pulls it up further right under the
                                text instead of sitting at the bottom of the page. */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', marginTop: '-20rem', paddingRight: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <img ref={hangRef} src="/animations/gantung dunia.webp" alt="Gantung Dunia" style={{ width: '150px', marginBottom: '-180px', zIndex: 10, objectFit: 'contain' }} />
                                    <img ref={globeRef} src="/animations/dunia.webp" alt="Dunia" style={{ width: '250px', zIndex: 5, objectFit: 'contain' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}