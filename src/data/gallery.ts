import { assets } from './wedding';

export interface GalleryItem {
  id: string;
  /** null = placeholder until the couple supplies the photo */
  src: string | null;
  /** Where the real photo should be placed */
  file: string;
}

export const gallery: GalleryItem[] = [
{ id: 'couple', src: assets.couple, file: '/images/couple-illustration.png' },
{ id: 'photo-2', src: '/wedding-gallery-portrait.png', file: '/wedding-gallery-portrait.png' },
{ id: 'photo-3', src: '/wedding-gallery-seated.png', file: '/wedding-gallery-seated.png' },
{ id: 'photo-4', src: '/wedding-gallery-walking.png', file: '/wedding-gallery-walking.png' }];
