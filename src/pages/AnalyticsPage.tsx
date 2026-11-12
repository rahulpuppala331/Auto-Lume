import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  Layers,
  Car,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AnalyticsData } from '../types';

interface AnalyticsPageProps {
  analytics: AnalyticsData;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ analytics }) => {
  const maxTrendCount = Math.max(...analytics.dailyTrends.map((d) => d.count), 220);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase">
              Performance Intelligence
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-['Outfit'] mt-1">
            Detection Analytics & System Telemetry
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistical breakdown of ALPR accuracy, daily detection volumes, confidence distributions, and frequently scanned vehicles.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Calendar className="w-4 h-4 text-sky-400" />
          <span>Last 7 Days (Telemetry Window)</span>
        </div>
      </div>

      {/* KPI Cards (Section 16 Spec) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-mono text-slate-400">Total Detections</span>
          <p className="text-2xl sm:text-3xl font-black text-white font-mono">
            {analytics.totalDetections.toLocaleString()}
          </p>
          <span className="text-[10px] font-mono text-emerald-400 block">+14% vs prior week</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-mono text-slate-400">Detection Success Rate</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            {analytics.detectionSuccessRate}%
          </p>
          <span className="text-[10px] font-mono text-slate-500 block">Validated via HSRP regex</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-mono text-slate-400">Average Confidence</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            {analytics.averageConfidence}%
          </p>
          <span className="text-[10px] font-mono text-slate-500 block">Mean OCR recognition score</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-mono text-slate-400">Image vs Video</span>
          <div className="flex items-center gap-2 text-sm font-bold font-mono text-white mt-1">
            <span className="text-sky-400">{analytics.imageCount} Img</span>
            <span className="text-slate-600">/</span>
            <span className="text-purple-400">{analytics.videoCount} Vid</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 block">Active inputs breakdown</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Daily Detection Count Bar Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Detection Trends (Mon – Sun)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Daily volume processed across all lanes.</p>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold">Peak: 210 plates</span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {analytics.dailyTrends.map((d) => {
              const heightPct = Math.round((d.count / maxTrendCount) * 100);
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.count}
                  </span>
                  <div className="w-full max-w-[42px] bg-slate-950 rounded-t-lg overflow-hidden flex items-end h-full">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-md group-hover:from-amber-500 group-hover:to-amber-300 transition-all duration-300"
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-300 mt-1">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Confidence Threshold Buckets (5 cols) (Section 16 Spec) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <PieChart className="w-4 h-4 text-sky-400" />
              Confidence Distribution
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Quality Tiers</span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1.5">
              <div className="flex justify-between items-center text-slate-200">
                <span className="flex items-center gap-2 font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  High Confidence (90%+)
                </span>
                <span className="font-bold text-white">{analytics.confidenceBuckets.high} Detections</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Near 100% precision. Direct automated gate/toll clearance without manual intervention.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1.5">
              <div className="flex justify-between items-center text-slate-200">
                <span className="flex items-center gap-2 font-bold text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Needs Review (70–89%)
                </span>
                <span className="font-bold text-white">{analytics.confidenceBuckets.review} Detections</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Oblique camera angle, water droplet streaks or custom license plate fonts flagged for review.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/30 space-y-1.5">
              <div className="flex justify-between items-center text-slate-200">
                <span className="flex items-center gap-2 font-bold text-rose-400">
                  <Clock className="w-3.5 h-3.5" />
                  Low Confidence (&lt;70%)
                </span>
                <span className="font-bold text-white">{analytics.confidenceBuckets.low} Detections</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Severe occlusion, extreme darkness or mud spatter requiring manual entry confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Detected Plates Table (Section 16 Spec) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Car className="w-4 h-4 text-amber-400" />
            Frequently Detected Plates (Top Repeat Vehicles)
          </h3>
          <span className="text-xs font-mono text-slate-400">Automated Vehicle Frequency Log</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-slate-950 text-[11px] uppercase border-b border-slate-800 text-slate-400">
              <tr>
                <th className="py-3 px-4">Plate Number</th>
                <th className="py-3 px-4">Total Frequency Count</th>
                <th className="py-3 px-4">Last Seen Time</th>
                <th className="py-3 px-4">Registry Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950/60">
              {analytics.topPlates.map((item, i) => (
                <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded bg-white text-slate-950 font-black">
                      {item.plateNumber}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">{item.count} detections</td>
                  <td className="py-3 px-4 text-slate-400">{item.lastSeen}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'detected'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {item.status === 'detected' ? 'Frequent Commuter' : 'Review Required'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
