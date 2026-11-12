import { Link } from 'react-router-dom';
import { usePage } from '../components/common.jsx';

export default function ForDoctors() {
  usePage("For Dermatologists | Lock and Key Skin Care", "Dermatologists on Lock and Key Skin Care review patient cases, chat, run video consultations and write treatment plans from one doctor dashboard.");
  return (
    <>
    <section className="page-hero">
        <div className="container">
          <div className="crumbs"><Link to="/">Home</Link> / For Doctors</div>
          <span className="eyebrow">For dermatologists</span>
          <h1>Care for patients online, <span className="accent">from one dashboard</span></h1>
          <p>Lock and Key Skin Care gives dermatologists everything they need to review cases and treat patients remotely, inside the same app.</p>
        </div>
      </section>
    
      <section>
        <div className="container showcase">
          <div className="show-img bottom reveal"><img className="fade-edges" src="/site/doctor_hero.jpg" alt="A smiling dermatologist in a white coat" loading="lazy" width="610" height="1200" style={{ maxHeight: '500px' }} /></div>
          <div className="show-text reveal">
            <span className="eyebrow">The doctor dashboard</span>
            <h2>Our doctors get the tools to care for patients online</h2>
            <p>Dermatologists sign in to a dedicated doctor dashboard inside the Lock and Key Skin Care app.</p>
            <ul className="checklist">
              <li><svg><use href="#i-check"/></svg>See assigned cases with the patient's answers, photos and video</li>
              <li><svg><use href="#i-check"/></svg>Chat with patients and start video consultations</li>
              <li><svg><use href="#i-check"/></svg>Write the diagnosis and treatment plan in the app</li>
              <li><svg><use href="#i-check"/></svg>Manage appointments from one schedule</li>
            </ul>
            <a className="btn btn-primary" href="mailto:admin-sawarun@savarun.in?subject=Join%20as%20a%20dermatologist">Join as a dermatologist</a>
          </div>
        </div>
      </section>
    
      <section className="how">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">How it works for doctors</span>
            <h2>From a new case to a treatment plan</h2>
          </div>
          <div className="steps">
            <div className="step reveal">
              <div className="step-num">1</div>
              <h3>A case is assigned</h3>
              <p>You're notified when a paid case is assigned to you, with the patient's age, gender, answers, photos and video.</p>
            </div>
            <div className="step reveal">
              <div className="step-num">2</div>
              <h3>Review the details</h3>
              <p>Study the case at your own pace and ask the patient follow-up questions in the chat.</p>
            </div>
            <div className="step reveal">
              <div className="step-num">3</div>
              <h3>Consult on video</h3>
              <p>When you need a closer look, start a video consultation with the patient from the app.</p>
            </div>
            <div className="step reveal">
              <div className="step-num">4</div>
              <h3>Send the solution</h3>
              <p>Write your diagnosis and treatment plan. The patient can open it any time in their app.</p>
            </div>
          </div>
        </div>
      </section>
    
      <section>
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Why join</span>
            <h2>Why dermatologists work with us</h2>
          </div>
          <div className="features-grid">
            <div className="feature reveal">
              <div className="ic ic-teal"><svg><use href="#i-home"/></svg></div>
              <h3>Work from anywhere</h3>
              <p>Review cases and consult patients from your phone, around your clinic hours.</p>
            </div>
            <div className="feature reveal">
              <div className="ic ic-green"><svg><use href="#i-heart"/></svg></div>
              <h3>Reach more patients</h3>
              <p>Help people in towns and cities where a dermatologist isn't easy to reach.</p>
            </div>
            <div className="feature reveal">
              <div className="ic ic-amber"><svg><use href="#i-camera"/></svg></div>
              <h3>Complete case details</h3>
              <p>Every case arrives with structured answers, photos and video, so you can start with the full picture.</p>
            </div>
          </div>
        </div>
      </section>
    
      <section style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="band reveal">
            <div>
              <h2>Interested in joining?</h2>
              <p>Email us your name, qualification and medical registration number. Our team will get in touch.</p>
            </div>
            <a className="btn" href="mailto:admin-sawarun@savarun.in?subject=Join%20as%20a%20dermatologist">Email admin-sawarun@savarun.in</a>
          </div>
        </div>
      </section>
    </>
  );
}
