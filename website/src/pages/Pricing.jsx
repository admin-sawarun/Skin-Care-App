import { Link } from 'react-router-dom';
import { usePage, Cta, PLAY } from '../components/common.jsx';

export default function Pricing() {
  usePage("Pricing | Lock and Key Skin Care", "A one-time fee of Rs 399 per case covers a certified dermatologist review, diagnosis, treatment plan, in-app chat and a video consultation.");
  return (
    <>
    <section className="page-hero">
        <div className="container">
          <div className="crumbs"><Link to="/">Home</Link> / Pricing</div>
          <span className="eyebrow">Simple pricing</span>
          <h1>&#8377;399 per case. <span className="accent">No subscription.</span></h1>
          <p>Downloading the app and creating an account are free. You pay only when you submit a skin concern to a doctor.</p>
        </div>
      </section>
    
        <section id="pricing">
        <div className="container pricing-wrap">
          <div className="price-card reveal">
            <div className="label">Dermatologist consultation</div>
            <div className="price">&#8377;399 <small>per case</small></div>
            <p>One-time professional consultation fee. Not a subscription, no hidden charges.</p>
            <ul>
              <li><svg><use href="#i-check"/></svg>Case review by a certified dermatologist</li>
              <li><svg><use href="#i-check"/></svg>Diagnosis and written treatment plan</li>
              <li><svg><use href="#i-check"/></svg>Private in-app chat with your doctor</li>
              <li><svg><use href="#i-check"/></svg>Live video consultation for that case</li>
            </ul>
            <a className="btn" href={PLAY} target="_blank" rel="noopener">Download &amp; consult now</a>
            <p className="price-note">Refund rules are explained in our <Link to="/refund-policy">Refund Policy</Link>.</p>
          </div>
          <div className="pay-info reveal">
            <span className="eyebrow">Simple pricing</span>
            <h2>Pay once per case. That's it.</h2>
            <p>You pay only when you submit a skin concern. Downloading the app and creating an account are free.</p>
            <div className="pay-points">
              <div className="pay-point"><div className="ic ic-teal"><svg><use href="#i-shield"/></svg></div><div><b>Secure checkout by Razorpay</b><span>Pay with UPI, debit or credit card, or netbanking.</span></div></div>
              <div className="pay-point"><div className="ic ic-amber"><svg><use href="#i-refund"/></svg></div><div><b>Fair refunds</b><span>Refunded if payment fails to create your case, if no doctor is assigned within 24 hours, or if you're charged twice.</span></div></div>
              <div className="pay-point"><div className="ic ic-blue"><svg><use href="#i-rupee"/></svg></div><div><b>Full payment history</b><span>Every payment is listed in the app with its date and case.</span></div></div>
            </div>
          </div>
        </div>
      </section>
    
      <section className="how">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Payment questions</span>
            <h2>About payments and refunds</h2>
          </div>
          <div className="faq-list">
            <details className="reveal">
              <summary>How much does a consultation cost?<span className="pm"><svg><use href="#i-plus"/></svg></span></summary>
              <div className="answer">Each case costs a one-time fee of &#8377;399. It covers the doctor's review, diagnosis, written treatment plan, in-app chat and a video consultation for that case. There is no subscription. Downloading the app and signing up are free.</div>
            </details>
            <details className="reveal">
              <summary>Which payment methods are accepted?<span className="pm"><svg><use href="#i-plus"/></svg></span></summary>
              <div className="answer">Payments are processed securely by Razorpay. You can pay with UPI apps (Google Pay, PhonePe, Paytm and others), debit or credit cards, or netbanking.</div>
            </details>
            <details className="reveal">
              <summary>Can I get a refund?<span className="pm"><svg><use href="#i-plus"/></svg></span></summary>
              <div className="answer">Yes, if your payment was taken but the case wasn't created, if no doctor was assigned within 24 hours, or if you were charged twice. Once a doctor has reviewed your case, the fee is not refundable. Request a refund within 7 days by email or a support ticket in the app. See the full <Link to="/refund-policy">Refund Policy</Link>.</div>
            </details>
          </div>
          <p className="center mt-40 reveal" style={{ color: 'var(--muted)' }}>Read the full <Link to="/refund-policy">Refund Policy</Link> for all the details.</p>
        </div>
      </section>
    
    <Cta />
    </>
  );
}
