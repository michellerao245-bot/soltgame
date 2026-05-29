import React from 'react';

export const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
        <p>By accessing this platform, you agree to be bound by these terms. If you do not agree, please refrain from using our services.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. User Eligibility</h2>
        <p>You must be of legal age in your jurisdiction to participate in any gaming activities on this platform.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Risk Disclaimer</h2>
        <p>Participation in Web3 gaming involves risk. You acknowledge that you are responsible for your own blockchain transactions and wallet security.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Privacy Policy</h2>
        <p>Your use of the platform is also governed by our <a href="/privacy" className="text-primary-color underline">Privacy Policy</a>.</p>
      </section>
    </div>
  );
};