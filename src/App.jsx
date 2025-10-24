import React from 'react';
import CoverHero from './components/CoverHero';
import RiderAppMock from './components/RiderAppMock';
import AdminSnapshot from './components/AdminSnapshot';

export default function App() {
  return (
    <div className="min-h-screen w-full bg-white text-gray-900 font-inter">
      <CoverHero />
      <main className="mx-auto max-w-6xl px-4 pb-20">
        <header className="py-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">JHD Rider App — Order Bundling & Leaderboard Prototype</h1>
          <p className="mt-2 text-sm text-gray-600">Enterprise-grade, data-driven interface for field riders handling SIM delivery, MNP, and Self-KYC.</p>
        </header>
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <RiderAppMock />
          <AdminSnapshot />
        </section>
      </main>
      <footer className="px-4 py-6 border-t bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-6xl text-xs text-gray-500">Prototype for demo purposes. Data is simulated. Designed with Inter, Lucide icons, and Tailwind.</div>
      </footer>
    </div>
  );
}
