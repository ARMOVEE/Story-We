"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene3CakePageProps {
    onNext: () => void;
    onPrev?: () => void;
}

type Stage = 'reading' | 'place_candle' | 'candle_placed' | 'recording' | 'sending' | 'wish_granted';

const MAX_CANDLES = 3;
// Ukuran logis .html-cake sebelum di-scale lewat CSS transform (lihat style di bawah)
const CAKE_LOGICAL_WIDTH = 250;

// Batas area kue tempat lilin boleh ditaruh, biar lilin selalu keliatan
// nempel wajar di atas kue (nggak nyasar ke tepi/luar kue).
const CANDLE_AREA = { minX: 25, maxX: 225, minY: 5, maxY: 70 };

interface CandlePos { x: number; y: number; }

interface AnimatedActionButtonProps {
    label: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    /** Warna aksen tombol — dipakai untuk background pill & warna teks saat overlay putihnya keliatan */
    accentColor: string;
    disabled?: boolean;
}

// Tombol dengan efek "btn-53": overlay putih nutupin tombol dalam kondisi
// normal, lalu meleleh turun (translateY 100%) pas di-hover, membuka
// background warna aksen dengan label yang muncul huruf per huruf secara
// bergelombang (naik-turun berselang-seling, dengan delay bertahap).
function AnimatedActionButton({ label, onClick, icon, accentColor, disabled }: AnimatedActionButtonProps) {
    return (
        <button
            type="button"
            className="btn-53"
            onClick={onClick}
            disabled={disabled}
            style={{ ['--btn53-accent' as string]: accentColor } as React.CSSProperties}
        >
            <div className="original">
                {icon}
                <span style={{ marginLeft: icon ? '8px' : 0 }}>{label}</span>
            </div>
            <div className="letters">
                {Array.from(label).map((ch, i) => (
                    <span key={i} style={{ transitionDelay: `${i * 0.04}s` }}>
                        {ch === ' ' ? '\u00A0' : ch}
                    </span>
                ))}
            </div>
        </button>
    );
}

