import React from 'react';
import {
  ScanLine,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  Eye,
  Camera,
  Video,
  ArrowRight,
  Activity,
  Car,
  ParkingCircle,
  Receipt,
  ShieldAlert,
} from 'lucide-react';
import { DashboardStats, DetectionRecord } from '../types';
import { AppPage } from '../components/Sidebar';

interface DashboardPageProps {
  stats: DashboardStats;
  onNavigatePage: (page: AppPage) => void;
  onViewRecordDetail: (record: DetectionRecord) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  stats,
  onNavigatePage,
  onViewRecordDetail,
}) => {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold uppercase">
              Operations Center
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Automated License Plate Recognition
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
            ALPR Surveillance & Recognition Dashboard
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Real-time automated number plate recognition monitoring. Process vehicle imagery, stream live video feeds, and log verified registration data into the surveillance database.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigatePage('detect')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition-transform active:scale-95 cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <ScanLine className="w-4 h-4" />
            <span>Detect Plate</span>
          </button>
          <button
            onClick={() => onNavigatePage('live')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs font-mono transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>Live Camera</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards (Section 5 Spec) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Detections */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Total Detections</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white font-mono">
            {stats.totalDetections.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% from last week</span>
          </div>
        </div>

        {/* Plates Detected */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Plates Detected</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            {stats.platesDetected.toLocaleString()}
          </p>
          <span className="text-[11px] font-mono text-slate-500 block">
            Successfully parsed & stored
          </span>
        </div>

        {/* Detection Accuracy */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Detection Accuracy</span>
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            {stats.detectionAccuracy}%
          </p>
          <span className="text-[11px] font-mono text-slate-500 block">
            Mean OCR confidence score
          </span>
        </div>

        {/* Today's Detections */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Today's Detections</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white font-mono">
            {stats.todayDetections.toLocaleString()}
          </p>
          <span className="text-[11px] font-mono text-emerald-400 block">
            Active highway & gate sensors
          </span>
        </div>
      </div>

      {/* Multi-Domain Deployment Modules Showcase (Section 8 Spec) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <h2 className="text-sm sm:text-base font-bold text-white font-mono uppercase tracking-wider">
                Multi-Domain Deployment Modules
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Production-grade integrations across traffic radar, automated gate booms, FASTag tollways, and police stolen hotlists.
            </p>
          </div>
          <span className="text-[11px] font-mono text-amber-400/90 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 font-semibold self-start sm:self-auto">
            4 Operational Systems Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Module 1: Traffic Monitoring & Speed Radar */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 hover:border-sky-500/50 transition-all flex flex-col justify-between space-y-3 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-slate-950 transition-colors">
                  <Car className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30 font-bold">
                  3 Lanes Live
                </span>
              </div>
              <h3 className="text-sm font-bold text-white font-mono">
                Traffic & Speed Radar
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                Multi-lane highway stream simulation with real-time speed radar, speeding violation flags, and CSV export.
              </p>
            </div>
            <button
              onClick={() => onNavigatePage('traffic')}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-sky-500 hover:text-slate-950 text-sky-400 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-800"
            >
              <span>Launch Radar Feed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Module 2: Smart Parking Gate */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-3 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                  <ParkingCircle className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
                  12-Bay Layout
                </span>
              </div>
              <h3 className="text-sm font-bold text-white font-mono">
                Smart Parking Gate
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                Entry/exit booth with animated boom barrier arm, automated ticket printer, bay occupancy layout, and fee billing.
              </p>
            </div>
            <button
              onClick={() => onNavigatePage('parking')}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-amber-400 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-800"
            >
              <span>Simulate Gate Boom</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Module 3: Automated FASTag Toll Plaza */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                  <Receipt className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                  RFID Auto-Debit
                </span>
              </div>
              <h3 className="text-sm font-bold text-white font-mono">
                FASTag Toll Plaza
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                Overhead ANPR camera + RFID simulation that verifies vehicle category, debits balances, and prints slips.
              </p>
            </div>
            <button
              onClick={() => onNavigatePage('toll')}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-800"
            >
              <span>Process Electronic Toll</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Module 4: Law Enforcement Hotlist */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 hover:border-rose-500/50 transition-all flex flex-col justify-between space-y-3 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold animate-pulse">
                  Alert Active
                </span>
              </div>
              <h3 className="text-sm font-bold text-white font-mono">
                Law Enforcement Hotlist
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                Police stolen vehicle database with audio alarm sirens and active dispatch alerts (e.g. matching MH12PK8899).
              </p>
            </div>
            <button
              onClick={() => onNavigatePage('hotlist')}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-rose-600 hover:text-white text-rose-400 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-800"
            >
              <span>Open Hotlist Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* System Pipeline Summary & Live Confidence Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Architecture Flow Strip (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Automated Recognition Pipeline
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Multi-Stage Flow</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span className="text-amber-400 font-bold">1. Sensor Ingestion</span>
              <span>→ High-resolution camera or video stream feed</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span className="text-sky-400 font-bold">2. Edge Gateway</span>
              <span>→ Real-time stream synchronization & sequencing</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span className="text-indigo-400 font-bold">3. Image Normalization</span>
              <span>→ Dynamic lighting, noise reduction & edge enhancement</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span className="text-emerald-400 font-bold">4. Plate Localization</span>
              <span>→ Deep neural network bounding-box extraction</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span className="text-purple-400 font-bold">5. Character OCR Core</span>
              <span>→ High-accuracy alphanumeric pattern parsing</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span className="text-rose-400 font-bold">6. Surveillance Store</span>
              <span>→ Automated indexing & registry compliance</span>
            </div>
          </div>
        </div>

        {/* Right: Confidence Breakdown & Quality Meters (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              OCR Confidence Quality Tier
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">Real-Time Validation</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="text-emerald-400 font-semibold">High Confidence (90%+)</span>
                <span>78.5%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '78.5%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="text-amber-400 font-semibold">Needs Review (70–89%)</span>
                <span>15.4%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '15.4%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="text-rose-400 font-semibold">Low Confidence (&lt;70%)</span>
                <span>6.1%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '6.1%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Detections Table (Section 5 Spec) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Recent Vehicle Surveillance Records
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live records persisted across Image, Video, and Camera surveillance feeds.
            </p>
          </div>

          <button
            onClick={() => onNavigatePage('history')}
            className="flex items-center gap-1 text-xs font-mono text-amber-400 hover:text-amber-300 cursor-pointer"
          >
            <span>View All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[11px] font-mono text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Plate Number</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">View Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/60 font-mono">
              {stats.recentDetections.map((rec) => {
                const dateStr = new Date(rec.timestamp).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                });
                const timeStr = new Date(rec.timestamp).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-white text-slate-950 font-black tracking-wider text-xs shadow-sm">
                        {rec.plateNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {dateStr}, {timeStr}
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        {rec.sourceType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold">
                      <span
                        className={
                          rec.confidence >= 90
                            ? 'text-emerald-400'
                            : rec.confidence >= 70
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }
                      >
                        {rec.confidence.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rec.status === 'detected'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}
                      >
                        {rec.status === 'detected' ? 'Detected' : 'Review'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onViewRecordDetail(rec)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-amber-400" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
