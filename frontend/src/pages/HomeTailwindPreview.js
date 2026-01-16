import React from "react";

export default function HomeTailwindPreview() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-white">
      {/* Animated Blobs */}
      <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob1" />
      <div className="absolute -bottom-32 -right-32 w-[36rem] h-[36rem] bg-teal-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob2" />
      <div className="absolute top-1/2 left-1/2 w-[28rem] h-[28rem] bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob3" />
      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-3xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-12 flex flex-col items-center border border-blue-100">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4 text-center drop-shadow-lg">Your Health, Our Priority</h1>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-xl">
          Book appointments, connect with doctors online or in-person, and manage your health easily.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition">Login</button>
          <button className="px-8 py-3 rounded-xl border-2 border-blue-600 text-blue-700 font-semibold shadow-lg hover:bg-blue-50 transition">Register</button>
        </div>
        {/* Animated SVG Accents */}
        <svg className="absolute left-8 top-8 w-24 h-24 animate-float-slow" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="28" fill="#e57373" opacity="0.2" />
          <circle cx="32" cy="32" r="16" fill="#f06292" opacity="0.3" />
        </svg>
        <svg className="absolute right-8 bottom-8 w-24 h-24 animate-float-medium" viewBox="0 0 64 64" fill="none">
          <rect x="12" y="24" width="40" height="16" rx="8" fill="#81c784" opacity="0.2" />
          <rect x="24" y="24" width="16" height="16" rx="8" fill="#fff" opacity="0.3" />
        </svg>
        <svg className="absolute left-1/2 top-0 w-20 h-20 animate-float-fast" viewBox="0 0 64 64" fill="none">
          <ellipse cx="32" cy="32" rx="24" ry="8" fill="#ffd600" opacity="0.2" />
        </svg>
      </div>
      {/* Custom Animations */}
      <style>{`
        @keyframes blob1 { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(-40px) scale(1.1);} }
        @keyframes blob2 { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(40px) scale(1.05);} }
        @keyframes blob3 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(-30px,30px) scale(1.08);} }
        .animate-blob1 { animation: blob1 12s infinite ease-in-out; }
        .animate-blob2 { animation: blob2 14s infinite ease-in-out; }
        .animate-blob3 { animation: blob3 16s infinite ease-in-out; }
        @keyframes float-slow { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-16px);} }
        @keyframes float-medium { 0%,100%{transform:translateY(0);} 50%{transform:translateY(16px);} }
        @keyframes float-fast { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-24px);} }
        .animate-float-slow { animation: float-slow 8s infinite ease-in-out; }
        .animate-float-medium { animation: float-medium 6s infinite ease-in-out; }
        .animate-float-fast { animation: float-fast 4s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
