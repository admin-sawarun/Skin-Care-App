import { Link } from 'react-router-dom';
import { usePage } from '../components/common.jsx';

export default function Contact() {
  usePage("Contact Us | Lock and Key Skin Care", "Contact the Lock and Key Skin Care team by email or raise a support ticket from inside the app.");
  return (
    <>
    <section className="page-hero">
        <div className="container">
          <div className="crumbs"><Link to="/">Home</Link> / Contact</div>
          <span className="eyebrow">Contact us</span>
          <h1>We're here to <span className="accent">help</span></h1>
          <p>Questions about the app, a payment or your consultation? Reach out and our team will get back to you.</p>
        </div>
      </section>
    
      <section>
        <div className="container">
          <div className="contact-grid">
            <div className="contact-card reveal">
              <div className="ic ic-teal"><svg><use href="#i-mail"/></svg></div>
              <h3>Email us</h3>
              <p>For general questions, partnerships and refunds.</p>
              <a href="mailto:admin-sawarun@savarun.in">admin-sawarun@savarun.in</a>
            </div>
            <div className="contact-card reveal">
              <div className="ic ic-amber"><svg><use href="#i-ticket"/></svg></div>
              <h3>Support ticket in the app</h3>
              <p>Already using the app? Raise a ticket from your profile. It's the fastest way to get help with a case.</p>
              <Link to="/how-it-works">How to use the app</Link>
            </div>
            <div className="contact-card reveal">
              <div className="ic ic-green"><svg><use href="#i-doctor"/></svg></div>
              <h3>Are you a dermatologist?</h3>
              <p>Join our team of doctors and consult patients online.</p>
              <Link to="/for-doctors">Join as a doctor</Link>
            </div>
          </div>
        </div>
      </section>
    
      <section className="how">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Quick links</span>
            <h2>You might be looking for</h2>
          </div>
          <div className="chips reveal">
            <Link className="chip" to="/faq" style={{ textDecoration: 'none' }}><i></i>FAQ</Link>
            <Link className="chip" to="/refund-policy" style={{ textDecoration: 'none' }}><i></i>Refund Policy</Link>
            <Link className="chip" to="/privacy-policy" style={{ textDecoration: 'none' }}><i></i>Privacy Policy</Link>
            <Link className="chip" to="/terms-and-conditions" style={{ textDecoration: 'none' }}><i></i>Terms &amp; Conditions</Link>
            <a className="chip" href="/account-deletion" style={{ textDecoration: 'none' }}><i></i>Delete my account</a>
          </div>
          <p className="center mt-40 reveal" style={{ color: 'var(--muted)' }}>Lock and Key Skin Care is operated by <b>Sawarun Tech Private Limited</b>, India.</p>
        </div>
      </section>
    </>
  );
}
