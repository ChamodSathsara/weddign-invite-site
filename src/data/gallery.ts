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
{ id: 'photo-2', src: null, file: '/images/gallery-02.jpg' },
{ id: 'photo-3', src: null, file: '/images/gallery-03.jpg' },
{ id: 'photo-4', src: null, file: '/images/gallery-04.jpg' }];