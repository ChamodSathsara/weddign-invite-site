import React, { useEffect, useState } from 'react';
import { DownloadIcon, FileDownIcon, Loader2Icon, XIcon } from 'lucide-react';
import { useI18n } from '../../contexts/LanguageContext';

const PDF_URL = '/physical-wedding-invitation.pdf';

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function PhysicalInvitationDownload({ guestName }: { guestName: string | null }) {
  const { locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(guestName ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (guestName) setName(guestName);
  }, [guestName]);

  const downloadPersonalized = async () => {
    const cleanName = name.trim().replace(/\s+/g, ' ').slice(0, 80);
    if (!cleanName) {
      setError(locale === 'si' ? 'කරුණාකර නම ඇතුළත් කරන්න.' : 'Please enter a name.');
      return;
    }
    if (!/^[A-Za-z .'-]+$/.test(cleanName)) {
      setError(locale === 'si' ? 'PDF නම සඳහා English අකුරු භාවිතා කරන්න.' : 'Please use English letters for the PDF name.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [{ PDFDocument, StandardFonts, rgb }, response] = await Promise.all([
        import('pdf-lib'),
        fetch(PDF_URL)
      ]);
      if (!response.ok) throw new Error('PDF unavailable');
      const document = await PDFDocument.load(await response.arrayBuffer());
      const page = document.getPages()[0];
      const font = await document.embedFont(StandardFonts.TimesRomanItalic);
      const maxWidth = page.getWidth() - 150;
      let fontSize = 17;
      while (font.widthOfTextAtSize(cleanName, fontSize) > maxWidth && fontSize > 10) fontSize -= 0.5;
      const textWidth = font.widthOfTextAtSize(cleanName, fontSize);

      page.drawText(cleanName, {
        x: (page.getWidth() - textWidth) / 2,
        y: page.getHeight() * 0.39,
        size: fontSize,
        font,
        color: rgb(0.36, 0.23, 0.12)
      });

      const bytes = await document.save();
      const filenameName = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      saveBlob(new Blob([bytes as BlobPart], { type: 'application/pdf' }), `wedding-invitation-${filenameName || 'guest'}.pdf`);
      setOpen(false);
    } catch {
      setError(locale === 'si' ? 'Personalized PDF එක සෑදීමට නොහැකි විය. Original PDF එක download කරන්න.' : 'The personalized PDF could not be created. Please download the original.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => { setError(null); setOpen(true); }}
        className="mt-8 inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-brown px-7 text-[15px] font-medium text-ivory shadow-[0_14px_35px_-16px_rgba(86,51,35,0.75)] transition-[transform,background-color] hover:bg-[#4a2b1e] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <FileDownIcon className="h-5 w-5" aria-hidden="true" />
        {locale === 'si' ? 'Physical Invitation එක Download කරන්න' : 'Download Physical Invitation'}
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brown/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="physical-invitation-title">
          <div className="paper-texture relative w-full max-w-md rounded-[28px] border border-gold bg-champagne p-6 text-left shadow-2xl sm:p-8">
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-brown hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
              <XIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <h2 id="physical-invitation-title" className="pr-10 font-serif text-3xl text-brown">
              {locale === 'si' ? 'ඔබේ නම එක් කරන්න' : 'Add your name'}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-brown-soft">
              {locale === 'si' ? 'Invitation PDF එකේ guest name සඳහා තිබෙන ඉඩට මෙම නම එක් කරනු ලැබේ.' : 'This name will be added to the guest line on the invitation PDF.'}
            </p>
            <label htmlFor="physical-guest-name" className="mt-6 block text-sm font-medium text-brown">
              {locale === 'si' ? 'ආරාධිතයාගේ නම' : 'Guest name'}
            </label>
            <input
              id="physical-guest-name"
              value={name}
              onChange={(event) => { setName(event.target.value); setError(null); }}
              onKeyDown={(event) => { if (event.key === 'Enter' && !loading) void downloadPersonalized(); }}
              autoFocus
              maxLength={80}
              placeholder="Mr. Sahan Arachchige"
              className="mt-2 min-h-[52px] w-full rounded-2xl border border-gold-soft bg-white/85 px-4 text-base text-brown outline-none focus:border-gold focus:ring-2 focus:ring-gold/35"
            />
            {error && <p role="alert" className="mt-2 text-sm text-rose">{error}</p>}
            <button type="button" disabled={loading} onClick={() => void downloadPersonalized()} className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-brown px-6 font-medium text-ivory active:scale-[0.98] disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
              {loading ? <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" /> : <DownloadIcon className="h-4 w-4" aria-hidden="true" />}
              {loading ? (locale === 'si' ? 'සූදානම් කරමින්…' : 'Preparing…') : (locale === 'si' ? 'නම සමඟ Download කරන්න' : 'Download with name')}
            </button>
            <a href={PDF_URL} download="physical-wedding-invitation.pdf" className="mt-3 flex min-h-[46px] items-center justify-center text-sm text-brown-soft underline decoration-gold underline-offset-4 hover:text-brown">
              {locale === 'si' ? 'නමක් නැතිව Original PDF එක Download කරන්න' : 'Download original without a name'}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
