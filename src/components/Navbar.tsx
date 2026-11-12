import React, { useState, useEffect } from 'react';
import {
  Menu,
  Volume2,
  VolumeX,
  Search,
  Shield,
  Bell,
  Clock,
  CheckCircle2,
  ChevronDown,
  User,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  currentPageTitle: string;
  demoMode: boolean;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileMenu,
  currentPageTitle,
  demoMode,
  soundEnabled,
  setSoundEnabled,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

  // Live real-time clock for surveillance operations
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden text-slate-300 hover:text-white p-1.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white font-['Outfit'] tracking-tight">
                {currentPageTitle}
              </h2>
              {demoMode && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold">
                  DEMO MODE
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              AutoLume – Intelligent License Plate Recognition System
            </p>
          </div>
        </div>

        {/* Center: Quick Search Bar (Enterprise Look) */}
        <div className="hidden xl:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              readOnly
              placeholder="Search vehicle registration, plate number, or alert log..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-12 py-1.5 text-xs text-slate-300 placeholder-slate-500 font-mono focus:border-amber-500/60 outline-none"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
              ⌘K
            </span>
          </div>
        </div>

        {/* Right: Operational Status, Clock, Audio & Operator Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Operational Status Pill (Realistic SaaS) */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-semibold text-[11px]">System Operational</span>
          </div>

          {/* Live Surveillance Time */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-medium tracking-wide">{currentTime || '12:00:00 PM'}</span>
          </div>

          {/* Audio Feedback Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-mono transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute system sound alerts' : 'Enable audio feedback'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer relative"
              title="Recent Activity Alerts"
            >
              <Bell className="w-4 h-4 text-slate-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 text-xs font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <span className="font-bold text-white text-[11px] uppercase tracking-wider">
                    Recent Alerts
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    All Active
                  </span>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-amber-400 font-bold block">Vehicle Scan Complete</span>
                    <span className="text-slate-400 text-[10px]">Plate DL 7CQ 1939 logged with 98.7% accuracy.</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-sky-400 font-bold block">Gate System Online</span>
                    <span className="text-slate-400 text-[10px]">Barrier sensors calibrated and ready.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User / Operator Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold font-mono text-xs shadow-sm">
                OP
              </div>
              <div className="hidden lg:block">
                <span className="text-xs font-bold text-white block leading-tight">
                  Enforcement Unit 04
                </span>
                <span className="text-[10px] font-mono text-slate-400 block leading-tight">
                  Supervisor Role
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 text-xs font-mono">
                <div className="px-3 py-2 border-b border-slate-800 text-slate-400">
                  <span className="font-bold text-white block">Operator #402</span>
                  <span className="text-[10px] text-slate-400">HQ Traffic Security Division</span>
                </div>
                <div className="p-1 space-y-0.5 pt-2">
                  <div className="px-3 py-1.5 rounded-lg text-slate-300 hover:bg-slate-800 cursor-pointer">
                    Security Permissions: Tier 1
                  </div>
                  <div className="px-3 py-1.5 rounded-lg text-slate-300 hover:bg-slate-800 cursor-pointer">
                    Station: Central Terminal
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
