'use client';

import {useEffect, useImperativeHandle, useRef, useState, type Ref} from 'react';

export type FestivalAudioHandle = {start: () => void};

export default function FestivalAudio({ref}: {ref: Ref<FestivalAudioHandle>}) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const manuallyPaused = useRef(false);

  // Keep play() directly in the envelope click's real user activation.
  function start() {
    const player = audio.current;
    if (!player || manuallyPaused.current || document.hidden || !player.paused) return;
    player.volume = 0.35;
    void player.play().then(() => {
      if (manuallyPaused.current || document.hidden) player.pause();
    }).catch(() => setPlaying(false));
  }
  useImperativeHandle(ref, () => ({start}));
  useEffect(() => {
    const player = audio.current;
    const onVisibility = () => { if (document.hidden) player?.pause(); };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      player?.pause();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);
  function toggle() {
    const player = audio.current;
    if (!player) return;
    if (!player.paused) {
      manuallyPaused.current = true;
      player.pause();
    } else {
      manuallyPaused.current = false;
      start();
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
