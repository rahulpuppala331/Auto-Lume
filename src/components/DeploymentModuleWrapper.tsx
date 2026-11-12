import React from 'react';
import {
  Car,
  ParkingCircle,
  Receipt,
  ShieldAlert,
  ArrowRight,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { TrafficMonitor } from './TrafficMonitor';
import { ParkingSimulator } from './ParkingSimulator';
import { TollPlaza } from './TollPlaza';
import { HotlistAlerts } from './HotlistAlerts';
import { VehicleRecord } from '../types';

export type DeploymentModuleId = 'traffic' | 'parking' | 'toll' | 'hotlist';

interface DeploymentModuleWrapperProps {
  currentModule: DeploymentModuleId;
  onChangeModule: (mod: DeploymentModuleId) => void;
  soundEnabled: boolean;
  currentPlate: string;
  currentVehicle?: VehicleRecord;
}

export const DeploymentModuleWrapper: React.FC<DeploymentModuleWrapperProps> = ({
  currentModule,
  onChangeModule,
  soundEnabled,
  currentPlate,
  currentVehicle,
}) => {
  const modules = [
    {
      id: 'traffic' as const,
      name: 'Traffic & Speed Radar',
      subtitle: 'Multi-lane Highway Stream',
      icon: Car,
      badge: 'Radar 80 km/h',
      color: 'sky',
    },
    {
      id: 'parking' as const,
      name: 'Smart Parking Gate',
      subtitle: 'Boom Barrier & 12 Bays',
      icon: ParkingCircle,
      badge: '3/12 Occupied',
      color: 'amber',
    },
    {
      id: 'toll' as const,
      name: 'FASTag Toll Plaza',
      subtitle: 'ANPR + RFID Deductions',
      icon: Receipt,
      badge: '₹85 Auto-Debit',
      color: 'emerald',
    },
    {
      id: 'hotlist' as const,
      name: 'Law Enforcement Hotlist',
      subtitle: 'Stolen Vehicles & Siren',
      icon: ShieldAlert,
      badge: '1 Alert Active',
      color: 'rose',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Section Header */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold uppercase flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-amber-400" />
              Multi-Domain Deployment Modules
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Production Computer Vision Workflows
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
            Intelligent ALPR Multi-Domain Suite
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Real-world industrial ALPR integrations powered by AutoLume's computer vision pipeline: highway speed enforcement, automated boom barrier gate control, electronic FASTag deductions, and national stolen vehicle alert sirens.
          </p>
        </div>

        {/* Quick Current Plate Context Badge */}
        <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono">
          <span className="text-slate-400">Current Plate:</span>
          <span className="px-2 py-0.5 rounded bg-white text-slate-950 font-bold tracking-wider">
            {currentPlate || 'TS09AB1234'}
          </span>
        </div>
      </div>

      {/* Module Selector Navigation Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {modules.map((m) => {
          const Icon = m.icon;
          const isActive = currentModule === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onChangeModule(m.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                isActive
                  ? 'bg-slate-900 border-amber-500/70 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50'
                  : 'bg-slate-950/80 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 group-hover:text-amber-400 group-hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    m.id === 'hotlist'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                      : isActive
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-slate-800/60 text-slate-400 border border-slate-700'
                  }`}
                >
                  {m.badge}
                </span>
              </div>
              <h3 className="text-xs font-bold text-white font-mono tracking-tight">
                {m.name}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                {m.subtitle}
              </p>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Render the Active Deployment Module */}
      <div className="pt-2">
        {currentModule === 'traffic' && <TrafficMonitor soundEnabled={soundEnabled} />}
        {currentModule === 'parking' && (
          <ParkingSimulator currentPlate={currentPlate} soundEnabled={soundEnabled} />
        )}
        {currentModule === 'toll' && (
          <TollPlaza currentPlate={currentPlate} soundEnabled={soundEnabled} />
        )}
        {currentModule === 'hotlist' && (
          <HotlistAlerts currentVehicle={currentVehicle} soundEnabled={soundEnabled} />
        )}
      </div>
    </div>
  );
};
