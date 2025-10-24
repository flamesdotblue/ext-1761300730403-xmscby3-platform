import React from 'react';
import Spline from '@splinetool/react-spline';

export default function CoverHero() {
  return (
    <section className="relative w-full" style={{ height: 280 }}>
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/zhZFnwyOYLgqlLWk/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-white/40 to-white pointer-events-none" />
      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">JHD Rider • Enterprise UI</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-gray-900">Faster, Smarter Deliveries with Bundling + Gamification</h2>
          <p className="mt-2 text-sm text-gray-600">Map-first lead discovery, intelligent bundle suggestions, and performance-driven leaderboards — all in a clean, reliable interface.</p>
        </div>
      </div>
    </section>
  );
}
