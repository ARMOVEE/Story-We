"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface ChatBubble {
    text: string;
    who: 'me' | 'them';
}

interface Scene11BoyfriendProps {
    isActive?: boolean;
    onNext?: () => void;
    onPrev?: () => void;

    // Left page
    boyfriendName?: string;
    boyfriendPhoto?: string;
    introText?: string;
    quoteText?: string;
    notesMessages?: ChatBubble[];
    monthversaryText?: string;

    // Right page
    framePhoto1?: string;
    frameCaption1?: string;
    frameCaption2?: string;
    loveDefinition?: string;
    aboutMeTitle?: string;
    aboutMeText?: string;
    aboutMePhoto?: string;
    aboutMeName?: string;
}

/* ───────────────── Decorative doodles (inline SVG) ───────────────── */

const Flower = ({ size = 40, color = '#f4a3c2' }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 40 40">
        {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse key={deg} cx="20" cy="10" rx="6" ry="9" fill={color}
                transform={`rotate(${deg} 20 20)`} opacity="0.9" />
        ))}
        <circle cx="20" cy="20" r="5" fill="#ffd76b" />
    </svg>
);

const Star = ({ size = 34, color = '#ffd76b' }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 40 40">
        <path d="M20 2 L24 15 L38 15 L27 23 L31 37 L20 28 L9 37 L13 23 L2 15 L16 15 Z" fill={color} />
    </svg>
);

