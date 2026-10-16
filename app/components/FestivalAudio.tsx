'use client';

import {useEffect, useRef, useState} from 'react';

export default function FestivalAudio() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const manuallyPaused = useRef(false);

  useEffect(() => {
    const player = audio.current;
    if (!player) return;
    player.volume = 0.35;
    let scrollStarted = false;
    let disposed = false;
    const start = async () => {
      if (disposed || manuallyPaused.current || !player.paused || document.hidden) return;
      try {
        await player.play();
        if (disposed || manuallyPaused.current || document.hidden) player.pause();
      } catch {
        // Mobile browsers may require the explicit music button.
      }
    };
    const onScrollIntent = () => { scrollStarted = true; void start(); };
    const onKey = (event: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '].includes(event.key) &&
          !(event.target instanceof HTMLElement && event.target.closest('input,textarea,select,button,a,[contenteditable]'))) onScrollIntent();
    };
    const onGestureEnd = (event: Event) => {
      // Retry directly inside a real activation; never defer play() to a timer.
      // Leave the music toggle to its own handler so a stop tap cannot restart it.
      if (event.target instanceof Element && event.target.closest('.festival-audio')) return;
      if (scrollStarted) void start();
    };
    const onVisibility = () => { if (document.hidden) player.pause(); };
    window.addEventListener('wheel', onScrollIntent, {passive: true});
    window.addEventListener('touchmove', onScrollIntent, {passive: true});
    window.addEventListener('touchend', onGestureEnd, {passive: true});
    window.addEventListener('pointerdown', onGestureEnd, {passive: true});
    window.addEventListener('pointerup', onGestureEnd, {passive: true});
    window.addEventListener('click', onGestureEnd, {passive: true});
    window.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      disposed = true;
      player.pause();
      window.removeEventListener('wheel', onScrollIntent);
      window.removeEventListener('touchmove', onScrollIntent);
      window.removeEventListener('touchend', onGestureEnd);
      window.removeEventListener('pointerdown', onGestureEnd);
      window.removeEventListener('pointerup', onGestureEnd);
      window.removeEventListener('click', onGestureEnd);
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  async function toggle() {
    const player = audio.current;
    if (!player) return;
    if (!player.paused) {
      manuallyPaused.current = true;
      player.pause();
    } else {
      manuallyPaused.current = false;
      try { await player.play(); } catch { setPlaying(false); }
    }
  }

  return <>
    <audio ref={audio} src="/audio/durga-puja-dhak.mp3" loop preload="auto"
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setPlaying(false)}/>
    <button type="button" className="festival-audio" onClick={toggle}
      aria-label={playing ? 'ঢাকের মিউজিক বন্ধ করুন' : 'ঢাকের মিউজিক চালু করুন'} aria-pressed={playing}>
      <span aria-hidden="true">{playing ? '♫' : '♪'}</span>{playing ? 'ঢাক বন্ধ' : 'ঢাক শুনুন'}
    </button>
  </>;
}
