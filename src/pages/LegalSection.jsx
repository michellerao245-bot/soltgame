import React from "react";

export default function LegalSection() {
  return (
    <div className="w-full text-center py-4 text-xs text-gray-500 border-t border-white/10">
      <div className="flex flex-wrap justify-center gap-4">
        <span>Privacy Policy</span>
        <span>Terms & Conditions</span>
        <span>Disclaimer</span>
        <span>Responsible Gaming</span>
      </div>
      <p className="mt-3 text-[10px] text-gray-600">
        18+ Only • Play Responsibly • Crypto gaming involves risk
      </p>
    </div>
  );
}