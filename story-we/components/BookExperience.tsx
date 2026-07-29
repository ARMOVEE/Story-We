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
import Scene13Promise from './Scene13Promise';
import Scene14Quote from './Scene14Quote';
import Scene15Advice from './Scene15Advice';
import Scene16Checklist from './Scene16Checklist';
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

  const handleChatComplete = () => {
    setScene(13);
  };

  const handlePromiseComplete = () => {
    setScene(14);
  };

  const handleQuoteComplete = () => {
    setScene(15);
  };

  const handleAdviceComplete = () => {
    setScene(16);
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
      {scene === 2 && <Scene2BookFlip onNext={handleCountdownComplete} onPrev={() => setScene(1)} />}
      {scene === 3 && <Scene3CakePage onNext={handleCakeComplete} onPrev={() => setScene(2)} />}
      {scene === 4 && <Scene4Letter onNext={handleLetterComplete} onPrev={() => setScene(3)} />}
      {scene === 5 && <Scene5Flowers onNext={handleFlowerComplete} onPrev={() => setScene(4)} />}
      {scene === 6 && <Scene6Gift onNext={handleGiftComplete} onPrev={() => setScene(5)} />}
      {scene === 7 && <Scene7Universe onNext={handleUniverseComplete} onPrev={() => setScene(6)} />}
      {scene === 8 && <Scene8Puzzle onNext={handlePuzzleComplete} onPrev={() => setScene(7)} />}
      {scene === 9 && <Scene9Globe onNext={handleGlobeComplete} onPrev={() => setScene(8)} />}
      {scene === 10 && <Scene10Math onNext={handleMathComplete} onPrev={() => setScene(9)} />}
      {scene === 11 && <Scene11Music onNext={handleMusicComplete} onPrev={() => setScene(10)} />}
      {scene === 12 && <Scene12Chat onNext={handleChatComplete} onPrev={() => setScene(11)} />}
      {scene === 13 && <Scene13Promise onNext={handlePromiseComplete} onPrev={() => setScene(12)} />}
      {scene === 14 && <Scene14Quote onNext={handleQuoteComplete} onPrev={() => setScene(13)} />}
      {scene === 15 && <Scene15Advice onNext={handleAdviceComplete} onPrev={() => setScene(14)} />}
      {scene === 16 && <Scene16Checklist onPrev={() => setScene(15)} />}
    </div>
  );
}