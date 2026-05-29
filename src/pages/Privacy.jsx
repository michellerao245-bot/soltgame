import React from 'react';

export const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Information Collection</h2>
        <p>We only collect data necessary for blockchain interactions, such as your public wallet address. We do not store your private keys.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Data Usage</h2>
        <p>Your data is used solely for game session tracking, leaderboard updates, and improving your overall experience on our platform.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Security</h2>
        <p>We employ industry-standard encryption to protect your session data. However, as this is a Web3 platform, you are responsible for maintaining the security of your own digital wallet.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Contact Us</h2>
        <p>If you have any questions regarding our privacy practices, please feel free to reach out via our official support channels.</p>
      </section>
    </div>
  );
};