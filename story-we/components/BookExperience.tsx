"use client";

import React, { useState } from 'react';
import Scene1Intro from './Scene1Intro';
import SpinningBook from './SpinningBook';
import Scene2BookFlip from './Scene2bookflip';
import Scene3CakePage from './Scene3CakePage';
import Scene4Letter from './Scene4Letter';
import Scene5Flowers from './Scene5Flowers';
import Scene6Gift from './Scene6Gift';
import Scene7Universe from './Scene7Universe';
import Scene8Puzzle from './Scene8Puzzle';
import Scene9Globe from './Scene9Globe';
import Scene10Math from './Scene10Math';
import Scene11Music from './Scene11Music';
import Scene12Chat from './Scene12Chat';
import DynamicIslandMusic from './DynamicIslandMusic';
import ThemeToggle from './ThemeToggle';
import styles from '../styles/book.module.css';

export default function BookExperience() {
  const [scene, setScene] = useState<number>(0);

  const handleIntroComplete = (withAudio: boolean) => {
    setScene(1);
  };

  const handleCoverOpen = () => {
    setScene(2);
  };

  const handleCountdownComplete = () => {
    setScene(3);
  };

  const handleCakeComplete = () => {
    setScene(4);
  };

  const handleLetterComplete = () => {
    setScene(5);
  };

  const handleFlowerComplete = () => {
    setScene(6);
  };

  const handleGiftComplete = () => {
    setScene(7);
  };

  const handleUniverseComplete = () => {
    setScene(8);
  };

  const handlePuzzleComplete = () => {
    setScene(9);
  };

  const handleGlobeComplete = () => {
    setScene(10);
  };

  const handleMathComplete = () => {
    setScene(11);
  };

  const handleMusicComplete = () => {
    setScene(12);
  };

  return (
    <div className={styles.bookContainer}>
      {scene > 0 && (
        <>
          <DynamicIslandMusic />
          <ThemeToggle />
        </>
      )}

      {scene === 0 && <Scene1Intro onComplete={handleIntroComplete} />}
      {scene === 1 && <SpinningBook onClick={handleCoverOpen} />}
      {scene === 2 && <Scene2BookFlip onNext={handleCountdownComplete} />}
      {scene === 3 && <Scene3CakePage onNext={handleCakeComplete} />}
      {scene === 4 && <Scene4Letter onNext={handleLetterComplete} />}
      {scene === 5 && <Scene5Flowers onNext={handleFlowerComplete} />}
      {scene === 6 && <Scene6Gift onNext={handleGiftComplete} />}
      {scene === 7 && <Scene7Universe onNext={handleUniverseComplete} />}
      {scene === 8 && <Scene8Puzzle onNext={handlePuzzleComplete} />}
      {scene === 9 && <Scene9Globe onNext={handleGlobeComplete} />}
      {scene === 10 && <Scene10Math onNext={handleMathComplete} />}
      {scene === 11 && <Scene11Music onNext={handleMusicComplete} />}
      {scene === 12 && <Scene12Chat />}
    </div>
  );
}