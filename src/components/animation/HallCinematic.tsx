import React, { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { useI18n } from '../../contexts/LanguageContext';
import { hallScenes } from '../../data/hallScenes';
import { HallDoors } from './HallDoors';
import { LightParticles } from './LightParticles';

const VIDEO_SRC = '/wedding-hall-complete-walkthrough.mp4';
const FALLBACK_DURATION = 14.75;

/** Opens the invitation doors, then plays the full hall walkthrough film. */
export function HallCinematic() {
  const { m } = useI18n();
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState(-1);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    video.pause();
    let frame = 0;
    let doorTimeline: gsap.core.Timeline;
    const loadObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || video.getAttribute('src')) return;
      video.src = VIDEO_SRC;
      video.load();
      loadObserver.disconnect();
    }, { rootMargin: '100% 0px' });
    loadObserver.observe(root);

    const playVideo = () => {
      if (!video.getAttribute('src')) {
        video.src = VIDEO_SRC;
        video.load();
      }
      video.play().catch(() => undefined);
    };

    const ctx = gsap.context(() => {
      gsap.set('[data-door-caption]', { opacity: 1, y: 0 });
      doorTimeline = gsap.timeline({ paused: true })
        .to('[data-door-caption]', { opacity: 0, y: -22, duration: 0.4, ease: 'power1.in' }, 0.55)
        .to('[data-door="left"]', { rotateY: -112, duration: 1.7, ease: 'power2.inOut' }, 0.65)
        .to('[data-door="right"]', { rotateY: 112, duration: 1.7, ease: 'power2.inOut' }, 0.65)
        .to('[data-doors]', { autoAlpha: 0, duration: 0.45 }, 2.05);
    }, root);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!video.ended) playVideo();
      } else {
        video.pause();
      }
    }, { threshold: [0, 0.01] });
    visibilityObserver.observe(root);

    const updateFromScroll = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const scrollable = Math.max(root.offsetHeight - window.innerHeight, 1);
      const scrollProgress = Math.min(Math.max(-rect.top / scrollable, 0), 1);

      const doorProgress = Math.min(scrollProgress / 0.16, 1);
      doorTimeline.progress(doorProgress);

      const textProgress = Math.min(Math.max((scrollProgress - 0.04) / 0.92, 0), 1);
      const sceneIndex = textProgress > 0.01
        ? Math.min(Math.floor(textProgress * hallScenes.length), hallScenes.length - 1)
        : -1;
      setActiveScene((current) => current === sceneIndex ? current : sceneIndex);
    };

    const updateVideoProgress = () => {
      const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : FALLBACK_DURATION;
      const progress = Math.min(video.currentTime / duration, 1);
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateFromScroll);
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    video.addEventListener('loadedmetadata', requestUpdate);
    video.addEventListener('timeupdate', updateVideoProgress);
    requestUpdate();

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      video.removeEventListener('loadedmetadata', requestUpdate);
      video.removeEventListener('timeupdate', updateVideoProgress);
      loadObserver.disconnect();
      visibilityObserver.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      video.pause();
      ctx.revert();
    };
  }, []);

  const activeId = activeScene >= 0 ? hallScenes[activeScene]?.id : null;
  const activeCopy = activeId ? m.hall.scenes[activeId] : null;

  return (
    <section ref={rootRef} aria-label={m.hall.label} className="relative h-[500svh] w-full bg-brown">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-brown">
        <video
        ref={videoRef}
        muted
        playsInline
        preload="none"
        disablePictureInPicture
        controls={false}
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(45,22,14,0.42)_100%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-brown/55 to-transparent" aria-hidden="true" />
      <LightParticles className="z-10" />

      <HallDoors />

      <div data-door-caption className="pointer-events-none absolute inset-x-0 top-1/2 z-30 -translate-y-1/2 px-6 text-center">
        <h2 className="inline-block rounded-2xl bg-ivory/90 px-6 py-3 font-serif text-4xl font-medium leading-tight text-brown md:text-6xl">
          {m.hall.scenes.doors.title}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-base text-brown md:text-lg">
          <span className="rounded-full bg-ivory/90 px-4 py-1">{m.hall.scenes.doors.caption}</span>
        </p>
      </div>

      <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-6 text-center" aria-live="polite">
        <AnimatePresence mode="wait">
          {activeCopy && (
            <motion.div
              key={activeId}
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.04, y: -14 }}
              transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
              className="max-w-xl rounded-[24px] border border-ivory/25 bg-brown/45 px-6 py-5 text-ivory shadow-[0_18px_60px_rgba(25,10,5,0.3)] backdrop-blur-[3px] md:px-10 md:py-7"
            >
              <h2 className="font-serif text-4xl font-medium leading-tight drop-shadow-md md:text-6xl">
                {activeCopy.title}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ivory/95 drop-shadow md:mt-3 md:text-lg">
                {activeCopy.caption}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ol className="absolute right-3 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-2.5 md:right-8" aria-hidden="true">
        {hallScenes.map((scene, index) => (
          <li key={scene.id} className={`h-1.5 w-1.5 rounded-full transition-[background-color,transform] duration-200 ${index === activeScene ? 'scale-150 bg-gold' : 'bg-ivory/60'}`} />
        ))}
      </ol>

      <div className="absolute inset-x-0 bottom-0 z-40 h-[3px] bg-ivory/20" aria-hidden="true">
        <div ref={progressRef} className="h-full origin-left scale-x-0 bg-gold" />
      </div>
      </div>
    </section>
  );
}
