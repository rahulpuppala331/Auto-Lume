import React from 'react';
import {
  Camera,
  Cpu,
  Layers,
  ShieldAlert,
  Car,
  ParkingCircle,
  Receipt,
  FileCode2,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'scanner' | 'pipeline' | 'traffic' | 'parking' | 'toll' | 'hotlist' | 'dossier';
  setActiveTab: (tab: 'scanner' | 'pipeline' | 'traffic' | 'parking' | 'toll' | 'hotlist' | 'dossier') => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  hotlistAlertActive: boolean;
}

interface TabItem {
  id: 'scanner' | 'pipeline' | 'traffic' | 'parking' | 'toll' | 'hotlist' | 'dossier';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  badge?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
  hotlistAlertActive,
}) => {
  const tabs: TabItem[] = [
    { id: 'scanner', label: 'Plate Scanner', icon: Camera },
    { id: 'pipeline', label: 'CV Pipeline Lab', icon: Layers, highlight: true },
    { id: 'traffic', label: 'Traffic Radar', icon: Car },
    { id: 'parking', label: 'Smart Parking', icon: ParkingCircle },
    { id: 'toll', label: 'FASTag Toll', icon: Receipt },
    { id: 'hotlist', label: 'Hotlist / Stolen', icon: ShieldAlert, badge: hotlistAlertActive },
    { id: 'dossier', label: 'Project Dossier', icon: FileCode2 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Top micro bar with system status */}
      <div className="bg-slate-900/80 px-4 py-1 text-xs border-b border-slate-800/80 flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-3 overflow-x-auto py-0.5">
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            AutoLume Core 4.10 Active
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:flex items-center gap-1 text-slate-300 font-mono">
            <Cpu className="w-3.5 h-3.5 text-sky-400" /> OpenCV + YOLOv8 + Tesseract OCR
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">
            Backend API: <span className="text-emerald-400 font-mono">Flask / Node Proxy Online</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {hotlistAlertActive && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 font-mono animate-bounce text-[11px]">
              <ShieldAlert className="w-3 h-3 text-rose-500" />
              HOTLIST VEHICLE ACTIVE
            </span>
          )}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            <span className="text-[11px] font-mono">{soundEnabled ? 'SFX ON' : 'MUTED'}</span>
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="font-mono font-black text-amber-400 text-base tracking-tighter">AL</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white font-['Outfit']">
                Auto<span className="text-amber-400">Lume</span>
              </h1>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                ALPR / ANPR
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Intelligent License Plate Recognition & Computer Vision System
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                )}
                {tab.highlight && !isActive && (
                  <span className="flex items-center gap-0.5 text-[10px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                    <Sparkles className="w-2.5 h-2.5" /> 6-Step
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
