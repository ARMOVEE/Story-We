"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene3CakePageProps {
    onNext: () => void;
    onPrev?: () => void;
}

type Stage = 'reading' | 'place_candle' | 'candle_placed' | 'recording' | 'sending' | 'wish_granted';

const WHATSAPP_NUMBER = '6283120400488';

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

    // Place candle on cake click
    const handleCakeClick = () => {
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
                        { opacity: 0, y: -10 },
                        { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' }
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
                    <button className={styles.navBtn} onClick={onPrev}>
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

            <div className={styles.bookWrapper} ref={pageRef}>
                {/* ── LEFT PAGE ── */}
                <div className={`${styles.pageLeft} ${styles.linedPage}`}>
                    <div className={styles.pageContent} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <div ref={textBlockRef} style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.3rem', color: '#444', lineHeight: 1.9, textAlign: 'center' }}>
                            <div>Selamat Ulang Tahun</div>
                            <div style={{ color: '#e74c3c', fontSize: '1.6rem', fontWeight: 'bold' }}>Sayang! 🎂</div>
                            <div style={{ marginTop: '1rem', fontSize: '1rem', color: '#777' }}>Tiup lilinnya,</div>
                            <div style={{ fontSize: '1rem', color: '#777' }}>dan bisikkan doamu...</div>
                        </div>

                        {/* Decorative stars */}
                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem' }}>
                            {['⭐', '✨', '🌟', '💫', '✨'].map((s, i) => (
                                <span key={i} style={{ fontSize: '1.4rem', animation: `pulse ${1 + i * 0.2}s ease-in-out infinite alternate` }}>{s}</span>
                            ))}
                        </div>

                        <style>{`
                            @keyframes pulse { from { opacity: 0.4; transform: scale(0.9); } to { opacity: 1; transform: scale(1.1); } }
                            @keyframes flicker { 0%,100%{opacity:1;} 50%{opacity:0.7;} }
                        `}</style>
                    </div>
                </div>

                {/* ── RIGHT PAGE ── */}
                <div className={`${styles.page} ${styles.linedPage}`}>
                    <div className={styles.pageContent} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem' }}>

                        {/* Cake illustration */}
                        <div ref={cakeRef} onClick={handleCakeClick} style={{ cursor: stage === 'reading' || stage === 'place_candle' ? 'pointer' : 'default', userSelect: 'none' }}>
                            <svg width="140" height="160" viewBox="0 0 140 160">
                                {/* Candle (shows after click) */}
                                {candlePlaced && (
                                    <g>
                                        <rect x="63" y="20" width="14" height="36" fill="#f39c12" rx="2" />
                                        {!flameOut && (
                                            <ellipse cx="70" cy="18" rx="6" ry="10" fill="#f1c40f" style={{ animation: 'flicker 0.3s ease-in-out infinite' }} />
                                        )}
                                        {flameOut && <text x="64" y="20" fontSize="12">💨</text>}
                                    </g>
                                )}
                                {/* Cake body */}
                                <rect x="20" y="56" width="100" height="40" fill="#f8d7da" rx="4" stroke="#e74c3c" strokeWidth="2" />
                                <rect x="15" y="96" width="110" height="50" fill="#fff0f0" rx="4" stroke="#e74c3c" strokeWidth="2" />
                                {/* Frosting */}
                                <path d="M20,56 Q30,48 40,56 Q50,48 60,56 Q70,48 80,56 Q90,48 100,56 Q110,48 120,56" fill="none" stroke="#e74c3c" strokeWidth="2.5" />
                                {/* Decorations */}
                                {[30, 50, 70, 90, 110].map((x, i) => (
                                    <circle key={i} cx={x} cy="116" r="4" fill={['#e74c3c','#f39c12','#2ecc71','#3498db','#9b59b6'][i]} />
                                ))}
                                {/* Hint text */}
                                {!candlePlaced && (
                                    <text x="70" y="148" textAnchor="middle" fontSize="10" fill="#aaa" fontFamily="serif">tap cake!</text>
                                )}
                            </svg>
                        </div>

                        {/* Hint text */}
                        <div ref={hintRef} style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1rem', color: '#aaa', textAlign: 'center' }}>
                            👆 ketuk kuenya dulu!
                        </div>

                        {/* After candle placed: recording flow */}
                        {stage === 'candle_placed' && (
                            <button onClick={startRecording} style={{
                                fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem',
                                background: '#e74c3c', color: '#fff',
                                border: 'none', borderRadius: '20px', padding: '8px 20px',
                                cursor: 'pointer', boxShadow: '0 2px 8px rgba(231,76,60,0.4)'
                            }}>
                                🎙️ Rekam Doamu
                            </button>
                        )}

                        {stage === 'recording' && (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ color: '#e74c3c', fontFamily: 'var(--font-handwriting)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                                    🔴 Merekam... {fmtSecs(recordSecs)}
                                </div>
                                <button onClick={stopRecording} style={{
                                    fontFamily: 'var(--font-handwriting)', fontSize: '1rem',
                                    background: '#333', color: '#fff',
                                    border: 'none', borderRadius: '20px', padding: '6px 16px',
                                    cursor: 'pointer'
                                }}>
                                    ⏹ Stop
                                </button>
                            </div>
                        )}

                        {audioBlob && stage !== 'sending' && stage !== 'wish_granted' && (
                            <button onClick={sendToDatabase} style={{
                                fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem',
                                background: '#27ae60', color: '#fff',
                                border: 'none', borderRadius: '20px', padding: '8px 20px',
                                cursor: 'pointer', boxShadow: '0 2px 8px rgba(39,174,96,0.4)'
                            }}>
                                🕯️ Tiup & Kirim Doa
                            </button>
                        )}

                        {stage === 'sending' && (
                            <div style={{ fontFamily: 'var(--font-handwriting)', color: '#888', fontSize: '1rem' }}>
                                Mengirim doa... ✨
                            </div>
                        )}

                        {stage === 'wish_granted' && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
                                <div ref={wishTextRef} style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.2rem', color: '#c0392b', textAlign: 'center', lineHeight: 1.8 }}>
                                    <div>Semoga doamu terkabul,</div>
                                    <div>sayang! 🌸</div>
                                </div>
                                <button onClick={onNext} style={{
                                    fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem',
                                    background: 'none', border: '2px solid #e74c3c', color: '#e74c3c',
                                    borderRadius: '20px', padding: '6px 18px', cursor: 'pointer'
                                }}>
                                    Lanjutkan →
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}
