"use client";

import React, { useState, useRef, useCallback } from 'react';
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
import PageFlipOverlay, { PageFlipHandle } from './PageFlipOverlay';
import styles from '../styles/book.module.css';

export default function BookExperience() {
  const [scene, setScene] = useState<number>(0);
  const [withAudio, setWithAudio] = useState<boolean>(false);
  const pageFlipRef = useRef<PageFlipHandle>(null);

  // ── Navigation helpers ──────────────────────────────────────────────────
  // Scenes ≥ 2 use the 3-D page-flip overlay.
  // The scene actually changes at the midpoint of the animation (when the
  // page is edge-on and neither face is visible), so the transition is seamless.

  const navigateTo = useCallback((nextScene: number) => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flip('next', () => setScene(nextScene));
    } else {
      setScene(nextScene);
    }
  }, []);

  const navigateBack = useCallback((prevScene: number) => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flip('prev', () => setScene(prevScene));
    } else {
      setScene(prevScene);
    }
  }, []);

  // ── Special transitions (keep own animations, no flip overlay) ──────────
  const handleIntroComplete = (userSelectedAudio: boolean) => {
    setWithAudio(userSelectedAudio);
    setScene(1); // Intro → SpinningBook (intro handles its own animation)
  };

  const handleCoverOpen = () => {
    setScene(2); // SpinningBook → first spread (cover has its own 3-D anim)
  };

  return (
    <div className={styles.bookContainer}>
      {scene > 0 && (
        <>
          <DynamicIslandMusic initialPlaying={withAudio} />
          <ThemeToggle />
        </>
      )}

      {scene === 0  && <Scene1Intro onComplete={handleIntroComplete} />}
      {scene === 1  && <SpinningBook onClick={handleCoverOpen} />}

      {scene === 2  && <Scene2BookFlip
                          onNext={() => navigateTo(3)}
                          onPrev={() => navigateBack(1)} />}
      {scene === 3  && <Scene3CakePage
                          onNext={() => navigateTo(4)}
                          onPrev={() => navigateBack(2)} />}
      {scene === 4  && <Scene4Letter
                          onNext={() => navigateTo(5)}
                          onPrev={() => navigateBack(3)} />}
      {scene === 5  && <Scene5Flowers
                          onNext={() => navigateTo(6)}
                          onPrev={() => navigateBack(4)} />}
      {scene === 6  && <Scene6Gift
                          onNext={() => navigateTo(7)}
                          onPrev={() => navigateBack(5)} />}
      {scene === 7  && <Scene7Universe
                          onNext={() => navigateTo(8)}
                          onPrev={() => navigateBack(6)} />}
      {scene === 8  && <Scene8Puzzle
                          onNext={() => navigateTo(9)}
                          onPrev={() => navigateBack(7)} />}
      {scene === 9  && <Scene9Globe
                          onNext={() => navigateTo(10)}
                          onPrev={() => navigateBack(8)} />}
      {scene === 10 && <Scene10Math
                          onNext={() => navigateTo(11)}
                          onPrev={() => navigateBack(9)} />}
      {scene === 11 && <Scene11Music
                          onNext={() => navigateTo(12)}
                          onPrev={() => navigateBack(10)} />}
      {scene === 12 && <Scene12Chat
                          onNext={() => navigateTo(13)}
                          onPrev={() => navigateBack(11)} />}
      {scene === 13 && <Scene13Promise
                          onNext={() => navigateTo(14)}
                          onPrev={() => navigateBack(12)} />}
      {scene === 14 && <Scene14Quote
                          onNext={() => navigateTo(15)}
                          onPrev={() => navigateBack(13)} />}
      {scene === 15 && <Scene15Advice
                          onNext={() => navigateTo(16)}
                          onPrev={() => navigateBack(14)} />}
      {scene === 16 && <Scene16Checklist
                          onPrev={() => navigateBack(15)} />}

      {/* 3-D page-flip overlay — always mounted, hidden until a flip fires */}
      <PageFlipOverlay ref={pageFlipRef} />
    </div>
  );
}