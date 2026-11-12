import { Link } from 'react-router-dom';
import { usePage, Cta } from '../components/common.jsx';

export default function HowItWorks() {
  usePage("How it Works | Lock and Key Skin Care", "A step-by-step guide to using Lock and Key Skin Care: sign in, describe your skin concern with photos, pay Rs 399 and get a dermatologist's treatment plan.");
  return (
    <>
    <section className="page-hero">
        <div className="container">
          <div className="crumbs"><Link to="/">Home</Link> / How it works</div>
          <span className="eyebrow">Step-by-step guide</span>
          <h1>How to use <span className="accent">Lock and Key Skin Care</span></h1>
          <p>From downloading the app to getting your treatment plan. Submitting a case takes under 3 minutes.</p>
        </div>
      </section>
    
      <section>
        <div className="container">
          <div className="guide">
            <div className="guide-item reveal">
              <div className="step-num">1</div>
              <div>
                <h3>Download the app and sign in</h3>
                <p>Get Lock and Key Skin Care from Google Play and log in with your mobile number. No password needed.</p>
                <ul>
                  <li>Enter your mobile number and the one-time code (OTP) you receive by SMS</li>
                  <li>Add your name, age and gender so the doctor knows who they are treating</li>
                </ul>
              </div>
            </div>
            <div className="guide-item reveal">
              <div className="step-num">2</div>
              <div>
                <h3>Describe your skin concern</h3>
                <p>Tap the <b>+</b> button on the home screen to start a new case.</p>
                <ul>
                  <li>Answer a few short questions about your concern, like how long you've had it and what you've tried</li>
                  <li>Add clear photos of the affected area from the camera or gallery</li>
                  <li>Optionally record or upload a short video</li>
                  <li>Review your answers before you submit</li>
                </ul>
              </div>
            </div>
            <div className="guide-item reveal">
              <div className="step-num">3</div>
              <div>
                <h3>Pay the consultation fee</h3>
                <p>Pay the one-time &#8377;399 dermatologist consultation fee through Razorpay's secure checkout.</p>
                <ul>
                  <li>Pay with UPI, debit or credit card, or netbanking</li>
                  <li>Your case is submitted as soon as the payment succeeds</li>
                  <li>Every payment is saved in your payment history</li>
                </ul>
              </div>
            </div>
            <div className="guide-item reveal">
              <div className="step-num">4</div>
              <div>
                <h3>A dermatologist reviews your case</h3>
                <p>A certified dermatologist is assigned to your case. You'll get a notification when they reply.</p>
                <ul>
                  <li>Chat with your doctor inside the app and answer any follow-up questions</li>
                  <li>The doctor may schedule a video consultation to see your skin more closely</li>
                  <li>Track your case status from <b>My Cases</b></li>
                </ul>
              </div>
            </div>
            <div className="guide-item reveal">
              <div className="step-num">5</div>
              <div>
                <h3>Get your diagnosis and treatment plan</h3>
                <p>Your doctor sends a diagnosis and a written treatment plan or prescription.</p>
                <ul>
                  <li>Open it again any time from your case</li>
                  <li>Keep chatting with your doctor about the same case</li>
                  <li>Need help? Raise a support ticket from your profile</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    
      <section className="how">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Tips</span>
            <h2>Take photos the doctor can use</h2>
            <p>Good photos help your dermatologist give you a more accurate answer.</p>
          </div>
          <div className="tips">
            <div className="tip reveal"><div className="ic ic-amber"><svg><use href="#i-sun"/></svg></div><b>Use daylight</b><span>Stand near a window. Avoid flash and yellow indoor lights.</span></div>
            <div className="tip reveal"><div className="ic ic-teal"><svg><use href="#i-target"/></svg></div><b>Keep it in focus</b><span>Hold the phone steady and tap the screen to focus on the area.</span></div>
            <div className="tip reveal"><div className="ic ic-blue"><svg><use href="#i-camera"/></svg></div><b>Close and wide</b><span>Add one close-up and one photo from a little further away.</span></div>
            <div className="tip reveal"><div className="ic ic-pink"><svg><use href="#i-heart"/></svg></div><b>Clean skin</b><span>Remove makeup, creams and filters before taking the photo.</span></div>
          </div>
        </div>
      </section>
    
    <Cta />
    </>
  );
}