const Sun = ({ size = 60 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="14" fill="#ffb84d" />
        {Array.from({ length: 8 }).map((_, i) => {
            const deg = i * 45;
            return (
                <rect key={i} x="28" y="2" width="4" height="10" rx="2" fill="#ffb84d"
                    transform={`rotate(${deg} 30 30)`} />
            );
        })}
    </svg>
);

const Butterfly = ({ size = 36 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 40 40">
        <path d="M20 20 C10 4 0 8 4 18 C7 26 16 24 20 20Z" fill="#b79ce8" opacity="0.85" />
        <path d="M20 20 C30 4 40 8 36 18 C33 26 24 24 20 20Z" fill="#b79ce8" opacity="0.85" />
        <path d="M20 20 C13 26 6 30 8 36 C11 34 16 28 20 20Z" fill="#c9b6ef" opacity="0.85" />
        <path d="M20 20 C27 26 34 30 32 36 C29 34 24 28 20 20Z" fill="#c9b6ef" opacity="0.85" />
        <rect x="19" y="16" width="2" height="14" rx="1" fill="#4a3f66" />
    </svg>
);

const Heart = ({ size = 24, color = '#e05c7a' }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24">
        <path d="M12 21s-7-4.5-9.5-9C.5 8 3 4 7 4c2 0 3.8 1.2 5 3 1.2-1.8 3-3 5-3 4 0 6.5 4 4.5 8-2.5 4.5-9.5 9-9.5 9z" fill={color} />
    </svg>
);

/* ───────────────────────────── Component ───────────────────────────── */

export default function Scene11Boyfriend({
    isActive = true,
    onNext,
    onPrev,
    boyfriendName = 'Deon',
    boyfriendPhoto,
    introText = "Let me introduce you with my special star. He is one of the most important things in my life. When I get up in the morning, I feel so grateful for every second I've been with him.",
    quoteText = "He is the reason I smile again. Life is better when he's in it. The days are more fun, moments are more thoughtful. I love having him in my life. My world feels bigger, my heart feels happier, I think because of him, my world has grown. I love you.",
    notesMessages = [
        { text: 'I love you', who: 'me' },
        { text: 'I love you more', who: 'them' },
        { text: 'I love you most', who: 'me' },
    ],
    monthversaryText = 'Happy 2nd Monthversary, Love',
    framePhoto1,
    frameCaption1 = 'his beautiful face',
    frameCaption2 = 'I could make it a hobby of mine',
    loveDefinition = 'Love is a set of emotions and behaviors characterized by intimacy, passion, and commitment. It involves care, closeness, protectiveness, attraction, and trust.',
    aboutMeTitle = 'About Me :',
    aboutMeText = "Hi, it's me — Deondra's clingy girlfriend. People say I never get tired of hyping up my boyfriend. I faint easily, my MBTI keeps switching, sometimes I'm ESFJ, sometimes I'm just a soft mess ><",
    aboutMePhoto,
    aboutMeName = 'Runa',
}: Scene11BoyfriendProps) {
    const titleRef = useRef<HTMLDivElement>(null);
    const photoRef = useRef<HTMLDivElement>(null);
    const introRef = useRef<HTMLParagraphElement>(null);
    const quoteRef = useRef<HTMLParagraphElement>(null);
    const notesRef = useRef<HTMLDivElement>(null);
    const loveYouRef = useRef<HTMLDivElement>(null);
    const monthRef = useRef<HTMLDivElement>(null);

    const frameRef = useRef<HTMLDivElement>(null);
    const sunRef = useRef<HTMLDivElement>(null);
    const quizRef = useRef<HTMLDivElement>(null);
    const loveDefRef = useRef<HTMLDivElement>(null);
    const aboutRef = useRef<HTMLDivElement>(null);
    const aboutPhotoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isActive) return;
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

        if (photoRef.current) tl.fromTo(photoRef.current, { opacity: 0, scale: 0.85, y: -10 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' }, 0);
        if (titleRef.current) tl.fromTo(titleRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5 }, 0.2);
        if (introRef.current) tl.fromTo(introRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 0.4);
        if (quoteRef.current) tl.fromTo(quoteRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 0.6);
        if (notesRef.current) tl.fromTo(notesRef.current, { opacity: 0, scale: 0.9, rotate: -3 }, { opacity: 1, scale: 1, rotate: -2, duration: 0.5, ease: 'back.out(1.4)' }, 0.8);
        if (loveYouRef.current) tl.fromTo(loveYouRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4 }, 1.0);
        if (monthRef.current) tl.fromTo(monthRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 1.1);

        if (frameRef.current) tl.fromTo(frameRef.current, { opacity: 0, scale: 0.9, rotate: 3 }, { opacity: 1, scale: 1, rotate: 2, duration: 0.6, ease: 'back.out(1.4)' }, 0.2);
        if (sunRef.current) tl.fromTo(sunRef.current, { opacity: 0, scale: 0.5, rotate: -30 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(2)' }, 0.4);
        if (quizRef.current) tl.fromTo(quizRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 0.6);
        if (loveDefRef.current) tl.fromTo(loveDefRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 0.8);
        if (aboutRef.current) tl.fromTo(aboutRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 1.0);
        if (aboutPhotoRef.current) tl.fromTo(aboutPhotoRef.current, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }, 1.1);

        gsap.to(sunRef.current, { rotate: 360, duration: 20, repeat: -1, ease: 'none' });

        return () => { tl.kill(); };
    }, []);

    const photoBox = (
        style: React.CSSProperties,
        src: string | undefined,
        alt: string,
    ) => (
        <div style={{
            width: '100%', height: '100%', borderRadius: 'inherit',
            background: src ? `url(${src}) center/cover no-repeat` : 'linear-gradient(135deg,#e6e0f5,#f5e6ee)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#b0a6c9', fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem',
        }}>
            {!src && alt}
        </div>
    );

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
                {/* ══════════════════ LEFT PAGE ══════════════════ */}
                <div className={`${styles.pageLeft} ${styles.linedPage}`}>
                    <div className={styles.pageContent} style={{ position: 'relative' }}>

                        {/* Photo with warm glow */}
                        <div ref={photoRef} style={{ position: 'absolute', top: '1.6rem', left: '1.4rem', width: '130px', height: '170px' }}>
                            <div style={{ position: 'absolute', inset: '-14px', borderRadius: '16px', background: 'radial-gradient(circle, rgba(255,196,90,0.55), rgba(255,196,90,0))', filter: 'blur(4px)' }} />
                            <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 8px 18px rgba(0,0,0,0.18)' }}>
                                {photoBox({}, boyfriendPhoto, 'photo')}
                            </div>
                            <span style={{ position: 'absolute', top: '-14px', left: '-10px', fontSize: '1.3rem' }}>🧸💗</span>
                            <span style={{ position: 'absolute', bottom: '-18px', left: '2px', fontFamily: 'var(--font-handwriting)', fontSize: '0.85rem', color: '#c9a24a', transform: 'rotate(-6deg)' }}>{boyfriendName}</span>
                        </div>

                        {/* Title */}
                        <div ref={titleRef} style={{
                            position: 'absolute', top: '2.2rem', left: '9.6rem', right: '1.2rem',
                            fontFamily: 'var(--font-handwriting)', fontWeight: 700, fontSize: '2rem',
                            color: '#f0a8c0', WebkitTextStroke: '0.5px #d97ea3',
                        }}>
                            THE Boyfriend
                        </div>

                        {/* Intro */}
                        <p ref={introRef} style={{
                            position: 'absolute', top: '5.4rem', left: '9.6rem', right: '1.2rem',
                            fontFamily: 'var(--font-handwriting)', fontSize: '0.95rem', color: '#333', lineHeight: 1.5,
                        }}>
                            {introText}
                        </p>

                        <div style={{ position: 'absolute', top: '12.5rem', left: '9.6rem' }}>
                            <Flower size={36} />
                        </div>
                        <div style={{ position: 'absolute', top: '11.8rem', left: '11.8rem' }}>
                            <Flower size={26} color="#ffd76b" />
                        </div>

                        {/* Quote */}
                        <p ref={quoteRef} style={{
                            position: 'absolute', top: '13.4rem', left: '1.3rem', width: '13.5rem',
                            fontFamily: 'var(--font-handwriting)', fontSize: '0.92rem', color: '#333', lineHeight: 1.5,
                        }}>
                            &ldquo; {quoteText} &rdquo;
                        </p>

                        {/* Sticky notes card with chat bubbles */}
                        <div ref={notesRef} style={{
                            position: 'absolute', top: '13.5rem', right: '1.2rem', width: '11rem',
                            background: '#f4fbe8', border: '2px solid #cfe0a0', borderRadius: '6px',
                            padding: '0.6rem 0.6rem 0.8rem', boxShadow: '0 6px 14px rgba(0,0,0,0.12)',
                        }}>
                            <div style={{
                                position: 'absolute', top: '-0.6rem', left: '50%', transform: 'translateX(-50%)',
                                background: '#bde0f0', fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem',
                                fontWeight: 700, padding: '0.1rem 0.6rem', borderRadius: '4px', letterSpacing: '1px',
                            }}>NOTES!</div>
                            <div style={{ position: 'absolute', top: '0.4rem', right: '0.5rem' }}><Star size={20} /></div>
                            <div style={{ marginTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                {notesMessages.map((m, i) => (
                                    <div key={i} style={{
                                        alignSelf: m.who === 'me' ? 'flex-end' : 'flex-start',
                                        background: m.who === 'me' ? '#dff3e0' : '#e8e8f2',
                                        borderRadius: '10px', padding: '0.25rem 0.55rem', maxWidth: '85%',
                                        fontFamily: 'system-ui, sans-serif', fontSize: '0.68rem', color: '#333',
                                    }}>
                                        {m.text} {m.who === 'me' ? '🩷' : ''}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* LOVE YOU bubble text */}
                        <div ref={loveYouRef} style={{
                            position: 'absolute', bottom: '5.4rem', left: '1.3rem',
                            fontFamily: 'var(--font-handwriting)', fontWeight: 800, fontSize: '1.8rem',
                            background: 'linear-gradient(90deg,#f66,#fa6,#6c6,#69f,#a6f)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            transform: 'rotate(-3deg)',
                        }}>
                            LOVE YOU
                        </div>

                        {/* Monthversary */}
                        <div ref={monthRef} style={{
                            position: 'absolute', bottom: '2.6rem', left: '1.3rem',
                            fontFamily: 'var(--font-handwriting)', fontSize: '1.15rem', color: '#c23b3b',
                        }}>
                            {monthversaryText}
                        </div>

                        {/* Postit stack */}
                        <div style={{
                            position: 'absolute', bottom: '2.2rem', right: '1.6rem', width: '3.8rem', height: '3rem',
                        }}>
                            <div style={{ position: 'absolute', inset: 0, background: '#f9c9d6', borderRadius: '4px', transform: 'rotate(6deg)', boxShadow: '0 3px 6px rgba(0,0,0,0.15)' }} />
                            <div style={{
                                position: 'absolute', inset: 0, background: '#fce4ec', borderRadius: '4px', transform: 'rotate(-3deg)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                                fontFamily: 'var(--font-handwriting)', fontSize: '0.65rem', color: '#b8567a', boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
                            }}>
                                <span>P.S.</span><span>I ♡ U</span>
                            </div>
                        </div>

                        <div style={{ position: 'absolute', bottom: '9.5rem', right: '2.5rem' }}><Heart size={18} /></div>
                    </div>
                </div>

                {/* ══════════════════ RIGHT PAGE ══════════════════ */}
                <div className={`${styles.dummyPage} ${styles.linedPage}`} style={{ zIndex: 10 }}>
                    <div className={styles.pageContent} style={{ position: 'relative' }}>

                        {/* Photo frame with chat captions */}
                        <div ref={frameRef} style={{
                            position: 'absolute', top: '1.6rem', left: '1.3rem', width: '11rem', height: '6.4rem',
                            background: '#fff', border: '5px solid #d9a8cc', borderRadius: '10px',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.15)', display: 'flex', overflow: 'hidden',
                        }}>
                            <div style={{ width: '45%', height: '100%', borderRadius: '4px', overflow: 'hidden' }}>
                                {photoBox({}, framePhoto1, 'photo')}
                            </div>
                            <div style={{ flex: 1, padding: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', justifyContent: 'center' }}>
                                <div style={{ background: '#f6d7e6', borderRadius: '8px', padding: '0.2rem 0.4rem', fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', color: '#333' }}>{frameCaption1}</div>
                                <div style={{ background: '#e8e8f2', borderRadius: '8px', padding: '0.2rem 0.4rem', fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', color: '#333' }}>{frameCaption2}</div>
                            </div>
                        </div>

                        <div ref={sunRef} style={{ position: 'absolute', top: '1.4rem', right: '2.2rem' }}>
                            <Sun size={60} />
                        </div>

                        {/* Do you love me? quiz doodle */}
                        <div ref={quizRef} style={{ position: 'absolute', top: '2.4rem', right: '0.6rem', width: '9rem', textAlign: 'right' }}>
                            <div style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.15rem', color: '#333', lineHeight: 1.2 }}>
                                Do you love me?
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', marginTop: '0.4rem', alignItems: 'center' }}>
                                <span style={{ fontFamily: 'var(--font-handwriting)', fontSize: '0.85rem' }}>YES</span>
                                <span style={{ width: '14px', height: '14px', border: '2px solid #333', display: 'inline-block' }} />
                                <span style={{ fontFamily: 'var(--font-handwriting)', fontSize: '0.85rem' }}>YES</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', marginTop: '0.2rem', alignItems: 'center' }}>
                                <span style={{ fontFamily: 'var(--font-handwriting)', fontSize: '0.85rem' }}>NO ¬_¬</span>
                                <span style={{ width: '14px', height: '14px', border: '2px solid #333', display: 'inline-block' }} />
                            </div>
                        </div>

                        {/* Love definition */}
                        <div ref={loveDefRef} style={{ position: 'absolute', top: '9rem', left: '1.3rem', right: '1.3rem' }}>
                            <div style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.6rem', color: '#333', textDecoration: 'underline', textDecorationColor: '#f0a8c0' }}>
                                &ldquo;Love&rdquo;
                            </div>
                            <p style={{ fontFamily: 'var(--font-handwriting)', fontSize: '0.92rem', color: '#333', lineHeight: 1.5, marginTop: '0.3rem' }}>
                                {loveDefinition}
                            </p>
                        </div>

                        <div style={{
                            position: 'absolute', top: '9.2rem', right: '0.8rem', background: '#ffe98a',
                            padding: '0.4rem 0.6rem', borderRadius: '3px', transform: 'rotate(-8deg)',
                            fontFamily: 'var(--font-handwriting)', fontSize: '0.85rem', color: '#333',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                        }}>
                            LOVE<br />YOU
                        </div>

                        <div style={{ position: 'absolute', top: '14rem', right: '3.4rem' }}>
                            <Butterfly size={34} />
                        </div>

                        {/* About Me */}
                        <div ref={aboutRef} style={{ position: 'absolute', bottom: '7rem', left: '1.3rem', width: '11.5rem' }}>
                            <div style={{
                                fontFamily: 'var(--font-handwriting)', fontWeight: 700, fontSize: '1.3rem', color: '#8ac93e',
                                background: 'linear-gradient(180deg,#a6e34d,#8ac93e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            }}>
                                {aboutMeTitle}
                            </div>
                            <p style={{ fontFamily: 'var(--font-handwriting)', fontSize: '0.85rem', color: '#333', lineHeight: 1.5, marginTop: '0.3rem' }}>
                                {aboutMeText}
                            </p>
                        </div>

                        {/* About me photo */}
                        <div ref={aboutPhotoRef} style={{
                            position: 'absolute', bottom: '1.4rem', right: '1.2rem', width: '7.6rem', height: '9.2rem',
                            borderRadius: '14px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(150,110,200,0.35)',
                            border: '3px solid #d9c6f0',
                        }}>
                            {photoBox({}, aboutMePhoto, 'photo')}
                            <span style={{ position: 'absolute', bottom: '4px', right: '4px', fontSize: '1.1rem' }}>🧸</span>
                            <span style={{
                                position: 'absolute', top: '6px', left: '6px', fontFamily: 'var(--font-handwriting)',
                                fontSize: '0.9rem', color: '#8ac93e', transform: 'rotate(-4deg)',
                            }}>{aboutMeName}</span>
                            <span style={{
                                position: 'absolute', top: '-16px', right: '4px', fontFamily: 'var(--font-handwriting)',
                                fontSize: '0.85rem', color: '#8ac93e',
                            }}>Hii!</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}