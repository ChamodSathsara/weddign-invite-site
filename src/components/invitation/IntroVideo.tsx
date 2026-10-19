import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SkipForwardIcon, Volume2Icon, VolumeXIcon } from 'lucide-react';
import { useI18n } from '../../contexts/LanguageContext';
import { useMusic } from '../../contexts/MusicContext';
import { assets } from '../../data/wedding';

const START_TIMEOUT_MS = 5000;
const STALL_TIMEOUT_MS = 4000;
const HARD_CAP_MS = 15000;

/**
 * Fullscreen intro film. The video is always muted — the background music
 * (started by the Open Invitation tap) is the single soundtrack.
 * Any failure path falls straight through to the site.
 */
export function IntroVideo({ onDone }: {onDone: () => void;}) {
  const { m } = useI18n();
  const { muted, started, toggleMute } = useMusic();
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  }, [onDone]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let stallTimer: number | undefined;
    const startTimer = window.setTimeout(() => {
      if (video.paused || video.currentTime === 0) finish();
    }, START_TIMEOUT_MS);
    const hardCap = window.setTimeout(finish, HARD_CAP_MS);

    const onPlaying = () => {
      setPlaying(true);
      window.clearTimeout(stallTimer);
    };
    const onStall = () => {
      window.clearTimeout(stallTimer);
      stallTimer = window.setTimeout(finish, STALL_TIMEOUT_MS);
    };
    const onTime = () => {
      if (progressRef.current && video.duration) {
        progressRef.current.style.transform = `scaleX(${video.currentTime / video.duration})`;
      }
    };

    video.addEventListener('playing', onPlaying);
    video.addEventListener('waiting', onStall);
    video.addEventListener('stalled', onStall);
    video.addEventListener('timeupdate', onTime);
    video.addEventListener('ended', finish);
    video.addEventListener('error', finish);

    video.play().catch(() => finish());

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(hardCap);
      window.clearTimeout(stallTimer);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('waiting', onStall);
      video.removeEventListener('stalled', onStall);
      video.removeEventListener('timeupdate', onTime);
      video.removeEventListener('ended', finish);
      video.removeEventListener('error', finish);
    };
  }, [finish]);

  const soundOn = started && !muted;

  return (
    <motion.section
      aria-label={m.intro.label}
      className="fixed inset-0 z-50 h-[100dvh] w-[100dvw] overflow-hidden bg-brown"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}>
      
      <video
        ref={videoRef}
        src={assets.introVideo}
        poster={assets.couple}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        controls={false}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover" />
      

      {!playing &&
      <div className="absolute inset-0 flex items-center justify-center" role="status">
          <span className="rounded-full bg-ivory/90 px-5 py-2 text-sm text-brown">{m.intro.loading}</span>
        </div>
      }

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6 md:px-8 md:pb-8">
        <button
          type="button"
          onClick={toggleMute}
          aria-pressed={soundOn}
          className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full border border-ivory/40 bg-brown/60 px-4 text-sm text-ivory backdrop-blur-sm transition-[background-color] duration-150 hover:bg-brown/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
          
          {soundOn ? <Volume2Icon className="h-4 w-4" aria-hidden="true" /> : <VolumeXIcon className="h-4 w-4" aria-hidden="true" />}
          {soundOn ? m.intro.mute : m.intro.unmute}
        </button>
        <button
          type="button"
          onClick={finish}
          className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full bg-ivory px-5 text-sm font-medium text-brown transition-[transform] duration-150 ease-out-soft active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
          
          {m.intro.skip}
          <SkipForwardIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-ivory/15" aria-hidden="true">
        <div ref={progressRef} className="h-full origin-left scale-x-0 bg-gold" />
      </div>
    </motion.section>);

}
