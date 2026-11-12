import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Plus,
  Trash2,
  Bell,
  Search,
  CheckCircle2,
  Car,
  FileText,
  Volume2,
} from 'lucide-react';
import { VehicleRecord } from '../types';
import { sound } from '../utils/soundEffects';

interface HotlistItem {
  plate: string;
  formattedPlate: string;
  vehicleMake: string;
  category: 'STOLEN' | 'WANTED' | 'EXPIRED_INSURANCE' | 'UNPAID_FINES';
  reportedDate: string;
  policeStation: string;
  firNumber: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export const HotlistAlerts: React.FC<{
  currentVehicle?: VehicleRecord;
  soundEnabled: boolean;
}> = ({ currentVehicle, soundEnabled }) => {
  const [hotlist, setHotlist] = useState<HotlistItem[]>([
    {
      plate: 'MH12PK8899',
      formattedPlate: 'MH 12 PK 8899',
      vehicleMake: 'Hyundai i20 (Fiery Red)',
      category: 'STOLEN',
      reportedDate: '2026-10-18',
      policeStation: 'Deccan Gymkhana PS, Pune City',
      firNumber: 'FIR #419/2026 U/S 379 IPC',
      severity: 'CRITICAL',
    },
    {
      plate: 'DL04XY9900',
      formattedPlate: 'DL 04 XY 9900',
      vehicleMake: 'Maruti Suzuki Swift',
      category: 'WANTED',
      reportedDate: '2026-10-25',
      policeStation: 'Connaught Place PS, New Delhi',
      firNumber: 'FIR #812/2026 (Hit & Run Case)',
      severity: 'HIGH',
    },
    {
      plate: 'KA01AB3344',
      formattedPlate: 'KA 01 AB 3344',
      vehicleMake: 'Honda Amaze',
      category: 'UNPAID_FINES',
      reportedDate: '2026-09-12',
      policeStation: 'Traffic Management Centre, Bengaluru',
      firNumber: 'Notice #BLR-8921 (14 Pending Violations)',
      severity: 'MEDIUM',
    },
  ]);

  const [newPlate, setNewPlate] = useState<string>('');
  const [newReason, setNewReason] = useState<string>('');
  const [newCategory, setNewCategory] = useState<HotlistItem['category']>('STOLEN');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const handleAddPlate = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newPlate.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!clean) return;

    const newItem: HotlistItem = {
      plate: clean,
      formattedPlate: clean.length >= 8 ? `${clean.slice(0, 2)} ${clean.slice(2, 4)} ${clean.slice(4, 6)} ${clean.slice(6)}` : clean,
      vehicleMake: 'Flagged Vehicle',
      category: newCategory,
      reportedDate: new Date().toISOString().split('T')[0],
      policeStation: 'Cyber Crime & Transport Control Room',
      firNumber: `FIR #${Math.floor(100 + Math.random() * 900)}/2026`,
      severity: newCategory === 'STOLEN' || newCategory === 'WANTED' ? 'CRITICAL' : 'HIGH',
    };

    setHotlist([newItem, ...hotlist]);
    setNewPlate('');
    setNewReason('');
    setShowAddModal(false);
  };

  const [simulatedMatch, setSimulatedMatch] = useState<string | null>('MH12PK8899');

  const handleTestSiren = () => {
    if (soundEnabled) sound.playAlarm();
  };

  const handleTriggerStolenSim = () => {
    setSimulatedMatch('MH12PK8899');
    if (soundEnabled) sound.playAlarm();
  };

  const isCurrentVehicleHotlisted =
    simulatedMatch === 'MH12PK8899' ||
    (currentVehicle && (currentVehicle.isStolen || currentVehicle.isWanted));

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono text-xs font-semibold uppercase flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              Law Enforcement Hotlist System
            </span>
            <span className="text-xs text-slate-400">National Police ANPR Watchlist</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Stolen & Wanted Vehicle Surveillance Center
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-cross-references scanned license plates against state crime records to trigger immediate intercept alarms.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleTriggerStolenSim}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold cursor-pointer transition-colors shadow-lg shadow-rose-600/30"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Simulate Match (MH12PK8899)</span>
          </button>

          <button
            onClick={handleTestSiren}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 text-xs font-mono font-bold cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Test Siren</span>
          </button>

          <button
            onClick={() => setShowAddModal(!showAddModal)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Plate</span>
          </button>
        </div>
      </div>

      {/* Active Intercept Alert if current scanned vehicle is stolen */}
      {isCurrentVehicleHotlisted && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-600/30 via-rose-900/30 to-slate-950 border-2 border-rose-500 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-600/50">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500 text-white uppercase">
                EMERGENCY INTERCEPT TRIGGERED
              </span>
              <h3 className="text-lg font-black text-white mt-1 font-mono tracking-wide">
                MATCH DETECTED: {currentVehicle?.plateNumber || simulatedMatch || 'MH 12 PK 8899'}
              </h3>
              <p className="text-xs text-rose-300">
                {currentVehicle?.alertReason || 'Reported Stolen at Deccan Gymkhana Police Station (FIR #419/2026 U/S 379 IPC)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-white bg-rose-600 px-3 py-1.5 rounded-lg font-bold">
              POLICE ALERT SENT
            </span>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal / Form */}
      {showAddModal && (
        <form
          onSubmit={handleAddPlate}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-700 space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <Plus className="w-4 h-4 text-rose-400" />
              Add Plate to Crime Watchlist
            </h3>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="text-slate-400 hover:text-white text-xs font-mono"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">
                License Plate
              </label>
              <input
                type="text"
                required
                value={newPlate}
                onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
                placeholder="e.g. MH12PK8899"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs uppercase focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-rose-500 font-mono"
              >
                <option value="STOLEN">Stolen Vehicle</option>
                <option value="WANTED">Wanted / Criminal FIR</option>
                <option value="EXPIRED_INSURANCE">Expired Insurance</option>
                <option value="UNPAID_FINES">Unpaid Traffic Fines</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">
                Incident / Reason
              </label>
              <input
                type="text"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="e.g. Reported missing at Central PS"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Confirm & Broadcast Flag
          </button>
        </form>
      )}

      {/* Hotlist Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            Active Surveillance Watchlist ({hotlist.length} Vehicles)
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Real-time synchronization with CCTNS & RTO
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 font-mono text-[11px] text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Plate Number</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Vehicle Details</th>
                <th className="py-2.5 px-3">Police Station</th>
                <th className="py-2.5 px-3">Case Reference</th>
                <th className="py-2.5 px-3">Date Added</th>
                <th className="py-2.5 px-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950/40 font-mono">
              {hotlist.map((item) => (
                <tr key={item.plate} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-white text-slate-950 font-bold">
                      {item.formattedPlate}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.category === 'STOLEN'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : item.category === 'WANTED'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                      }`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-200">{item.vehicleMake}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-400">{item.policeStation}</td>
                  <td className="py-2.5 px-3 text-amber-300">{item.firNumber}</td>
                  <td className="py-2.5 px-3 text-slate-400">{item.reportedDate}</td>
                  <td className="py-2.5 px-3">
                    <button
                      onClick={() => setHotlist(hotlist.filter((h) => h.plate !== item.plate))}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
