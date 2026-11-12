import { usePage } from '../components/common.jsx';
import privacy from '../legal/privacy-policy.html?raw';
import terms from '../legal/terms-and-conditions.html?raw';
import refund from '../legal/refund-policy.html?raw';

// The policy text lives in src/legal/*.html so it can be edited as plain HTML.
const DOCS = {
  privacy: { html: privacy, title: 'Privacy Policy | Lock and Key Skin Care', description: 'How Lock and Key Skin Care collects, uses and protects your personal and health information.' },
  terms: { html: terms, title: 'Terms & Conditions | Lock and Key Skin Care', description: 'The terms for using the Lock and Key Skin Care app and its online dermatologist consultations.' },
  refund: { html: refund, title: 'Refund Policy | Lock and Key Skin Care', description: 'When the Rs 399 consultation fee is refundable and how to request a refund.' },
};

export default function Legal({ doc }) {
  const d = DOCS[doc];
  usePage(d.title, d.description);
  return (
    <section className="legal">
      <div className="container">
        <div className="legal-card" dangerouslySetInnerHTML={{ __html: d.html }} />
      </div>
    </section>
  );
}