export default function Scene3CakePage({ onNext, onPrev }: Scene3CakePageProps) {
    const pageRef = useRef<HTMLDivElement>(null);
    const textBlockRef = useRef<HTMLDivElement>(null);
    const cakeRef = useRef<HTMLDivElement>(null);
    const wishTextRef = useRef<HTMLDivElement>(null);
    const hintRef = useRef<HTMLDivElement>(null);

    const [stage, setStage] = useState<Stage>('reading');
    // Setiap klik nambah satu posisi lilin baru, sesuai titik klik kursor.
    const [candlePositions, setCandlePositions] = useState<CandlePos[]>([]);
    const [flameOut, setFlameOut] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [recordSecs, setRecordSecs] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const candlePlaced = candlePositions.length > 0;
    const allCandlesPlaced = candlePositions.length >= MAX_CANDLES;

    // Animate text in on mount
    useEffect(() => {
        const tl = gsap.timeline();
        if (textBlockRef.current) {
            tl.fromTo(textBlockRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' }, 0.3);
        }
        if (cakeRef.current) {
            tl.fromTo(cakeRef.current,
                { opacity: 0, scale: 0.7 },
                { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.5)' }, 1.0);
        }
        if (hintRef.current) {
            tl.fromTo(hintRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.6 }, 1.5);
        }
        return () => { tl.kill(); };
    }, []);

    // Taruh satu lilin di titik klik kursor. Klik pertama, kedua, ketiga
    // masing-masing nambah satu lilin baru — bukan langsung muncul 3 sekaligus.
    const handleCakeClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (stage !== 'reading' && stage !== 'place_candle') return;
        if (allCandlesPlaced) return;

        const rect = e.currentTarget.getBoundingClientRect();
        // .html-cake di-scale lewat CSS transform (scale(0.9)), jadi konversi
        // koordinat klik (visual, sudah ke-scale) balik ke koordinat logis 250px
        // supaya posisi lilin akurat menempel di titik yang benar-benar diklik.
        const scale = rect.width / CAKE_LOGICAL_WIDTH;
        const rawX = (e.clientX - rect.left) / scale;
        const rawY = (e.clientY - rect.top) / scale;

        const x = Math.min(Math.max(rawX, CANDLE_AREA.minX), CANDLE_AREA.maxX);
        const y = Math.min(Math.max(rawY, CANDLE_AREA.minY), CANDLE_AREA.maxY);

        setCandlePositions(prev => {
            const next = [...prev, { x, y }];
            if (next.length >= MAX_CANDLES) {
                setStage('candle_placed');
                if (hintRef.current) {
                    gsap.to(hintRef.current, { opacity: 0, duration: 0.3 });
                }
            } else {
                setStage('place_candle');
            }
            return next;
        });
    };

    // Start recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mr = new MediaRecorder(stream);
            mediaRecorderRef.current = mr;
            chunksRef.current = [];
            mr.ondataavailable = (e) => chunksRef.current.push(e.data);
            mr.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                stream.getTracks().forEach(t => t.stop());
            };
            mr.start();
            setIsRecording(true);
            setStage('recording');
            setRecordSecs(0);
            timerRef.current = setInterval(() => setRecordSecs(s => s + 1), 1000);
        } catch {
            alert('Izinkan akses mikrofon untuk merekam doa kamu 🙏');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    // Save Audio to Database/Server
    const sendToDatabase = async () => {
        setStage('sending');

        if (audioBlob) {
            try {
                const formData = new FormData();
                formData.append('audio', audioBlob, 'doa-harapan.webm');

                const res = await fetch('/api/upload-audio', {
                    method: 'POST',
                    body: formData,
                });

                if (!res.ok) {
                    console.error('Failed to upload audio');
                }
            } catch (err) {
                console.error('Error uploading audio', err);
            }
        }

        // Blow candle out + show wish text
        setTimeout(() => {
            setFlameOut(true);
            setTimeout(() => {
                setStage('wish_granted');
                if (wishTextRef.current) {
                    gsap.fromTo(wishTextRef.current,
                        { opacity: 0, scale: 0.8 },
                        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)' }
                    );
                }
            }, 800);
        }, 1500);
    };

    const fmtSecs = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

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
                        <p className={styles.navBtnText}>Go Back</p>
                    </button>
                </div>
            )}

            {/* Next Button only shows when wish is granted */}
            {stage === 'wish_granted' && (
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

            <div className={styles.bookWrapper} ref={pageRef}>
                {/* ── LEFT PAGE ── */}
                <div className={`${styles.pageLeft} ${styles.linedPage}`}>
                    <div className={styles.pageContent} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999', marginBottom: '2rem' }}>
                            Date:
                        </div>
                        <div ref={textBlockRef} style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.3rem', color: '#444', lineHeight: 2.2, paddingLeft: '1rem' }}>
                            <div style={{ marginBottom: '1rem' }}>Make a wish sayang</div>
                            <div style={{ marginBottom: '1rem' }}>Semoga segala doa dan<br />harapan kamu terkabul<br />ditahun ini ya sayang</div>
                            <div>Aamiinn ....</div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PAGE ── */}
                <div className={`${styles.page} ${styles.linedPage}`}>
                    <div className={styles.pageContent} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem', position: 'relative' }}>

                        {/* Top granted wish text area (hidden until the end) */}
                        <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', zIndex: 50 }}>
                            {stage === 'wish_granted' && (
                                <div ref={wishTextRef} style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.4rem', color: '#e74c3c', textAlign: 'center', fontWeight: 'bold' }}>
                                    semoga doa kamu terkabul sayang
                                </div>
                            )}
                        </div>

                        {/* Cake illustration area */}
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative', height: '220px' }}>

                            <div
                                className="html-cake"
                                ref={cakeRef}
                                onClick={handleCakeClick}
                                style={{
                                    cursor: (stage === 'reading' || stage === 'place_candle') && !allCandlesPlaced ? 'pointer' : 'default',
                                    userSelect: 'none'
                                }}
                            >
                                <div className="plate"></div>
                                <div className="layer layer-bottom"></div>
                                <div className="layer layer-middle"></div>
                                <div className="layer layer-top"></div>
                                <div className="icing"></div>
                                <div className="drip drip1"></div>
                                <div className="drip drip2"></div>
                                <div className="drip drip3"></div>

                                {/* Lilin ditaruh satu-satu, persis di titik klik kursor */}
                                {candlePositions.map((pos, i) => (
                                    <div
                                        key={i}
                                        className={`candle ${flameOut ? 'out' : ''}`}
                                        style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
                                    >
                                        <div className="flame"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hint text — nunjukin progress berapa lilin yang udah ditaruh */}
                        {!allCandlesPlaced && (
                            <div ref={hintRef} style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#888', textAlign: 'center', marginTop: '1rem', animation: 'pulse 2s infinite' }}>
                                {candlePlaced
                                    ? `👆 Pencet lagi buat taruh lilin (${candlePositions.length}/${MAX_CANDLES})`
                                    : `👆 Pencet kuenya untuk taruh lilin! (0/${MAX_CANDLES})`}
                            </div>
                        )}

                        {/* After candle placed: recording flow */}
                        <div style={{ minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%', zIndex: 100 }}>
                            {stage === 'candle_placed' && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1rem', color: '#777' }}>
                                        Klik untuk ucapkan doa
                                    </div>
                                    <AnimatedActionButton
                                        onClick={startRecording}
                                        accentColor="#00a884"
                                        label="Rekam Audio"
                                        icon={
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                                <line x1="12" y1="19" x2="12" y2="22"></line>
                                            </svg>
                                        }
                                    />
                                </div>
                            )}

                            {stage === 'recording' && (
                                <div style={{ textAlign: 'center', width: '100%' }}>
                                    <div style={{ color: '#e74c3c', fontFamily: 'var(--font-handwriting)', fontSize: '1.2rem', marginBottom: '0.5rem', animation: 'flicker 1s infinite' }}>
                                        🔴 Merekam... {fmtSecs(recordSecs)}
                                    </div>
                                    <AnimatedActionButton
                                        onClick={stopRecording}
                                        accentColor="#e74c3c"
                                        label="Selesai"
                                        icon={<span style={{ fontSize: '1rem' }}>⏹</span>}
                                    />
                                </div>
                            )}

                            {audioBlob && stage !== 'sending' && stage !== 'wish_granted' && (
                                <AnimatedActionButton
                                    onClick={sendToDatabase}
                                    accentColor="#27ae60"
                                    label="Kirimkan harapan mu"
                                    icon={
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="22" y1="2" x2="11" y2="13"></line>
                                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                        </svg>
                                    }
                                />
                            )}

                            {stage === 'sending' && (
                                <div style={{ fontFamily: 'var(--font-handwriting)', color: '#888', fontSize: '1.1rem' }}>
                                    Mengirimkan doa... ✨
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* CSS styles for the HTML Cake directly in component */}
            <style>{`
                .html-cake {
                    position: relative;
                    width: 250px;
                    height: 180px;
                    margin: 0 auto;
                    transform: scale(0.9);
                    transform-origin: center bottom;
                }
                .plate {
                    width: 270px;
                    height: 110px;
                    position: absolute;
                    bottom: -30px;
                    left: -10px;
                    background-color: #ccc;
                    border-radius: 50%;
                    box-shadow: 0 2px 0 #b3b3b3, 0 4px 0 #b3b3b3, 0 5px 40px rgba(0, 0, 0, 0.5);
                }
                .html-cake > * {
                    position: absolute;
                }
                .layer {
                    position: absolute;
                    display: block;
                    width: 250px;
                    height: 100px;
                    border-radius: 50%;
                    background-color: #ffc2d1;
                    box-shadow: 0 2px 0px #fb6f92, 0 4px 0px #ff8fab, 0 6px 0px #ff8fab, 0 8px 0px #ff8fab, 0 10px 0px #ff8fab, 0 12px 0px #ff8fab, 0 14px 0px #ff8fab, 0 16px 0px #ff8fab, 0 18px 0px #ff8fab, 0 20px 0px #ff8fab, 0 22px 0px #ff8fab, 0 24px 0px #ff8fab, 0 26px 0px #ff8fab, 0 28px 0px #ff8fab, 0 30px 0px #ff8fab;
                }
                .layer-top { top: 0px; }
                .layer-middle { top: 33px; }
                .layer-bottom { top: 66px; }

                .icing {
                    top: 2px;
                    left: 5px;
                    background-color: #f0e4d0;
                    width: 240px;
                    height: 90px;
                    border-radius: 50%;
                }
                .icing:before {
                    content: "";
                    position: absolute;
                    top: 4px;
                    right: 5px;
                    bottom: 6px;
                    left: 5px;
                    background-color: #f4ebdc;
                    box-shadow: 0 0 4px #f6efe3, 0 0 4px #f6efe3, 0 0 4px #f6efe3;
                    border-radius: 50%;
                    z-index: 1;
                }

                .drip {
                    display: block;
                    width: 50px;
                    height: 60px;
                    border-bottom-left-radius: 25px;
                    border-bottom-right-radius: 25px;
                    background-color: #f0e4d0; 
                }
                .drip1 { top: 53px; left: 5px; transform: skewY(15deg); height: 48px; width: 40px; }
                .drip2 { top: 69px; left: 181px; transform: skewY(-15deg); }
                .drip3 { top: 54px; left: 90px; width: 80px; border-bottom-left-radius: 40px; border-bottom-right-radius: 40px; }

                .candle {
                    background-color: #7B020B;
                    width: 12px;
                    height: 35px;
                    border-radius: 6px/3px;
                    z-index: 10;
                    position: absolute;
                    transform: translate(-50%, -100%);
                }
                .candle:before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 12px;
                    height: 6px;
                    border-radius: 50%;
                    background-color: #ad030f;
                }
                .candle.out .flame { display: none; }

                .flame {
                    position: absolute;
                    background-color: orange;
                    width: 10px;
                    height: 25px;
                    border-radius: 8px 8px 8px 8px/20px 20px 8px 8px;
                    top: -34px;
                    left: 50%;
                    margin-left: -5px;
                    z-index: 10;
                    box-shadow: 0 0 10px rgba(255, 165, 0, 0.5), 0 0 20px rgba(255, 165, 0, 0.5), 0 0 60px rgba(255, 165, 0, 0.5), 0 0 80px rgba(255, 165, 0, 0.5);
                    transform-origin: 50% 90%;
                    animation: flicker 1s ease-in-out alternate infinite;
                }

                @keyframes flicker {
                    0% { transform: skewX(5deg); box-shadow: 0 0 10px rgba(255, 165, 0, 0.2), 0 0 20px rgba(255, 165, 0, 0.2); }
                    25% { transform: skewX(-5deg); box-shadow: 0 0 10px rgba(255, 165, 0, 0.5), 0 0 20px rgba(255, 165, 0, 0.5); }
                    50% { transform: skewX(10deg); box-shadow: 0 0 10px rgba(255, 165, 0, 0.3), 0 0 20px rgba(255, 165, 0, 0.3); }
                    75% { transform: skewX(-10deg); box-shadow: 0 0 10px rgba(255, 165, 0, 0.4), 0 0 20px rgba(255, 165, 0, 0.4); }
                    100% { transform: skewX(5deg); box-shadow: 0 0 10px rgba(255, 165, 0, 0.5), 0 0 20px rgba(255, 165, 0, 0.5); }
                }

                @keyframes pulse { 
                    0% { transform: scale(1); opacity: 0.7; }
                    50% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(1); opacity: 0.7; }
                }

                /* ── Animated action button (efek btn-53) ── */
                .btn-53,
                .btn-53 *,
                .btn-53 :after,
                .btn-53 :before,
                .btn-53:after,
                .btn-53:before {
                    border: 0 solid;
                    box-sizing: border-box;
                }

                .btn-53 {
                    -webkit-tap-highlight-color: transparent;
                    -webkit-appearance: button;
                    background-color: var(--btn53-accent, #000);
                    background-image: none;
                    color: #fff;
                    cursor: pointer;
                    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
                        "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
                        "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
                    font-size: 1rem;
                    line-height: 1.5;
                    margin: 0;
                    -webkit-mask-image: -webkit-radial-gradient(#000, #fff);
                    padding: 0;
                    border: 1px solid var(--btn53-accent, #000);
                    border-radius: 999px;
                    display: inline-block;
                    font-weight: 900;
                    overflow: hidden;
                    text-transform: uppercase;
                    position: relative;
                }

                .btn-53:disabled {
                    cursor: default;
                    opacity: 0.6;
                }

                .btn-53 svg {
                    display: block;
                    vertical-align: middle;
                }

                .btn-53 .original {
                    background: #fff;
                    color: var(--btn53-accent, #000);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    inset: 0;
                    position: absolute;
                    padding: 0.7rem 1.6rem;
                    white-space: nowrap;
                    transition: transform 0.2s cubic-bezier(0.87, 0, 0.13, 1);
                }

                .btn-53:hover .original {
                    transform: translateY(100%);
                }

                .btn-53 .letters {
                    display: inline-flex;
                    padding: 0.7rem 1.6rem;
                    white-space: nowrap;
                }

                .btn-53 span {
                    opacity: 0;
                    transform: translateY(-15px);
                    transition: transform 0.2s cubic-bezier(0.87, 0, 0.13, 1), opacity 0.2s;
                }

                .btn-53 span:nth-child(2n) {
                    transform: translateY(15px);
                }

                .btn-53:hover span {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>
        </>
    );
}