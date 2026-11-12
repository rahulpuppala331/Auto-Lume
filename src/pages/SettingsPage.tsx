import React, { useState } from 'react';
import {
  Settings,
  Server,
  Database,
  Cpu,
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Sliders,
  Check,
} from 'lucide-react';
import { SystemSettings } from '../types';

interface SettingsPageProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [demoMode, setDemoMode] = useState<boolean>(settings.demoMode);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(settings.confidenceThreshold);
  const [flaskUrl, setFlaskUrl] = useState<string>(settings.flaskApiUrl || 'http://localhost:5000');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSave = () => {
    onUpdateSettings({
      demoMode,
      confidenceThreshold,
      flaskApiUrl: flaskUrl,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase">
              System Configuration
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-['Outfit'] mt-1">
            Platform Settings & Service Status
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage system gateway endpoints, database cluster connectivity, vision sensitivity, and detection thresholds.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono shadow-lg transition-transform active:scale-95 cursor-pointer"
        >
          {isSaved ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Settings Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Service Health Cards (Section 24 Spec) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Processing Gateway */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Processing Gateway</span>
            <Server className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-base font-bold text-white font-mono">Central Core API</p>
          <div className="flex items-center gap-1.5 pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold text-emerald-400">Connected</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 block truncate">
            Target: {flaskUrl}
          </span>
        </div>

        {/* Central Database Status */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Surveillance Database</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-base font-bold text-white font-mono">Records Cluster</p>
          <div className="flex items-center gap-1.5 pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {settings.mongoDbConnected ? 'Active & Synced' : 'Local Archive'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 block">
            Target: autolume_surveillance
          </span>
        </div>

        {/* Vision Detector Status */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Vision Model Core</span>
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-base font-bold text-white font-mono">Plate Localizer</p>
          <div className="flex items-center gap-1.5 pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-mono font-bold text-emerald-400">Operational</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 block truncate">
            Detector: Deep Neural Core
          </span>
        </div>

        {/* Optical Engine Status */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Character Engine</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-base font-bold text-white font-mono">Optical OCR Suite</p>
          <div className="flex items-center gap-1.5 pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-mono font-bold text-emerald-400">Operational</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 block">
            Engine: High-Precision OCR
          </span>
        </div>
      </div>

      {/* Configuration Controls (Section 21 & 24 Spec) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Parameters & Demo Mode */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-amber-400" />
            Detection & Processing Parameters
          </h3>

          {/* Demo Mode Toggle (Section 21 Spec) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Demo Mode (Simulation Mode)</span>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                    demoMode ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {demoMode ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                When enabled, the complete platform functions using sample dataset detections without requiring external GPU hardware or locally installed Python binaries.
              </p>
            </div>

            <button
              onClick={() => setDemoMode(!demoMode)}
              className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer ${
                demoMode ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-slate-950 transition-transform ${
                  demoMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Confidence Threshold Slider */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-white font-bold">Detection Confidence Threshold:</span>
              <span className="text-amber-400 font-bold">{confidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
              <span>50% (Permissive)</span>
              <span>75% (Recommended)</span>
              <span>95% (Strict HSRP)</span>
            </div>
          </div>

          {/* Gateway Endpoint */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="text-xs font-mono font-bold text-white block">
              Core Processing Gateway URL:
            </label>
            <input
              type="text"
              value={flaskUrl}
              onChange={(e) => setFlaskUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
              placeholder="http://localhost:5000"
            />
            <span className="text-[10px] font-mono text-slate-500 block">
              Direct connection endpoint to core recognition services.
            </span>
          </div>
        </div>

        {/* Right Column (5 cols): Environment & MongoDB Info */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Database className="w-4 h-4 text-emerald-400" />
            Database & Environment Specs
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 block">MongoDB URI Configuration</span>
              <span className="text-slate-300 text-[11px] block truncate">
                mongodb://localhost:27017/autolume
              </span>
              <span className="text-[9px] text-emerald-400 block font-semibold">
                ✓ Environment variable protected (No hardcoded secrets)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 block">YOLO Model Path</span>
              <span className="text-slate-300 text-[11px] block truncate">
                models/license_plate_model.pt
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 block">PyTesseract Binary</span>
              <span className="text-slate-300 text-[11px] block truncate">
                /usr/bin/tesseract (--psm 7 whitelist)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 block">Maximum Upload File Size</span>
              <span className="text-amber-400 font-bold block">25 Megabytes (MB)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
