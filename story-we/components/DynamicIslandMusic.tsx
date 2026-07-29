"use client";

import React, { useState } from 'react';
import styles from '../styles/dynamicIsland.module.css';

interface DynamicIslandMusicProps {
    title?: string;
    artist?: string;
}

export default function DynamicIslandMusic({ 
    title = "Our Story", 
    artist = "Memories" 
}: DynamicIslandMusicProps) {
    const [isPlaying, setIsPlaying] = useState(true);
    
    return (
        <div className={styles.islandContainer} onClick={() => setIsPlaying(!isPlaying)}>
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
