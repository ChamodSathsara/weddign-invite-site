function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

interface MetaInput {
  title: string;
  description: string;
  image: string;
  locale: 'en' | 'si';
}

/** Client-side metadata. For crawler previews, also set these tags server-side (see docs/BACKEND.md). */
export function applyMeta({ title, description, image, locale }: MetaInput) {
  document.title = title;
  upsertMeta('name', 'description', description);
  upsertMeta('name', 'theme-color', '#FFF9EF');
  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:image', image);
  upsertMeta('property', 'og:locale', locale === 'si' ? 'si_LK' : 'en_US');
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', image);
}