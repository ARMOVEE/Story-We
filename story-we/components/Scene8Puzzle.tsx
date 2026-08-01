"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from '../styles/book.module.css';

interface Scene8PuzzleProps {
    onNext?: () => void;
    onPrev?: () => void;
}

type WordId = 'REVA' | 'FOREVER';
type Cell = [number, number];
type ForeverDirection = 'main' | 'anti';

const GRID_SIZE = 7;
const MAX_WRONG_ATTEMPTS = 3;

// ── Ukuran & posisi grid dalam SVG overlay (dipakai untuk hitung ulang garis) ──
// SVG overlay: width 300, height 310, offset top:-10px left:-25px dari grid 250x277.
const COL_W = 250 / GRID_SIZE;
const ROW_H = 41; // 31px huruf + 10px gap
function colX(c: number) { return 25 + (c + 0.5) * COL_W; }
function rowY(r: number) { return 10 + r * ROW_H + 15.5; }

function cellsEqual(a: Cell, b: Cell) {
    return a[0] === b[0] && a[1] === b[1];
}

function pathMatches(selected: Cell[], target: Cell[]) {
    if (selected.length !== target.length) return false;
    const forward = selected.every((cell, i) => cellsEqual(cell, target[i]));
    const backward = selected.every((cell, i) => cellsEqual(cell, target[target.length - 1 - i]));
    return forward || backward;
}

function randomLetter() {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

function buildForeverPath(direction: ForeverDirection): Cell[] {
    return Array.from({ length: GRID_SIZE }, (_, i) =>
        direction === 'main' ? [i, i] : [i, GRID_SIZE - 1 - i]
    ) as Cell[];
}

function buildRevaPath(col: number, rowStart: number): Cell[] {
    return [[rowStart, col], [rowStart + 1, col], [rowStart + 2, col], [rowStart + 3, col]];
}

// Pilih posisi acak baru untuk REVA (vertikal) & FOREVER (diagonal),
// dijamin nggak numpuk konflik huruf di titik potongnya.
function pickRandomPositions(): { revaCol: number; revaRow: number; foreverDir: ForeverDirection } {
    let attempts = 0;
    while (attempts < 50) {
        attempts++;
        const foreverDir: ForeverDirection = Math.random() < 0.5 ? 'main' : 'anti';
        const revaCol = Math.floor(Math.random() * GRID_SIZE);
        const revaRow = Math.floor(Math.random() * (GRID_SIZE - 3)); // rows 0..3, so +3 stays in bounds

        // Baris di diagonal yang kolomnya sama dengan revaCol:
        // main: row === revaCol.  anti: row === (GRID_SIZE-1-revaCol)
        const conflictRow = foreverDir === 'main' ? revaCol : GRID_SIZE - 1 - revaCol;
        const overlaps = conflictRow >= revaRow && conflictRow <= revaRow + 3;
        if (!overlaps) {
            return { revaCol, revaRow, foreverDir };
        }
    }
    // fallback aman kalau somehow gagal 50x (harusnya nggak pernah kepakai)
    return { revaCol: 0, revaRow: 0, foreverDir: 'anti' };
}

function generateGrid(revaPath: Cell[], foreverPath: Cell[]): string[][] {
    const g: string[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(''));

    'FOREVER'.split('').forEach((letter, i) => {
        const [r, c] = foreverPath[i];
        g[r][c] = letter;
    });
    'REVA'.split('').forEach((letter, i) => {
        const [r, c] = revaPath[i];
        g[r][c] = letter;
    });

    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (!g[r][c]) g[r][c] = randomLetter();
        }
    }
    return g;
}

// Oval biru vertikal yang pas membungkus REVA di posisi manapun
function buildRevaOvalPath(col: number, rowStart: number): string {
    const cx = colX(col);
    const topY = rowY(rowStart) - 24;
    const botY = rowY(rowStart + 3) + 24;
    const halfW = 22;
    return `M ${cx.toFixed(1)} ${topY.toFixed(1)} `
        + `C ${(cx - halfW).toFixed(1)} ${(topY + 4).toFixed(1)}, ${(cx - halfW).toFixed(1)} ${(botY - 4).toFixed(1)}, ${cx.toFixed(1)} ${botY.toFixed(1)} `
        + `C ${(cx + halfW).toFixed(1)} ${(botY - 4).toFixed(1)}, ${(cx + halfW).toFixed(1)} ${(topY + 4).toFixed(1)}, ${cx.toFixed(1)} ${topY.toFixed(1)} Z`;
}

