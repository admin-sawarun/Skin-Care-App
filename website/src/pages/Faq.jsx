import { Link } from 'react-router-dom';
import { usePage, Cta } from '../components/common.jsx';

export default function Faq() {
  usePage("FAQ | Lock and Key Skin Care", "Answers to common questions about Lock and Key Skin Care: consultations, doctors, the Rs 399 fee, payments, refunds, privacy and your account.");
  return (
    <>
    <section className="page-hero">
        <div className="container">
          <div className="crumbs"><Link to="/">Home</Link> / FAQ</div>
          <span className="eyebrow">Help centre</span>
          <h1>Frequently asked <span className="accent">questions</span></h1>
          <p>Can't find your answer? Email us at <a href="mailto:admin-sawarun@savarun.in">admin-sawarun@savarun.in</a> or raise a support ticket in the app.</p>
        </div>
      </section>
    
      <section>
        <div className="container">
          <div className="faq-group reveal">
            <h3>About the app</h3>
            <div className="faq-list">
            <details className="reveal">
              <summary>What is Lock and Key Skin Care?<span className="pm"><svg><use href="#i-plus"/></svg></span></summary>
              <div className="answer">It's a mobile app that connects you with certified dermatologists for online skin consultations. You describe your skin concern with photos, a doctor reviews it, and you get a diagnosis and treatment plan without visiting a clinic.</div>
            </details>
            <details className="reveal">
              <summary>Are the doctors real and qualified?<span className="pm"><svg><use href="#i-plus"/></svg></span></summary>
              <div className="answer">Yes. Every case is reviewed by a licensed dermatologist. You can see your doctor's name and profile inside the app once they are assigned to your case.</div>
            </details>
            <details className="reveal">
              <summary>Do you sell skincare products or medicines?<span className="pm"><svg><use href="#i-plus"/></svg></span></summary>
              <div className="answer">No. We provide online medical consultations only. If your doctor recommends a product or medicine, you can buy it from any pharmacy or store you prefer.</div>
            </details>
            <details className="reveal">
              <summary>Is the app available on iPhone?<span className="pm"><svg><use href="#i-plus"/></svg></span></summary>
              <div className="answer">The app is available now on Google Play for Android phones. The iPhone version is coming soon to the App Store.</div>
            </details>
            </div>
          </div>
          <div className="faq-group reveal">
            <h3>Consultations</h3>
            <div className="faq-list">
            <details className="reveal">
              <summary>How do I start a consultation?<span className="pm"><svg><use href="#i-plus"/></svg></span></summary>
              <div className="answer">Download the app from Google Play and log in with your mobile number. Tap the + button, answer the short questions about your concern, add photos or a video, and pay the consultation fee. A dermatologist will then be assigned to your case.</div>
            </details>
            <details className="reveal">
              <summary>How soon will a doctor see my case?<span className="pm"><svg><use href="#i-plus"/></svg></span></summary>
              <div className="answer">A dermatologist is usually assigned soon after your payment, and you'll get a notification when the doctor replies. If no doctor is assigned within 24 hours, your fee is refundable under our Refund Policy.</div>
            </details>
            <details className="reveal">
              <summary>Can I talk to the doctor directly?<span className="pm"><svg><use href="#i-plus"/></svg></span></summary>
              <div className="answer">Yes. You can chat with your doctor inside the app, and the doctor can start a live video consultation when they need to see your skin more closely.</div>
            </details>
            <details className="reveal">
              <summary>Can I use it for a medical emergency?<span className="pm"><svg><use href="#i-plus"/></svg></span></summary>
              <div className="answer">No. Online consultations are not suitable for emergencies such as severe allergic reactions, serious burns or rapidly spreading infections. In an emergency, go to the nearest hospital or call 112.</div>
            </details>
            </div>
          </div>
          <div className="faq-group reveal">
            <h3>Payments &amp; refunds</h3>
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
          </div>
          <div className="faq-group reveal">
            <h3>Privacy &amp; account</h3>
            <div className="faq-list">
            <details className="reveal">
              <summary>Are my photos and details kept private?<span className="pm"><svg><use href="#i-plus"/></svg></span></summary>
              <div className="answer">Yes. Your photos, videos and case details are visible only to you, the doctor assigned to your case and our support team when needed. We do not sell your data. Read our <Link to="/privacy-policy">Privacy Policy</Link> for details.</div>
            </details>
            <details className="reveal">
              <summary>How do I delete my account?<span className="pm"><svg><use href="#i-plus"/></svg></span></summary>
              <div className="answer">You can request account deletion from our <a href="/account-deletion">Delete Account</a> page, without needing to log in to the app.</div>
            </details>
            </div>
          </div>
        </div>
      </section>
    
    <Cta />
    </>
  );
}
