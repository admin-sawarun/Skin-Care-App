import { Link } from 'react-router-dom';
import { usePage, Cta, PLAY } from '../components/common.jsx';

export default function Features() {
  usePage("Features | Lock and Key Skin Care", "Share photos of your skin concern, get reviewed by a certified dermatologist, chat, video call and receive a written treatment plan, all in one app.");
  return (
    <>
    <section className="page-hero">
        <div className="container">
          <div className="crumbs"><Link to="/">Home</Link> / Features</div>
          <span className="eyebrow">What the app does</span>
          <h1>Everything you need to get your skin <span className="accent">looked at by a doctor</span></h1>
          <p>Lock and Key Skin Care connects you with a certified dermatologist who reviews your case from start to finish, in one app.</p>
        </div>
      </section>
    
        <section id="features">
        <div className="container">
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
        </div>
      </section>
    
        <section id="use">
        <div className="container">
          <div className="showcase">
            <div className="show-img reveal"><img src="/site/onboarding_1.jpg" alt="Healthy skin, happier you: consult expert doctors, get personalised care plans and track your progress" loading="lazy" width="900" height="1350" /></div>
            <div className="show-text reveal">
              <span className="eyebrow">Who it helps</span>
              <h2>Made for anyone who wants a doctor's answer, not guesswork</h2>
              <p>Instead of trying random products or searching symptoms online, get advice from a qualified dermatologist who looks at your actual skin.</p>
              <ul className="checklist">
                <li><svg><use href="#i-check"/></svg>Busy people who can't take time off for a clinic visit</li>
                <li><svg><use href="#i-check"/></svg>People in smaller towns without a dermatologist nearby</li>
                <li><svg><use href="#i-check"/></svg>Anyone who wants a second opinion on a skin problem</li>
                <li><svg><use href="#i-check"/></svg>Anyone who prefers to discuss a skin concern privately</li>
              </ul>
            </div>
          </div>
    
          <div className="showcase reverse">
            <div className="show-img reveal"><img src="/site/onboarding_3.jpg" alt="A dermatologist pointing to a patient's phone showing her skin solution" loading="lazy" width="900" height="1080" /></div>
            <div className="show-text reveal">
              <span className="eyebrow">After your consultation</span>
              <h2>Your treatment plan stays with you</h2>
              <p>Everything from your case is saved in the app, so you can follow your plan and come back to it any time.</p>
              <ul className="checklist">
                <li><svg><use href="#i-check"/></svg>Open your diagnosis and prescription whenever you need it</li>
                <li><svg><use href="#i-check"/></svg>Keep chatting with your doctor about the same case</li>
                <li><svg><use href="#i-check"/></svg>Get notified when your doctor replies or schedules a call</li>
                <li><svg><use href="#i-check"/></svg>Raise a support ticket from the app if anything goes wrong</li>
              </ul>
              <a className="btn btn-primary" href={PLAY} target="_blank" rel="noopener">Start your consultation</a>
            </div>
          </div>
        </div>
      </section>
    
        <section className="conditions">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Common concerns</span>
            <h2>Skin concerns our dermatologists can help with</h2>
            <p>If you're not sure whether your concern fits, submit it and the doctor will guide you.</p>
          </div>
          <div className="chips reveal">
            <span className="chip"><i></i>Acne &amp; pimples</span>
            <span className="chip"><i></i>Acne scars</span>
            <span className="chip"><i></i>Dark spots &amp; pigmentation</span>
            <span className="chip"><i></i>Tanning &amp; uneven tone</span>
            <span className="chip"><i></i>Dry or oily skin</span>
            <span className="chip"><i></i>Rashes &amp; itching</span>
            <span className="chip"><i></i>Eczema</span>
            <span className="chip"><i></i>Fungal infections</span>
            <span className="chip"><i></i>Allergies &amp; redness</span>
            <span className="chip"><i></i>Dandruff &amp; scalp issues</span>
            <span className="chip"><i></i>Hair fall</span>
            <span className="chip"><i></i>Skin care routine advice</span>
          </div>
        </div>
      </section>
    
    <Cta />
    </>
  );
}
