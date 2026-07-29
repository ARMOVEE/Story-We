"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene3CakePageProps {
    onNext: () => void;
    onPrev?: () => void;
}

type Stage = 'reading' | 'place_candle' | 'candle_placed' | 'recording' | 'sending' | 'wish_granted';

export default function Scene3CakePage({ onNext, onPrev }: Scene3CakePageProps) {
    const pageRef           = useRef<HTMLDivElement>(null);
    const textBlockRef      = useRef<HTMLDivElement>(null);
    const cakeRef           = useRef<HTMLDivElement>(null);
    const wishTextRef       = useRef<HTMLDivElement>(null);
    const hintRef           = useRef<HTMLDivElement>(null);

    const [stage, setStage]               = useState<Stage>('reading');
    const [candlePlaced, setCandlePlaced] = useState(false);
    const [flameOut, setFlameOut]         = useState(false);
    const [isRecording, setIsRecording]   = useState(false);
    const [audioBlob, setAudioBlob]       = useState<Blob | null>(null);
    const [recordSecs, setRecordSecs]     = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef        = useRef<BlobPart[]>([]);
    const timerRef         = useRef<ReturnType<typeof setInterval> | null>(null);

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

    // Place candles on cake click
    const handleCakeClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (stage !== 'reading' && stage !== 'place_candle') return;
        
        setCandlePlaced(true);
        setStage('candle_placed');
        
        if (hintRef.current) {
            gsap.to(hintRef.current, { opacity: 0, duration: 0.3 });
        }
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
                            <div style={{ marginBottom: '1rem' }}>Semoga segala doa dan<br/>harapan kamu terkabul<br/>ditahun ini ya sayang</div>
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
                                    cursor: stage === 'reading' || stage === 'place_candle' ? 'pointer' : 'default', 
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
                                
                                {candlePlaced && (
                                    <>
                                        {/* Candle 1 (Left) */}
                                        <div className={`candle ${flameOut ? 'out' : ''}`} style={{ left: '80px', top: '15px' }}>
                                            <div className="flame"></div>
                                        </div>
                                        {/* Candle 2 (Center) */}
                                        <div className={`candle ${flameOut ? 'out' : ''}`} style={{ left: '125px', top: '35px' }}>
                                            <div className="flame"></div>
                                        </div>
                                        {/* Candle 3 (Right) */}
                                        <div className={`candle ${flameOut ? 'out' : ''}`} style={{ left: '170px', top: '15px' }}>
                                            <div className="flame"></div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Hint text */}
                        {!candlePlaced && (
                            <div ref={hintRef} style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#888', textAlign: 'center', marginTop: '1rem', animation: 'pulse 2s infinite' }}>
                                👆 Pencet kuenya untuk taruh lilin!
                            </div>
                        )}

                        {/* After candle placed: recording flow */}
                        <div style={{ minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%', zIndex: 100 }}>
                            {stage === 'candle_placed' && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1rem', color: '#777' }}>
                                        Klik untuk ucapkan doa
                                    </div>
                                    <button onClick={startRecording} style={{
                                        fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem',
                                        background: '#00a884', color: '#fff',
                                        border: 'none', borderRadius: '25px', padding: '10px 24px',
                                        cursor: 'pointer', boxShadow: '0 4px 10px rgba(0, 168, 132, 0.4)',
                                        display: 'flex', alignItems: 'center', gap: '8px'
                                    }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                            <line x1="12" y1="19" x2="12" y2="22"></line>
                                        </svg>
                                        Rekam Audio
                                    </button>
                                </div>
                            )}

                            {stage === 'recording' && (
                                <div style={{ textAlign: 'center', width: '100%' }}>
                                    <div style={{ color: '#e74c3c', fontFamily: 'var(--font-handwriting)', fontSize: '1.2rem', marginBottom: '0.5rem', animation: 'flicker 1s infinite' }}>
                                        🔴 Merekam... {fmtSecs(recordSecs)}
                                    </div>
                                    <button onClick={stopRecording} style={{
                                        fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem',
                                        background: '#e74c3c', color: '#fff',
                                        border: 'none', borderRadius: '25px', padding: '8px 24px',
                                        cursor: 'pointer', boxShadow: '0 4px 10px rgba(231, 76, 60, 0.4)'
                                    }}>
                                        ⏹ Selesai
                                    </button>
                                </div>
                            )}

                            {audioBlob && stage !== 'sending' && stage !== 'wish_granted' && (
                                <button onClick={sendToDatabase} style={{
                                    fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem',
                                    background: '#27ae60', color: '#fff',
                                    border: 'none', borderRadius: '25px', padding: '10px 24px',
                                    cursor: 'pointer', boxShadow: '0 4px 10px rgba(39, 174, 96, 0.4)',
                                    display: 'flex', alignItems: 'center', gap: '8px'
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                    Kirimkan harapan mu
                                </button>
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
            `}</style>
        </>
    );
}
