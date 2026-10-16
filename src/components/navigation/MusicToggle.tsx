import React from 'react';
import { Volume2Icon, VolumeXIcon } from 'lucide-react';
import { useMusic } from '../../contexts/MusicContext';
import { useI18n } from '../../contexts/LanguageContext';

export function MusicToggle({ className = '' }: {className?: string;}) {
  const { muted, started, toggleMute } = useMusic();
  const { m } = useI18n();
  const playing = started && !muted;
  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-pressed={playing}
      aria-label={playing ? m.common.musicOff : m.common.musicOn}
      title={playing ? m.common.musicOff : m.common.musicOn}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold-soft bg-ivory/90 text-brown backdrop-blur-sm transition-[background-color,transform] duration-150 ease-out-soft hover:bg-champagne active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${className}`}>
      
      {playing ? <Volume2Icon className="h-[18px] w-[18px]" aria-hidden="true" /> : <VolumeXIcon className="h-[18px] w-[18px]" aria-hidden="true" />}
    </button>);

}