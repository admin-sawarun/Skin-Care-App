import { useEffect } from 'react';

export const PLAY = 'https://play.google.com/store/apps/details?id=com.lockandkey.skincare';
export const EMAIL = 'admin-sawarun@savarun.in';

/** Sets the browser tab title and meta description for the current page. */
export function usePage(title, description) {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.setAttribute('content', description);
  }, [title, description]);
}

export function StoreButtons() {
  return (
    <>
      <a className="btn btn-store" href={PLAY} target="_blank" rel="noopener">
        <svg><use href="#i-play" /></svg>
        <div><small>GET IT ON</small><span>Google Play</span></div>
      </a>
      <span className="btn btn-store disabled" title="Coming soon">
        <svg><use href="#i-apple" /></svg>
        <div><small>COMING SOON ON THE</small><span>App Store</span></div>
      </span>
    </>
  );
}

export function Cta() {
  return (
    <section>
      <div className="container">
        <div className="cta-box reveal">
          <div>
            <h2>Your skin deserves an expert's opinion</h2>
            <p>Download Lock and Key Skin Care and get your skin concern reviewed by a certified dermatologist today.</p>
            <div className="hero-cta">
              <StoreButtons />
            </div>
          </div>
          <div className="cta-logo"><img src="/site/app_logo_mark_white.png" alt="Lock and Key logo" /></div>
        </div>
      </div>
    </section>
  );
}
