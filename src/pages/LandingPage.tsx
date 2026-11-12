import React from 'react';
import {
  ScanLine,
  LayoutDashboard,
  Cpu,
  Layers,
  Sparkles,
  Database,
  BarChart3,
  Video,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { PRESET_VEHICLES } from '../utils/mockPresets';

interface LandingPageProps {
  onStartDetection: () => void;
  onViewDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartDetection,
  onViewDashboard,
}) => {
  const features = [
    {
      title: 'Precision Plate Detection',
      desc: 'Deep neural object detection tailored for standard, embossed, and international vehicle registration plates.',
      icon: Cpu,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Optical Character Recognition',
      desc: 'Extract alphanumeric registration characters with neural sequence decoding and automatic syntax validation.',
      icon: Layers,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    },
    {
      title: 'Real-Time Processing',
      desc: 'Seamlessly analyze still vehicle imagery, continuous video streams, and live surveillance cameras.',
      icon: Zap,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Surveillance Audit History',
      desc: 'Store, query, filter, and review previous detection logs with high-resolution frame snapshots.',
      icon: CheckCircle2,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Traffic & Fleet Analytics',
      desc: 'Understand detection performance, confidence tiers, daily volume trends, and repeat vehicles.',
      icon: BarChart3,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Secure Database Archive',
      desc: 'Securely store detection metadata, bounding box coordinates, and timestamps in compliant database records.',
      icon: Database,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
  ];

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section (Section 23 Spec) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/30 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered License Plate Recognition</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Outfit'] tracking-tight leading-tight">
              Auto<span className="text-amber-400">Lume</span>
            </h1>

            <p className="text-xl sm:text-2xl font-bold text-slate-200 font-['Outfit']">
              Detect. Recognize. Analyze.
            </p>

            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              Automatically detect and parse vehicle license plates from photos and live video streams using high-speed computer vision and deep learning character recognition.
            </p>

            {/* Action Buttons (Section 23 Spec) */}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <button
                onClick={onStartDetection}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm font-mono shadow-xl shadow-amber-500/25 transition-transform active:scale-95 cursor-pointer"
              >
                <ScanLine className="w-5 h-5" />
                <span>Start Detection</span>
              </button>

              <button
                onClick={onViewDashboard}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm font-mono border border-slate-700 transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-5 h-5 text-amber-400" />
                <span>View Dashboard</span>
              </button>
            </div>
          </div>

          {/* Right Visual Image with License Plate Bounding Box (Section 23 Spec) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-700/80 shadow-2xl p-2 group">
              <img
                src={PRESET_VEHICLES[0].svgDataUrl}
                alt="Vehicle Bounding Box Demo"
                className="w-full h-auto rounded-xl object-contain select-none"
              />

              {/* Bounding Box on Plate */}
              <div
                style={{
                  left: '33%',
                  top: '68%',
                  width: '34%',
                  height: '13%',
                }}
                className="absolute border-2 border-emerald-400 bg-emerald-400/15 pointer-events-none rounded"
              >
                <span className="absolute -top-5 left-0 px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold whitespace-nowrap shadow-md">
                  TS09AB1234 • 96.4%
                </span>
              </div>

              {/* Laser scanline pulse */}
              <div className="absolute inset-x-2 top-2 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#fbbf24]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid (Section 23 Spec) */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            Core Architecture & Capabilities
          </span>
          <h2 className="text-2xl font-bold text-white font-['Outfit']">
            Engineered for High-Speed Computer Vision
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg hover:border-slate-700 transition-all group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${feat.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
