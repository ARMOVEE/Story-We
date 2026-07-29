"use client";

import React from 'react';
import styles from '../styles/book.module.css';

interface BookCoverProps {
    side: 'front' | 'back';
    title?: string;
}

// Artwork galaxy — planet bercincin, komet, dan bintang
// dipakai di sampul depan & belakang
function GalaxyArt() {
    return (
        <svg
            className={styles.coverArt}
            viewBox="0 0 400 500"
            preserveAspectRatio="xMidYMid slice"
        >
            <defs>
                <linearGradient id="planetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f2b8d4" />
                    <stop offset="35%" stopColor="#c9a8e8" />
                    <stop offset="65%" stopColor="#8b93c9" />
                    <stop offset="100%" stopColor="#e8896a" />
                </linearGradient>
            </defs>

            {/* Bintang area atas */}
            {[
                [60, 60], [90, 100], [140, 50], [180, 90], [230, 40],
                [270, 70], [310, 110], [250, 130], [70, 140], [330, 60],
            ].map(([cx, cy], i) => (
                <circle
                    key={`t-${i}`}
                    cx={cx}
                    cy={cy}
                    r={i % 3 === 0 ? 2.2 : 1.3}
                    fill="#fff"
                    opacity={0.9}
                />
            ))}

            {/* Bintang area bawah */}
            {[
                [80, 400], [120, 440], [160, 410], [200, 460], [240, 420],
                [280, 450], [100, 470], [320, 400], [180, 480], [260, 470],
            ].map(([cx, cy], i) => (
                <circle
                    key={`b-${i}`}
                    cx={cx}
                    cy={cy}
                    r={i % 4 === 0 ? 2 : 1.2}
                    fill="#fff"
                    opacity={0.85}
                />
            ))}

            {/* Komet kanan atas */}
            <path
                d="M330,80 L360,50"
                stroke="url(#planetGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.9"
            />
            <circle cx="362" cy="48" r="4" fill="#f5e08a" />

            {/* Komet kiri bawah */}
            <path
                d="M70,380 L100,420"
                stroke="url(#planetGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.9"
            />
            <circle cx="68" cy="378" r="4" fill="#f5e08a" />

            {/* Cincin planet — belakang */}
            <ellipse
                cx="200" cy="250" rx="150" ry="34"
                fill="none" stroke="#f0d9c0" strokeWidth="10" opacity="0.55"
            />

            {/* Badan planet */}
            <circle cx="200" cy="250" r="85" fill="url(#planetGrad)" />
            <ellipse cx="175" cy="220" rx="35" ry="16" fill="#fff" opacity="0.25" />
            <ellipse cx="230" cy="270" rx="20" ry="9" fill="#fff" opacity="0.2" />

            {/* Cincin planet — depan (menutupi planet) */}
            <ellipse
                cx="200" cy="250" rx="150" ry="34"
                fill="none" stroke="#f0d9c0" strokeWidth="10"
                strokeDasharray="230 500" strokeDashoffset="-115"
            />
        </svg>
    );
}

export default function BookCover({ side, title = 'STORY WE' }: BookCoverProps) {
    return (
        <div className={styles.coverContainer}>
            <div className={styles.coverStars} />
            <GalaxyArt />

            {side === 'front' ? (
                <h1 className={styles.title} style={{ position: 'relative', zIndex: 2 }}>
                    {title}
                </h1>
            ) : (
                <p
                    className={styles.openingText}
                    style={{ position: 'relative', zIndex: 2, color: '#ddd', textAlign: 'center', padding: '0 2rem' }}
                >
                    to be continued...
                </p>
            )}
        </div>
    );
}