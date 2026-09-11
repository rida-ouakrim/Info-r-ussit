import React from 'react';

export default function LoadingSpinner({ message = "Chargement..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 space-y-3">
      {/* Animated Spinner Ring */}
      <div className="w-10 h-10 rounded-full border-3 border-[#d4ede9] border-t-[#03594e] border-r-[#F8C62F] animate-spin" />

      {/* Simple Clean Text */}
      <p className="text-xs font-extrabold text-[#03594e] tracking-wide">
        {message}
      </p>
    </div>
  );
}