// Oval merah diagonal (dibangun sebagai ellipse-path berputar) yang pas
// membungkus FOREVER, arah main (kiri-atas→kanan-bawah) atau anti (kanan-atas→kiri-bawah)
function buildForeverOvalPath(direction: ForeverDirection): string {
    const start = direction === 'main' ? { r: 0, c: 0 } : { r: 0, c: GRID_SIZE - 1 };
    const end = direction === 'main' ? { r: GRID_SIZE - 1, c: GRID_SIZE - 1 } : { r: GRID_SIZE - 1, c: 0 };
    const x1 = colX(start.c), y1 = rowY(start.r);
    const x2 = colX(end.c), y2 = rowY(end.r);
    const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
    const dx = x2 - x1, dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
    const rx = length / 2 + 20;
    const ry = 17;
    const rad = (angleDeg * Math.PI) / 180;
    const p1x = cx + rx * Math.cos(rad), p1y = cy + rx * Math.sin(rad);
    const p2x = cx - rx * Math.cos(rad), p2y = cy - rx * Math.sin(rad);
    return `M ${p1x.toFixed(1)} ${p1y.toFixed(1)} A ${rx.toFixed(1)} ${ry} ${angleDeg.toFixed(1)} 1 1 ${p2x.toFixed(1)} ${p2y.toFixed(1)} `
        + `A ${rx.toFixed(1)} ${ry} ${angleDeg.toFixed(1)} 1 1 ${p1x.toFixed(1)} ${p1y.toFixed(1)} Z`;
}

