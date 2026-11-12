import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  Calendar,
  Layers,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { DetectionRecord } from '../types';

interface HistoryPageProps {
  detections: DetectionRecord[];
  onViewRecordDetail: (record: DetectionRecord) => void;
  onDeleteRecord: (id: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  detections,
  onViewRecordDetail,
  onDeleteRecord,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'image' | 'video' | 'camera'>('all');
  const [confidenceFilter, setConfidenceFilter] = useState<'all' | 'high' | 'review' | 'low'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'detected' | 'review'>('all');

  // Filtered collection
  const filtered = detections.filter((item) => {
    // Search query
    if (searchQuery) {
      const q = searchQuery.toUpperCase();
      const matchPlate = item.plateNumber.toUpperCase().includes(q);
      const matchOwner = (item.vehicleMetadata?.ownerName || '').toUpperCase().includes(q);
      if (!matchPlate && !matchOwner) return false;
    }

    // Source filter
    if (sourceFilter !== 'all' && item.sourceType !== sourceFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }

    // Confidence filter
    if (confidenceFilter === 'high' && item.confidence < 90) return false;
    if (confidenceFilter === 'review' && (item.confidence < 70 || item.confidence >= 90)) return false;
    if (confidenceFilter === 'low' && item.confidence >= 70) return false;

    return true;
  });

  const exportCsv = () => {
    const headers = 'ID,PlateNumber,Confidence,SourceType,Status,Timestamp,ProcessingTime_sec\n';
    const rows = filtered
      .map(
        (d) =>
          `"${d.id}","${d.plateNumber}",${d.confidence},"${d.sourceType}","${d.status}","${d.timestamp}",${d.processingTime}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autolume_detections_history_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            <span className="text-xs font-mono font-bold text-sky-400 uppercase">
              Persistent Records Database
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-['Outfit'] mt-1">
            Detection History & Surveillance Archive
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Query, filter, and inspect previously detected vehicle number plates stored in the surveillance registry.
          </p>
        </div>

        <button
          onClick={exportCsv}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs font-mono border border-slate-700 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar (Section 14 Spec) */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plate number (e.g. TS09)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-500 uppercase"
          />
        </div>

        {/* Filter Selectors */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Sources</option>
            <option value="image">Image Only</option>
            <option value="video">Video Only</option>
            <option value="camera">Live Camera</option>
          </select>

          {/* Confidence Filter */}
          <select
            value={confidenceFilter}
            onChange={(e) => setConfidenceFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Confidences</option>
            <option value="high">High Confidence (≥90%)</option>
            <option value="review">Needs Review (70–89%)</option>
            <option value="low">Low Confidence (&lt;70%)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Statuses</option>
            <option value="detected">Detected</option>
            <option value="review">Review Required</option>
          </select>
        </div>
      </div>

      {/* Detections Data Table (Section 14 Spec) */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>
            Showing <strong className="text-white">{filtered.length}</strong> of{' '}
            <strong className="text-white">{detections.length}</strong> recorded detections
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-slate-950 text-[11px] uppercase border-b border-slate-800 text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Plate Number</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Time</th>
                <th className="py-3.5 px-4">Source</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500 text-xs">
                    No detections match the selected query and filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const dateStr = new Date(item.timestamp).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  });
                  const timeStr = new Date(item.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded bg-white text-slate-950 font-black tracking-wider shadow-sm">
                          {item.plateNumber}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{dateStr}</td>
                      <td className="py-3 px-4 text-slate-400">{timeStr}</td>
                      <td className="py-3 px-4 capitalize">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                          {item.sourceType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold">
                        <span
                          className={
                            item.confidence >= 90
                              ? 'text-emerald-400'
                              : item.confidence >= 70
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }
                        >
                          {item.confidence.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'detected'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          }`}
                        >
                          {item.status === 'detected' ? 'Detected' : 'Review'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onViewRecordDetail(item)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                            title="View Detection Details"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-400" />
                          </button>
                          <button
                            onClick={() => onDeleteRecord(item.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete from MongoDB"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
