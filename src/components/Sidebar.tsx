import React from 'react';
import {
  LayoutDashboard,
  ScanLine,
  Video,
  History,
  BarChart3,
  Settings,
  Sparkles,
  ShieldCheck,
  X,
  Compass,
  Car,
  ParkingCircle,
  Receipt,
  ShieldAlert,
} from 'lucide-react';

export type AppPage =
  | 'dashboard'
  | 'detect'
  | 'live'
  | 'history'
  | 'analytics'
  | 'settings'
  | 'landing'
  | 'traffic'
  | 'parking'
  | 'toll'
  | 'hotlist';

interface SidebarProps {
  activePage: AppPage;
  setActivePage: (page: AppPage) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  demoMode: boolean;
}

interface NavItem {
  id: AppPage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  badge?: string;
  isAlert?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  isOpenMobile,
  setIsOpenMobile,
  demoMode,
}) => {
  const coreNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'detect', label: 'Detect Plate', icon: ScanLine, highlight: true },
    { id: 'live', label: 'Live Detection', icon: Video },
    { id: 'history', label: 'Detection History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const moduleNavItems: NavItem[] = [
    { id: 'traffic', label: 'Traffic & Speed Radar', icon: Car },
    { id: 'parking', label: 'Smart Parking Gate', icon: ParkingCircle },
    { id: 'toll', label: 'FASTag Toll Plaza', icon: Receipt },
    { id: 'hotlist', label: 'Hotlist & Sirens', icon: ShieldAlert, badge: 'ALERT', isAlert: true },
  ];

  const handleNavClick = (pageId: AppPage) => {
    setActivePage(pageId);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header / Brand */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div
              onClick={() => handleNavClick('landing')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                  <span className="font-mono font-black text-amber-400 text-sm tracking-tighter">AL</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-lg font-extrabold text-white tracking-tight font-['Outfit']">
                    Auto<span className="text-amber-400">Lume</span>
                  </h1>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono tracking-tight">
                  Intelligent ALPR System
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpenMobile(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick System Status Badge */}
          <div className="mt-4 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono">
            <span className="text-slate-400">System Status:</span>
            {demoMode ? (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                DEMO PREVIEW
              </span>
            ) : (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                OPERATIONAL
              </span>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto flex-1">
          <div className="text-[10px] font-mono uppercase text-slate-500 px-3 py-1 font-semibold">
            Platform Navigation
          </div>

          {coreNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.highlight && !isActive && (
                  <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                    <Sparkles className="w-2.5 h-2.5" /> Core
                  </span>
                )}
              </button>
            );
          })}

          {/* Deployment Modules Section */}
          <div className="pt-4 pb-1">
            <div className="text-[10px] font-mono uppercase text-amber-400/90 px-3 py-1 font-bold tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Deployment Modules</span>
            </div>
          </div>

          {moduleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-slate-950'
                        : item.isAlert
                        ? 'text-rose-400'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && !isActive && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                      item.isAlert
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-800/80 mt-3">
            <button
              onClick={() => handleNavClick('landing')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activePage === 'landing'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Compass className="w-4 h-4 text-slate-400" />
              <span>Product Landing</span>
            </button>
          </div>
        </nav>

        {/* Bottom Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>AutoLume AI</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono leading-tight">
              Enterprise ALPR Surveillance
            </p>
            <div className="pt-1 text-[9px] font-mono text-slate-500 flex items-center justify-between">
              <span>Enterprise Core</span>
              <span>v2.4.2</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
