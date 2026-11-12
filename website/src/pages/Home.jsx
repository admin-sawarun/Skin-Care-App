import { Link } from 'react-router-dom';
import { usePage, Cta, PLAY } from '../components/common.jsx';

export default function Home() {
  usePage("Lock and Key Skin Care | Online Dermatologist Consultation", "Consult a certified dermatologist from your phone. Share photos of your skin concern, chat or video call with the doctor, and get a written treatment plan for a one-time fee of Rs 399.");
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Online dermatologist consultation</span>
            <h1>Expert care for your skin, <span className="accent">right from your phone</span></h1>
            <p className="hero-lead">Share your skin concern with photos, get it reviewed by a certified dermatologist, chat or video call with them, and receive a personal treatment plan. No clinic visit, no waiting room.</p>
            <div className="hero-cta">
              <a className="btn btn-store" href={PLAY} target="_blank" rel="noopener">
                <svg><use href="#i-play"/></svg>
                <div><small>GET IT ON</small><span>Google Play</span></div>
              </a>
              <span className="btn btn-store disabled" title="Coming soon">
                <svg><use href="#i-apple"/></svg>
                <div><small>COMING SOON ON THE</small><span>App Store</span></div>
              </span>
            </div>
            <div className="hero-points">
              <span><svg><use href="#i-check"/></svg>Certified dermatologists</span>
              <span><svg><use href="#i-check"/></svg>One-time fee of &#8377;399</span>
              <span><svg><use href="#i-check"/></svg>Private &amp; secure</span>
            </div>
          </div>
          <div className="hero-visual">
            <img className="hero-img" src="/site/hero_skincare.jpg" alt="A woman with healthy, glowing skin" width="1080" height="1141" />
            <div className="float-card fc-1">
              <div className="ic ic-teal"><svg><use href="#i-video"/></svg></div>
              <div><b>Video consultation</b><small>Talk face to face</small></div>
            </div>
            <div className="float-card fc-2">
              <div className="ic ic-green"><svg><use href="#i-rx"/></svg></div>
              <div><b>Treatment plan</b><small>Written by your doctor</small></div>
            </div>
          </div>
        </div>
      </section>
    
        <section className="trust">
        <div className="container">
          <div className="trust-bar reveal">
            <div className="trust-item"><div className="ic"><svg><use href="#i-doctor"/></svg></div><div><b>Certified doctors</b><small>Licensed dermatologists</small></div></div>
            <div className="trust-item"><div className="ic"><svg><use href="#i-home"/></svg></div><div><b>From home</b><small>No clinic visit needed</small></div></div>
            <div className="trust-item"><div className="ic"><svg><use href="#i-lock"/></svg></div><div><b>Private</b><small>Only your doctor sees your case</small></div></div>
            <div className="trust-item"><div className="ic"><svg><use href="#i-shield"/></svg></div><div><b>Secure payments</b><small>UPI, cards &amp; netbanking</small></div></div>
          </div>
        </div>
      </section>
    
        <section id="features">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">What the app does</span>
            <h2>Everything you need to get your skin <span className="accent">looked at by a doctor</span></h2>
            <p>Lock and Key Skin Care connects you with a dermatologist who reviews your case from start to finish, in one app.</p>
          </div>
          <div className="features-grid">
            <div className="feature reveal">
              <div className="ic ic-teal"><svg><use href="#i-camera"/></svg></div>
              <h3>Share photos &amp; video</h3>
              <p>Answer a few quick questions about your concern and add clear photos or a short video, so the doctor sees exactly what you see.</p>
            </div>
            <div className="feature reveal">
              <div className="ic ic-green"><svg><use href="#i-doctor"/></svg></div>
              <h3>Reviewed by a dermatologist</h3>
              <p>Your case is assigned to a certified dermatologist who studies your answers and photos before giving advice.</p>
            </div>
            <div className="feature reveal">
              <div className="ic ic-blue"><svg><use href="#i-chat"/></svg></div>
              <h3>Chat with your doctor</h3>
              <p>Ask questions and share updates with your doctor through private in-app chat, any time during your case.</p>
            </div>
            <div className="feature reveal">
              <div className="ic ic-pink"><svg><use href="#i-video"/></svg></div>
              <h3>Live video consultation</h3>
              <p>When the doctor needs a closer look, have a face-to-face video call right inside the app.</p>
            </div>
            <div className="feature reveal">
              <div className="ic ic-amber"><svg><use href="#i-rx"/></svg></div>
              <h3>Diagnosis &amp; treatment plan</h3>
              <p>Get a clear diagnosis and a written treatment plan or prescription that you can open again whenever you need it.</p>
            </div>
            <div className="feature reveal">
              <div className="ic ic-violet"><svg><use href="#i-bell"/></svg></div>
              <h3>Track every case</h3>
              <p>See the status of each case, upcoming appointments, notifications, payment history and support tickets in one place.</p>
            </div>
          </div>
          <div className="center mt-40 reveal"><Link className="link-arrow" to="/features">See all features <svg width="18" height="18"><use href="#i-arrow"/></svg></Link></div>
        </div>
      </section>
    
        <section id="how" className="how">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">How it works</span>
            <h2>From concern to treatment plan in <span className="accent">4 simple steps</span></h2>
            <p>Submitting a case takes under 3 minutes.</p>
          </div>
          <div className="steps">
            <div className="step reveal">
              <div className="step-num">1</div>
              <h3>Sign in with your phone</h3>
              <p>Download the app and log in with your mobile number and a one-time code. Add your name, age and gender.</p>
              <span className="tag">Under 1 minute</span>
            </div>
            <div className="step reveal">
              <div className="step-num">2</div>
              <h3>Describe your concern</h3>
              <p>Tap the + button, answer a few short questions about your skin, and add photos or a video.</p>
              <span className="tag">Under 3 minutes</span>
            </div>
            <div className="step reveal">
              <div className="step-num">3</div>
              <h3>Pay &amp; get a doctor</h3>
              <p>Pay the one-time &#8377;399 consultation fee securely. A certified dermatologist is assigned to your case.</p>
              <span className="tag">UPI / Card / Netbanking</span>
            </div>
            <div className="step reveal">
              <div className="step-num">4</div>
              <h3>Get your solution</h3>
              <p>Your doctor reviews the case, chats or video calls with you, and sends your diagnosis and treatment plan.</p>
              <span className="tag">Saved in your app</span>
            </div>
          </div>
          <div className="center mt-40 reveal"><Link className="btn btn-outline" to="/how-it-works">Read the full guide</Link></div>
        </div>
      </section>
    
        <section>
        <div className="container">
          <div className="band reveal">
            <div>
              <h2>One consultation. One simple fee.</h2>
              <p>Doctor's review, diagnosis, treatment plan, chat and video call for your case.</p>
            </div>
            <div className="big">&#8377;399</div>
            <Link className="btn" to="/pricing">See what's included</Link>
          </div>
        </div>
      </section>
    
        <section style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">FAQ</span>
            <h2>Questions people ask first</h2>
          </div>
          <div className="faq-list">
            <details className="reveal">
              <summary>What is Lock and Key Skin Care?<span className="pm"><svg><use href="#i-plus"/></svg></span></summary>
              <div className="answer">It's a mobile app that connects you with certified dermatologists for online skin consultations. You describe your skin concern with photos, a doctor reviews it, and you get a diagnosis and treatment plan without visiting a clinic.</div>
            </details>
            <details className="reveal">
              <summary>How much does a consultation cost?<span className="pm"><svg><use href="#i-plus"/></svg></span></summary>
              <div className="answer">Each case costs a one-time fee of &#8377;399. It covers the doctor's review, diagnosis, written treatment plan, in-app chat and a video consultation for that case. There is no subscription. Downloading the app and signing up are free.</div>
            </details>
            <details className="reveal">
              <summary>Are the doctors real and qualified?<span className="pm"><svg><use href="#i-plus"/></svg></span></summary>
              <div className="answer">Yes. Every case is reviewed by a licensed dermatologist. You can see your doctor's name and profile inside the app once they are assigned to your case.</div>
            </details>
            <details className="reveal">
              <summary>How do I start a consultation?<span className="pm"><svg><use href="#i-plus"/></svg></span></summary>
              <div className="answer">Download the app from Google Play and log in with your mobile number. Tap the + button, answer the short questions about your concern, add photos or a video, and pay the consultation fee. A dermatologist will then be assigned to your case.</div>
            </details>
            <details className="reveal">
              <summary>How soon will a doctor see my case?<span className="pm"><svg><use href="#i-plus"/></svg></span></summary>
              <div className="answer">A dermatologist is usually assigned soon after your payment, and you'll get a notification when the doctor replies. If no doctor is assigned within 24 hours, your fee is refundable under our Refund Policy.</div>
            </details>
          </div>
          <div className="center mt-40 reveal"><Link className="link-arrow" to="/faq">View all questions <svg width="18" height="18"><use href="#i-arrow"/></svg></Link></div>
        </div>
      </section>
    
    <Cta />
    </>
  );
}
