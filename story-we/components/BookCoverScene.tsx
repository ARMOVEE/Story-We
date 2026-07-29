"use client";

import React, { useRef, useState } from 'react';
import styles from '../styles/book.module.css';
import BookCover from './BookCover';

interface BookCoverSceneProps {
    onOpen: () => void;
}

// Durasi transisi flip harus sama dengan .page { transition: transform 1.2s ... }
// di book.module.css, supaya onOpen() terpanggil pas animasi selesai.
const FLIP_DURATION_MS = 1200;

export default function BookCoverScene({ onOpen }: BookCoverSceneProps) {
    const [opening, setOpening] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleClick = () => {
        if (opening) return;
        setOpening(true);

        timeoutRef.current = setTimeout(() => {
            onOpen();
        }, FLIP_DURATION_MS);
    };

    return (
        <div className={styles.bookWrapper}>
            {/* Sampul belakang — diam di posisi kiri, kelihatan halus di balik spiral */}
            <div className={styles.pageLeft}>
                <BookCover side="back" />
            </div>

            {/* Sampul depan — tertutup di awal, klik untuk buka (flip ke kiri) */}
            <div
                className={`${styles.page} ${opening ? styles.flipped : ''}`}
                onClick={handleClick}
                role="button"
                aria-label="Buka buku"
                style={{ cursor: opening ? 'default' : 'pointer' }}
            >
                <BookCover side="front" title="STORY WE" />
            </div>
        </div>
    );
}