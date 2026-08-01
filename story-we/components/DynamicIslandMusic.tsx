"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/dynamicIsland.module.css';

interface DynamicIslandMusicProps {
    title?: string;
    artist?: string;
    initialPlaying?: boolean;
}

export default function DynamicIslandMusic({ 
    title = "Our Story", 
    artist = "Memories",
    initialPlaying = true
}: DynamicIslandMusicProps) {
    const [isPlaying, setIsPlaying] = useState(initialPlaying);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.log("Audio play failed:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);
    
    return (
        <div className={styles.islandContainer} onClick={() => setIsPlaying(!isPlaying)}>
            <audio ref={audioRef} src="/music/bgm.mp3" loop />
            <div className={styles.albumArt} style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
                <div className={styles.vinyl}></div>
            </div>
            <div className={styles.songInfo}>
                <div className={styles.songTitle}>{title}</div>
                <div className={styles.artistName}>{artist}</div>
            </div>
            <div className={styles.visualizer}>
                <div className={`${styles.bar} ${isPlaying ? styles.animate : ''}`}></div>
                <div className={`${styles.bar} ${isPlaying ? styles.animate : ''}`}></div>
                <div className={`${styles.bar} ${isPlaying ? styles.animate : ''}`}></div>
                <div className={`${styles.bar} ${isPlaying ? styles.animate : ''}`}></div>
            </div>
        </div>
    );
}
