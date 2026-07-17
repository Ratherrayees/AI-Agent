'use client';

import React from 'react';

export function WhatsAppWidget() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '15550199999';
  const message = encodeURIComponent("Hello! I have an enquiry regarding Ru'a AI Real Estate Assistant.");
  const url = `https://wa.me/${number}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 group cursor-pointer border border-white/10"
      aria-label="Contact us on WhatsApp"
    >
      {/* WhatsApp SVG Icon */}
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-7 h-7 transition-transform duration-300 group-hover:rotate-12"
      >
        <path d="M12.031 2c-5.514 0-9.99 4.476-9.99 9.99 0 1.758.455 3.479 1.32 5.004L2 22l5.136-1.325a9.92 9.92 0 0 0 4.895 1.28c5.514 0 9.99-4.476 9.99-9.99C22.021 6.476 17.545 2 12.031 2zm0 18.286c-1.636 0-3.238-.433-4.636-1.253l-.332-.196-3.055.788.802-2.93-.215-.342A8.257 8.257 0 0 1 3.714 12c0-4.57 3.733-8.286 8.317-8.286 4.584 0 8.317 3.716 8.317 8.286s-3.733 8.286-8.317 8.286zm4.567-6.223c-.25-.124-1.477-.728-1.704-.81-.228-.08-.393-.124-.558.124-.165.25-.638.81-.78 1.026-.144.216-.287.243-.537.12a6.764 6.764 0 0 1-1.993-1.229 7.452 7.452 0 0 1-1.38-1.717c-.15-.25-.016-.385.109-.508.113-.11.25-.292.375-.438.124-.145.166-.25.25-.415.083-.166.042-.31-.02-.435-.063-.125-.558-1.348-.765-1.846-.201-.486-.406-.42-.558-.428-.145-.008-.31-.01-.476-.01a.916.916 0 0 0-.662.307c-.228.25-.87.85-.87 2.075s.89 2.406.99 2.541c.1.135 1.752 2.674 4.244 3.748.592.256 1.055.409 1.414.523.595.19 1.137.163 1.564.1.476-.07 1.477-.602 1.684-1.183.208-.58.208-1.078.145-1.183-.063-.105-.228-.166-.477-.29z" />
      </svg>
      
      {/* Tooltip */}
      <span className="absolute right-16 scale-0 transition-all duration-300 origin-right group-hover:scale-100 bg-[#060612]/95 border border-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-md">
        Chat on WhatsApp
      </span>
    </a>
  );
}
