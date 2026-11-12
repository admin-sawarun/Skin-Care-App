import { Link } from 'react-router-dom';
import { usePage, Cta } from '../components/common.jsx';

export default function About() {
  usePage("About Us | Lock and Key Skin Care", "Lock and Key Skin Care is a telemedicine platform by Sawarun Tech Private Limited that connects people with certified dermatologists for online skin consultations.");
  return (
    <>
    <section className="page-hero">
        <div className="container">
          <div className="crumbs"><Link to="/">Home</Link> / About Us</div>
          <span className="eyebrow">About us</span>
          <h1>Making expert skin care <span className="accent">simple and accessible</span></h1>
          <p>Lock and Key Skin Care is a telemedicine platform built to connect people with certified dermatologists for personalised skin consultations, without needing to visit a clinic.</p>
        </div>
      </section>
    
      <section>
        <div className="container showcase">
          <div className="show-img reveal"><img src="/site/onboarding_2.jpg" alt="A dermatologist offering video consultations, trusted care and personalised solutions" loading="lazy" width="900" height="1350" style={{ maxHeight: '540px' }} /></div>
          <div className="show-text reveal">
            <span className="eyebrow">What we do</span>
            <h2>A dermatologist in your pocket</h2>
            <p>Through our app, patients describe their skin concern, share photos or a short video, and are connected with a licensed dermatologist who reviews the case, chats with the patient, and provides a diagnosis and treatment plan. Patients can also have a live video consultation with their doctor when needed.</p>
            <p style={{ color: 'var(--muted)', fontSize: '16.5px', marginBottom: '24px' }}>We provide <b>online medical consultations only</b>. We do not sell skincare products, cosmetics or medicines through this platform.</p>
            <Link className="btn btn-primary" to="/how-it-works">See how it works</Link>
          </div>
        </div>
      </section>
    
      <section className="how">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Our mission</span>
            <h2>Getting a skin concern checked should take minutes, not a trip to a clinic</h2>
            <p>We want expert dermatological care to be simple, private and accessible to everyone.</p>
          </div>
          <div className="values">
            <div className="feature reveal">
              <div className="ic ic-teal"><svg><use href="#i-doctor"/></svg></div>
              <h3>Expert care</h3>
              <p>Every case is reviewed by a licensed dermatologist, not a chatbot or a product seller.</p>
            </div>
            <div className="feature reveal">
              <div className="ic ic-green"><svg><use href="#i-lock"/></svg></div>
              <h3>Privacy first</h3>
              <p>Your photos and health details are shared only with the doctor treating you. We never sell your data.</p>
            </div>
            <div className="feature reveal">
              <div className="ic ic-amber"><svg><use href="#i-rupee"/></svg></div>
              <h3>Honest pricing</h3>
              <p>A single, clear fee of &#8377;399 per case. No subscriptions and no hidden charges.</p>
            </div>
          </div>
        </div>
      </section>
    
      <section>
        <div className="container">
          <div className="band reveal">
            <div>
              <h2>Sawarun Tech Private Limited</h2>
              <p>Lock and Key Skin Care is owned and operated by Sawarun Tech Private Limited, India.</p>
            </div>
            <Link className="btn" to="/contact">Contact us</Link>
          </div>
        </div>
      </section>
    
    <Cta />
    </>
  );
}