export default function Scene8Puzzle({ onNext, onPrev }: Scene8PuzzleProps) {
    const pageRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const revaPathRef = useRef<SVGPathElement>(null);
    const foreverPathRef = useRef<SVGPathElement>(null);
    const borderPathRef = useRef<SVGPathElement>(null);
    const animatedWordsRef = useRef<Set<string>>(new Set());
    const wrongFlashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [gameStarted, setGameStarted] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [selection, setSelection] = useState<Cell[]>([]);
    const [foundWords, setFoundWords] = useState<Set<WordId>>(new Set());
    const [gaveUp, setGaveUp] = useState(false);
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [showWrongFlash, setShowWrongFlash] = useState(false);
    const [justReshuffled, setJustReshuffled] = useState(false);

    // Posisi REVA & FOREVER + grid — semua di-generate ulang setiap kali diacak
    const [positions, setPositions] = useState(() => pickRandomPositions());
    const revaPath = buildRevaPath(positions.revaCol, positions.revaRow);
    const foreverPath = buildForeverPath(positions.foreverDir);
    const [grid, setGrid] = useState<string[][]>(() => generateGrid(revaPath, foreverPath));

    const puzzleSolved = foundWords.has('REVA') && foundWords.has('FOREVER');

    useEffect(() => {
        const tl = gsap.timeline();

        if (textRef.current) {
            tl.fromTo(textRef.current.children,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out' },
                0.2
            );
        }

        if (gridRef.current) {
            tl.fromTo(gridRef.current.children,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.5, stagger: 0.02, ease: 'back.out(1.5)' },
                1.0
            );
        }

        return () => { tl.kill(); };
    }, []);

    // Animasi tiap garis SECARA TERPISAH — hanya muncul kalau kata itu sendiri ketemu.
    // Tidak ada lagi toggle opacity di satu container bersama, jadi REVA ketemu
    // tidak lagi otomatis menampakkan garis FOREVER.
    useEffect(() => {
        if (foundWords.has('REVA') && !animatedWordsRef.current.has('REVA') && revaPathRef.current) {
            animatedWordsRef.current.add('REVA');
            const len = revaPathRef.current.getTotalLength();
            gsap.set(revaPathRef.current, { opacity: 1, strokeDasharray: len, strokeDashoffset: len });
            gsap.to(revaPathRef.current, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' });
        }

        if (foundWords.has('FOREVER') && !animatedWordsRef.current.has('FOREVER') && foreverPathRef.current) {
            animatedWordsRef.current.add('FOREVER');
            const len = foreverPathRef.current.getTotalLength();
            gsap.set(foreverPathRef.current, { opacity: 1, strokeDasharray: len, strokeDashoffset: len });
            gsap.to(foreverPathRef.current, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' });
        }

        if (puzzleSolved && borderPathRef.current && !animatedWordsRef.current.has('BORDER')) {
            animatedWordsRef.current.add('BORDER');
            const len = borderPathRef.current.getTotalLength();
            gsap.set(borderPathRef.current, { opacity: 1, strokeDasharray: len, strokeDashoffset: len });
            gsap.to(borderPathRef.current, { strokeDashoffset: 0, duration: 1.2, delay: 0.3, ease: 'power2.inOut' });
        }
    }, [foundWords, puzzleSolved]);

    const reshuffleEverything = () => {
        // 3x salah: acak ULANG posisi REVA & FOREVER (bukan cuma huruf pengecoh),
        // reset progress supaya konsisten dengan posisi/garis yang baru.
        const newPositions = pickRandomPositions();
        const newReva = buildRevaPath(newPositions.revaCol, newPositions.revaRow);
        const newForever = buildForeverPath(newPositions.foreverDir);

        setPositions(newPositions);
        setGrid(generateGrid(newReva, newForever));
        setFoundWords(new Set());
        animatedWordsRef.current = new Set();

        // Sembunyikan lagi garis-garis yang mungkin sudah pernah tergambar
        [revaPathRef, foreverPathRef, borderPathRef].forEach(ref => {
            if (ref.current) gsap.set(ref.current, { opacity: 0 });
        });
    };

    const registerWrongAttempt = () => {
        setWrongAttempts(prev => {
            const next = prev + 1;

            setShowWrongFlash(true);
            if (wrongFlashTimeoutRef.current) clearTimeout(wrongFlashTimeoutRef.current);
            wrongFlashTimeoutRef.current = setTimeout(() => setShowWrongFlash(false), 900);

            if (next >= MAX_WRONG_ATTEMPTS) {
                reshuffleEverything();
                setJustReshuffled(true);
                setTimeout(() => setJustReshuffled(false), 1800);
                return 0;
            }
            return next;
        });
    };

    useEffect(() => {
        const handleUp = () => {
            setIsDragging(false);
            setSelection(current => {
                if (current.length > 1 && !puzzleSolved && gameStarted) {
                    if (pathMatches(current, revaPath)) {
                        setFoundWords(prev => new Set(prev).add('REVA'));
                    } else if (pathMatches(current, foreverPath)) {
                        setFoundWords(prev => new Set(prev).add('FOREVER'));
                    } else {
                        registerWrongAttempt();
                    }
                }
                return [];
            });
        };
        window.addEventListener('mouseup', handleUp);
        return () => window.removeEventListener('mouseup', handleUp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [puzzleSolved, gameStarted, positions]);

    const startGame = () => setGameStarted(true);

    const handleCellMouseDown = (r: number, c: number) => {
        if (!gameStarted || puzzleSolved) return;
        setIsDragging(true);
        setSelection([[r, c]]);
    };

    const handleCellMouseEnter = (r: number, c: number) => {
        if (!isDragging || !gameStarted || puzzleSolved) return;
        setSelection(prev => {
            const last = prev[prev.length - 1];
            if (last && cellsEqual(last, [r, c])) return prev;
            return [...prev, [r, c]];
        });
    };

    const handleGiveUp = () => {
        setGaveUp(true);
        setFoundWords(new Set(['REVA', 'FOREVER']));
    };

    const isCellSelected = (r: number, c: number) => selection.some(cell => cellsEqual(cell, [r, c]));
    const isCellInFoundReva = (r: number, c: number) => foundWords.has('REVA') && revaPath.some(cell => cellsEqual(cell, [r, c]));
    const isCellInFoundForever = (r: number, c: number) => foundWords.has('FOREVER') && foreverPath.some(cell => cellsEqual(cell, [r, c]));

    const cellBackground = (r: number, c: number) => {
        if (isCellInFoundReva(r, c)) return 'rgba(78, 124, 196, 0.25)';
        if (isCellInFoundForever(r, c)) return 'rgba(231, 76, 60, 0.2)';
        if (isCellSelected(r, c)) return 'rgba(255, 222, 89, 0.55)';
        return 'transparent';
    };

    const remainingChances = MAX_WRONG_ATTEMPTS - wrongAttempts;

    return (
        <>
            <svg height="0" width="0" style={{ position: 'absolute' }}>
                <defs>
                    <filter id="pzHandDrawnNoise">
                        <feTurbulence result="noise" numOctaves={8} baseFrequency={0.1} type="fractalNoise" />
                        <feDisplacementMap yChannelSelector="G" xChannelSelector="R" scale={3} in2="noise" in="SourceGraphic" />
                    </filter>
                    <filter id="pzHandDrawnNoise2">
                        <feTurbulence result="noise" numOctaves={8} baseFrequency={0.1} seed={1010} type="fractalNoise" />
                        <feDisplacementMap yChannelSelector="G" xChannelSelector="R" scale={3} in2="noise" in="SourceGraphic" />
                    </filter>
                    <filter id="pzHandDrawnNoiseT">
                        <feTurbulence result="noise" numOctaves={8} baseFrequency={0.1} type="fractalNoise" />
                        <feDisplacementMap yChannelSelector="G" xChannelSelector="R" scale={6} in2="noise" in="SourceGraphic" />
                    </filter>
                    <filter id="pzHandDrawnNoiseT2">
                        <feTurbulence result="noise" numOctaves={8} baseFrequency={0.1} seed={1010} type="fractalNoise" />
                        <feDisplacementMap yChannelSelector="G" xChannelSelector="R" scale={6} in2="noise" in="SourceGraphic" />
                    </filter>
                </defs>
            </svg>

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

            {onNext && puzzleSolved && (
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
                <div className={`${styles.pageLeft} ${styles.linedPage}`}>
                    <div className={styles.pageContent}>
                        <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999' }}>
                            Date:
                        </div>
                        <div style={{ position: 'absolute', bottom: '3rem', right: '3rem', opacity: 0.6 }}>
                            <svg width="80" height="80" viewBox="0 0 100 100">
                                <path d="M 30 50 C 30 20, 70 20, 70 50 C 70 80, 30 80, 30 50 Z" fill="none" stroke="#333" strokeWidth="2" strokeDasharray="5,5" />
                                <text x="50" y="55" fontFamily="var(--font-handwriting)" fontSize="14" textAnchor="middle" fill="#333">?</text>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className={`${styles.dummyPage} ${styles.linedPage}`} style={{ zIndex: 10 }}>
                    <div className={styles.pageContent}>
                        <div style={{ position: 'absolute', top: '2.5rem', left: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#999' }}>
                            Date:
                        </div>

                        <div style={{ marginTop: '2.5rem', padding: '0 1rem', display: 'flex', flexDirection: 'column', height: '100%' }}>

                            <div ref={textRef} style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem', color: '#333', lineHeight: '1.8' }}>
                                <div>Dibawah ini adalah bentuk</div>
                                <div>Teka-Teki yang kamu gausa mikir</div>
                                <div>lagi, kesian soalnya rumit</div>
                            </div>

                            {!gameStarted && (
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.2rem' }}>
                                    <button type="button" className="doodle-btn" onClick={startGame}>
                                        <span className="btn-text">MAIN YUK!</span>

                                        <div className="icon-1">
                                            <svg viewBox="0 0 40 80" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20,0 Q15,20 20,45" fill="none" stroke="#1e1e24" strokeWidth="2.5" strokeLinecap="round"></path>
                                                <path d="M20,45 l5,10 10,2 -7,8 2,10 -10,-6 -10,6 2,-10 -7,-8 10,-2 z" fill="#ffde59" stroke="#1e1e24" strokeWidth="3" strokeLinejoin="round"></path>
                                            </svg>
                                        </div>

                                        <div className="icon-2">
                                            <svg viewBox="0 0 40 80" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20,0 Q25,25 20,45" fill="none" stroke="#1e1e24" strokeWidth="2.5" strokeLinecap="round"></path>
                                                <path d="M20,65 L10,55 A 7 7 0 0 1 20,45 A 7 7 0 0 1 30,55 Z" fill="#ff8ba7" stroke="#1e1e24" strokeWidth="3" strokeLinejoin="round"></path>
                                            </svg>
                                        </div>

                                        <div className="icon-3">
                                            <svg viewBox="0 0 40 80" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20,0 Q15,25 20,50" fill="none" stroke="#1e1e24" strokeWidth="2.5" strokeLinecap="round"></path>
                                                <path d="M20,45 Q20,60 10,60 Q20,60 20,75 Q20,60 30,60 Q20,60 20,45 Z" fill="#8ef0ce" stroke="#1e1e24" strokeWidth="3" strokeLinejoin="round"></path>
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                            )}

                            {gameStarted && !puzzleSolved && (
                                <div style={{ textAlign: 'center', marginTop: '0.8rem' }}>
                                    <div style={{ fontFamily: 'var(--font-handwriting)', fontSize: '0.95rem', color: '#888' }}>
                                        👆 Klik &amp; seret dari huruf ke huruf buat nyari{' '}
                                        <strong style={{ color: foundWords.has('REVA') ? '#4e7cc4' : '#888' }}>REVA</strong>
                                        {' '}sama{' '}
                                        <strong style={{ color: foundWords.has('FOREVER') ? '#e74c3c' : '#888' }}>FOREVER</strong>
                                    </div>
                                    <div style={{ fontFamily: 'var(--font-handwriting)', fontSize: '0.9rem', color: showWrongFlash ? '#e74c3c' : '#aaa', marginTop: '0.3rem', transition: 'color 0.2s' }}>
                                        {showWrongFlash
                                            ? 'Yah, salah! 😳'
                                            : justReshuffled
                                                ? 'Diacak ulang total (posisi & huruf) biar makin susah 😈'
                                                : `Kesempatan tersisa: ${remainingChances}/${MAX_WRONG_ATTEMPTS}`}
                                    </div>
                                </div>
                            )}

                            <div style={{ position: 'relative', marginTop: '1rem', width: '250px', margin: '1rem auto 0', fontFamily: 'var(--font-handwriting)', fontSize: '1.2rem', color: '#333' }}>

                                <svg width="300" height="310" style={{ position: 'absolute', top: '-10px', left: '-25px', pointerEvents: 'none', zIndex: 5 }}>
                                    {/* Border ungu — cuma muncul kalau DUA-DUANYA ketemu */}
                                    <path
                                        ref={borderPathRef}
                                        d="M 14 8 Q 8 2, 22 3 Q 60 -1, 130 4 Q 200 -2, 268 6
                                           Q 292 10, 288 30 Q 291 90, 285 150
                                           Q 292 210, 286 265 Q 290 285, 268 288
                                           Q 200 294, 130 289 Q 60 295, 20 287
                                           Q 4 283, 9 260 Q 3 200, 10 150
                                           Q 2 90, 11 35 Q 6 15, 14 8 Z"
                                        fill="none" stroke="#8b6fc9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                        style={{ opacity: 0 }}
                                    />

                                    {/* REVA — biru, cuma muncul kalau REVA sendiri ketemu */}
                                    <path
                                        ref={revaPathRef}
                                        d={buildRevaOvalPath(positions.revaCol, positions.revaRow)}
                                        fill="none" stroke="#4e7cc4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                                        style={{ opacity: 0 }}
                                    />

                                    {/* FOREVER — merah, cuma muncul kalau FOREVER sendiri ketemu */}
                                    <path
                                        ref={foreverPathRef}
                                        d={buildForeverOvalPath(positions.foreverDir)}
                                        fill="none" stroke="#e74c3c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                                        style={{ opacity: 0 }}
                                    />
                                </svg>

                                <div
                                    ref={gridRef}
                                    onDragStart={(e) => e.preventDefault()}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(7, 1fr)',
                                        gap: '10px 0',
                                        textAlign: 'center',
                                        lineHeight: '31px',
                                        userSelect: 'none',
                                        WebkitUserSelect: 'none',
                                    }}
                                >
                                    {grid.map((row, rIndex) =>
                                        row.map((letter, cIndex) => (
                                            <div
                                                key={`${rIndex}-${cIndex}`}
                                                onMouseDown={() => handleCellMouseDown(rIndex, cIndex)}
                                                onMouseEnter={() => handleCellMouseEnter(rIndex, cIndex)}
                                                style={{
                                                    position: 'relative',
                                                    zIndex: 6,
                                                    cursor: gameStarted && !puzzleSolved ? 'pointer' : 'default',
                                                    backgroundColor: cellBackground(rIndex, cIndex),
                                                    borderRadius: '50%',
                                                    transition: 'background-color 0.15s ease',
                                                }}
                                            >
                                                {letter}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {gameStarted && !puzzleSolved && (
                                <div style={{ marginTop: 'auto', textAlign: 'center', paddingBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                                    <button
                                        className={styles.pzGiveUpBtn}
                                        onClick={handleGiveUp}
                                    >
                                        <svg
                                            className={styles.pzGiveUpCosm}
                                            fill="#000000"
                                            width="28"
                                            height="28"
                                            viewBox="0 0 256 256"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M243.07324,157.43945c-1.2334-1.47949-23.18847-27.34619-60.46972-41.05859-1.67579-17.97412-8.25293-34.36328-18.93653-46.87158C149.41309,52.8208,128.78027,44,104,44,54.51074,44,22.10059,88.57715,20.74512,90.4751a3.99987,3.99987,0,0,0,6.50781,4.65234C27.5625,94.6958,58.68359,52,104,52c22.36816,0,40.89648,7.85107,53.584,22.70508,8.915,10.437,14.65625,23.9541,16.65528,38.894A133.54185,133.54185,0,0,0,136,108c-25.10742,0-46.09473,6.48486-60.69434,18.75391-12.65234,10.63379-19.91015,25.39355-19.91015,40.49463a43.61545,43.61545,0,0,0,12.69336,31.21923C76.98438,207.3208,89.40234,212,104,212c23.98047,0,44.37305-9.4668,58.97461-27.37744,12.74512-15.6333,20.05566-37.145,20.05566-59.01953,0-.1128-.001-.22559-.001-.33838,33.62988,13.48486,53.62207,36.96631,53.89746,37.2959a4.00015,4.00015,0,0,0,6.14648-5.1211ZM104,204c-27.89746,0-40.60449-19.05078-40.60449-36.75146C63.39551,142.56592,86.11621,116,136,116a124.37834,124.37834,0,0,1,38.97266,6.32617q.05712,1.63038.05761,3.27686C175.03027,177.07129,139.29785,204,104,204Z" />
                                        </svg>
                                        <svg
                                            className={styles.pzGiveUpHighlight}
                                            viewBox="0 0 144.75738 77.18431"
                                            preserveAspectRatio="none"
                                        >
                                            <g transform="translate(-171.52826,-126.11624)">
                                                <g fill="none" strokeWidth="17" strokeLinecap="round" strokeMiterlimit="10">
                                                    <path d="M180.02826,169.45123c0,0 12.65228,-25.55115 24.2441,-25.66863c6.39271,-0.06479 -5.89143,46.12943 4.90937,50.63857c10.22345,4.2681 24.14292,-52.38336 37.86455,-59.80493c3.31715,-1.79413 -5.35094,45.88889 -0.78872,58.34589c5.19371,14.18125 33.36934,-58.38221 36.43049,-56.91633c4.67078,2.23667 -0.06338,44.42744 5.22574,47.53647c6.04041,3.55065 19.87185,-20.77286 19.87185,-20.77286" />
                                                </g>
                                            </g>
                                        </svg>
                                        Nyerah?
                                    </button>
                                </div>
                            )}

                            {puzzleSolved && (
                                <div style={{ marginTop: 'auto', textAlign: 'center', paddingBottom: '2rem', fontFamily: 'var(--font-handwriting)', fontSize: '1.15rem', color: gaveUp ? '#888' : '#27ae60' }}>
                                    {gaveUp ? 'Nih jawabannya sayang 😅' : '🎉 Yeay, kamu berhasil nemuin dua-duanya!'}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @import url("https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap");

                .doodle-btn {
                    position: relative;
                    padding: 14px 40px;
                    background: #ffde59;
                    font-family: "Patrick Hand", "Comic Sans MS", cursive;
                    font-size: 22px;
                    font-weight: bold;
                    letter-spacing: 2px;
                    color: #1e1e24;
                    cursor: pointer;
                    border: 4px solid #1e1e24;
                    border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
                    box-shadow: 6px 8px 0px #1e1e24;
                    transition:
                        transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                        box-shadow 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                        background 0.3s ease;
                    user-select: none;
                    outline: none;
                }

                .doodle-btn::before {
                    content: "";
                    position: absolute;
                    inset: 4px;
                    border: 2px dashed rgba(30, 30, 36, 0.35);
                    border-radius: inherit;
                    pointer-events: none;
                }

                .btn-text {
                    position: relative;
                    z-index: 2;
                    text-shadow: 2px 2px 0px rgba(255, 255, 255, 0.6);
                }

                .doodle-btn:hover {
                    transform: translateY(-4px) rotate(-1deg);
                    box-shadow: 8px 12px 0px #1e1e24;
                    background: linear-gradient(85deg, #ffde59, #fec195, #ffb6c1, #dcd0ff, #8ef0ce);
                    background-size: 300% 300%;
                    animation: doodle-wind 3s ease-in-out infinite;
                }

                @keyframes doodle-wind {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                .doodle-btn:active {
                    transform: translate(4px, 6px) rotate(1deg) !important;
                    box-shadow: 2px 2px 0px #1e1e24 !important;
                    transition: transform 0.1s ease, box-shadow 0.1s ease;
                }

                .doodle-btn:focus-visible {
                    outline: 4px dashed #8ef0ce;
                    outline-offset: 8px;
                }

                .icon-1, .icon-2, .icon-3 {
                    position: absolute;
                    top: -10px;
                    transform-origin: 50% 0;
                    transition: all 0.5s ease-in-out;
                    filter: drop-shadow(3px 4px 0px #1e1e24);
                    pointer-events: none;
                    z-index: 5;
                }

                .icon-1 { right: 12px; width: 28px; transform: rotate(8deg); }
                .icon-2 { left: 34px; width: 20px; transform: rotate(-12deg); }
                .icon-3 { left: 8px; width: 24px; transform: rotate(5deg); }

                .doodle-btn:hover .icon-1 { animation: swing-1 2.5s cubic-bezier(0.52, 0, 0.58, 1) infinite; }
                .doodle-btn:hover .icon-2 { animation: swing-2 3s cubic-bezier(0.52, 0, 0.58, 1) 0.5s infinite; }
                .doodle-btn:hover .icon-3 { animation: swing-3 2s cubic-bezier(0.52, 0, 0.58, 1) 0.2s infinite; }

                .doodle-btn:active .icon-1 { transform: rotate(-25deg) scale(1.1); }
                .doodle-btn:active .icon-2 { transform: rotate(30deg) scale(1.1); }
                .doodle-btn:active .icon-3 { transform: rotate(-20deg) scale(1.1); }

                @keyframes swing-1 { 0% { transform: rotate(8deg); } 50% { transform: rotate(-15deg); } 100% { transform: rotate(8deg); } }
                @keyframes swing-2 { 0% { transform: rotate(-12deg); } 50% { transform: rotate(18deg); } 100% { transform: rotate(-12deg); } }
                @keyframes swing-3 { 0% { transform: rotate(5deg); } 50% { transform: rotate(-20deg); } 100% { transform: rotate(5deg); } }
            `}</style>
        </>
    );
}