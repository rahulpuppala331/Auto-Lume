import React, { useState } from 'react';
import {
  Receipt,
  Car,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Download,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { TollTransaction } from '../types';
import { sound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

export const TollPlaza: React.FC<{
  currentPlate: string;
  soundEnabled: boolean;
}> = ({ currentPlate, soundEnabled }) => {
  const [plateInput, setPlateInput] = useState<string>(currentPlate || 'TS09AB1234');
  const [vehicleClass, setVehicleClass] = useState<string>('Car / Jeep / Van');
  const [tollAmount, setTollAmount] = useState<number>(85);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [gateOpen, setGateOpen] = useState<boolean>(false);
  const [latestTransaction, setLatestTransaction] = useState<TollTransaction | null>({
    id: 'TX-892104',
    plateNumber: 'TS 09 AB 1234',
    timestamp: '2026-11-01 06:10:15',
    tollPlaza: 'Outer Ring Road (Plaza 4 - Gachibowli)',
    lane: 'Lane 3 (Express FASTag ANPR)',
    vehicleClass: 'Car / Jeep / Van',
    fee: 85,
    fastTagStatus: 'PAID',
    remainingBalance: 1365.0,
  });

  const [transactionHistory, setTransactionHistory] = useState<TollTransaction[]>([
    {
      id: 'TX-892104',
      plateNumber: 'TS 09 AB 1234',
      timestamp: '06:10:15',
      tollPlaza: 'ORR Tollway Plaza 4',
      lane: 'Lane 3',
      vehicleClass: 'Sedan',
      fee: 85,
      fastTagStatus: 'PAID',
      remainingBalance: 1365.0,
    },
    {
      id: 'TX-892098',
      plateNumber: 'DL 01 CA 4021',
      timestamp: '06:08:42',
      tollPlaza: 'ORR Tollway Plaza 4',
      lane: 'Lane 2',
      vehicleClass: 'SUV',
      fee: 110,
      fastTagStatus: 'PAID',
      remainingBalance: 710.0,
    },
    {
      id: 'TX-892085',
      plateNumber: 'KA 03 MG 7712',
      timestamp: '06:05:19',
      tollPlaza: 'ORR Tollway Plaza 4',
      lane: 'Lane 1',
      vehicleClass: 'EV Sedan',
      fee: 85,
      fastTagStatus: 'PAID',
      remainingBalance: 2315.0,
    },
  ]);

  const handleProcessToll = async () => {
    const clean = plateInput.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!clean) return;

    setIsProcessing(true);
    if (soundEnabled) sound.playScanBeep();

    try {
      const res = await fetch('/api/toll/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plateNumber: clean, fee: tollAmount }),
      });
      const data = await res.json();
      if (data.success && data.transaction) {
        setLatestTransaction(data.transaction);
        setTransactionHistory((prev) => [data.transaction, ...prev.slice(0, 20)]);
        setGateOpen(true);
        if (soundEnabled) {
          sound.playSuccess();
          sound.playGateMotor();
        }
        try {
          confetti({ particleCount: 35, spread: 70, origin: { y: 0.6 } });
        } catch {}

        setTimeout(() => {
          setGateOpen(false);
          if (soundEnabled) sound.playGateMotor();
        }, 4000);
      }
    } catch {
      // Offline fallback
      const tx: TollTransaction = {
        id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
        plateNumber: clean.length >= 8 ? `${clean.slice(0, 2)} ${clean.slice(2, 4)} ${clean.slice(4, 6)} ${clean.slice(6)}` : clean,
        timestamp: new Date().toLocaleTimeString(),
        tollPlaza: 'Outer Ring Road (Plaza 4)',
        lane: 'Lane 3 (Express ANPR)',
        vehicleClass,
        fee: tollAmount,
        fastTagStatus: 'PAID',
        remainingBalance: 950.0,
      };
      setLatestTransaction(tx);
      setTransactionHistory((prev) => [tx, ...prev.slice(0, 20)]);
      setGateOpen(true);
      if (soundEnabled) sound.playSuccess();
      setTimeout(() => setGateOpen(false), 3500);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs font-semibold uppercase">
              Electronic Highway Toll Collection
            </span>
            <span className="text-xs text-slate-400">FASTag & ANPR Camera Synchronization</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" />
            Automated FASTag Toll Plaza Simulation
          </h2>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Toll Plaza 04 • Express Lanes 1-4 Online</span>
        </div>
      </div>

      {/* Toll Booth Simulator & Receipt Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Toll Lane Simulator */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-slate-300">
                EXPRESS TOLL LANE 3 • OVERHEAD ANPR SENSOR
              </span>
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${
                  gateOpen
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                GATE: {gateOpen ? 'OPEN (CLEARED)' : 'HOLD (SCANNING)'}
              </span>
            </div>

            {/* Visual Highway Toll Gate */}
            <div className="relative h-44 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between px-6 overflow-hidden">
              {/* Overhead ANPR Camera Rig */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-b-lg bg-slate-900 border-x border-b border-slate-700 flex items-center gap-2 text-[10px] font-mono text-sky-400">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                HIGH-SPEED ANPR STROBE CAMERA
              </div>

              {/* Status Signal */}
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                    gateOpen
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_15px_#10b981]'
                      : 'bg-rose-500 border-rose-400 text-white shadow-[0_0_15px_#f43f5e]'
                  }`}
                >
                  {gateOpen ? 'GO' : 'WAIT'}
                </div>
                <span className="text-[10px] font-mono text-slate-400">LANE 3</span>
              </div>

              {/* Approaching Plate Badge */}
              <div className="flex flex-col items-center gap-2 z-10">
                <span className="text-[10px] text-slate-400 font-mono">Detected Vehicle</span>
                <div className="px-4 py-1.5 rounded-lg bg-white text-slate-950 font-mono font-black text-lg shadow-xl tracking-wider">
                  {plateInput || 'TS09AB1234'}
                </div>
                <span className="text-[10px] font-mono text-emerald-400">
                  FASTag RFID Tag Verified
                </span>
              </div>

              {/* FastTag Scanner Icon */}
              <div className="flex flex-col items-center gap-1">
                <CreditCard className="w-8 h-8 text-amber-400" />
                <span className="text-[10px] font-mono text-slate-400">RFID READER</span>
              </div>
            </div>

            {/* Toll Parameters Form */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">
                  License Plate Number
                </label>
                <input
                  type="text"
                  value={plateInput}
                  onChange={(e) => setPlateInput(e.target.value.toUpperCase())}
                  placeholder="TS09AB1234"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs uppercase focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">
                  Vehicle Category
                </label>
                <select
                  value={vehicleClass}
                  onChange={(e) => {
                    setVehicleClass(e.target.value);
                    if (e.target.value === 'Truck / Bus') setTollAmount(180);
                    else if (e.target.value === 'Heavy Commercial') setTollAmount(275);
                    else setTollAmount(85);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                >
                  <option value="Car / Jeep / Van">Car / Jeep / Van (₹85)</option>
                  <option value="Truck / Bus">Truck / Bus (₹180)</option>
                  <option value="Heavy Commercial">Heavy Commercial (₹275)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">
                  Toll Tariff
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-amber-400 font-mono font-bold text-xs">
                    ₹{tollAmount}.00
                  </div>
                  <button
                    onClick={handleProcessToll}
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Pay</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Toll Transaction History Table */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white font-mono uppercase">
              Recent Electronic Toll Clearance Logs
            </h3>
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left text-xs font-mono text-slate-300">
                <thead className="bg-slate-950 text-[10px] text-slate-400 uppercase">
                  <tr>
                    <th className="py-2 px-3">Tx ID</th>
                    <th className="py-2 px-3">Plate</th>
                    <th className="py-2 px-3">Fee</th>
                    <th className="py-2 px-3">Wallet Bal</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                  {transactionHistory.map((tx) => (
                    <tr key={tx.id}>
                      <td className="py-2 px-3 text-slate-400">{tx.id}</td>
                      <td className="py-2 px-3 font-bold text-white">{tx.plateNumber}</td>
                      <td className="py-2 px-3 text-amber-400">₹{tx.fee}</td>
                      <td className="py-2 px-3 text-slate-300">₹{tx.remainingBalance}</td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          {tx.fastTagStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): High-Security Electronic Receipt Card */}
        <div className="lg:col-span-5 space-y-4">
          {latestTransaction && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase font-mono">
                    FASTag Electronic Toll Slip
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                  CLEARED
                </span>
              </div>

              {/* Receipt Body */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Receipt No:</span>
                    <span className="text-white font-bold">{latestTransaction.id}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Plaza Name:</span>
                    <span className="text-slate-200">{latestTransaction.tollPlaza}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Lane:</span>
                    <span className="text-slate-200">{latestTransaction.lane}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Timestamp:</span>
                    <span className="text-slate-200">{latestTransaction.timestamp}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Registered Vehicle:</span>
                    <span className="text-amber-400 font-bold">{latestTransaction.plateNumber}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Vehicle Class:</span>
                    <span className="text-slate-200">{latestTransaction.vehicleClass}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-slate-950 border border-emerald-500/30 space-y-2">
                  <div className="flex justify-between text-slate-200 text-sm">
                    <span className="font-semibold">Toll Amount Deducted:</span>
                    <span className="text-emerald-400 font-bold">₹{latestTransaction.fee}.00</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px] border-t border-slate-800 pt-1.5">
                    <span>Remaining Wallet Balance:</span>
                    <span className="text-white font-semibold">
                      ₹{latestTransaction.remainingBalance.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Download Electronic Toll Slip Action Button */}
                <button
                  onClick={() => {
                    const content = `=====================================================
         AUTOLUME ALPR - FASTAG ELECTRONIC TOLL SLIP
=====================================================
Receipt Number   : ${latestTransaction.id}
Timestamp        : ${latestTransaction.timestamp}
Toll Plaza       : ${latestTransaction.tollPlaza}
Lane Assigned    : ${latestTransaction.lane}
-----------------------------------------------------
Vehicle Number   : ${latestTransaction.plateNumber}
Vehicle Category : ${latestTransaction.vehicleClass}
Toll Tariff      : ₹${latestTransaction.fee}.00
Payment Status   : PAID (FASTag RFID Electronic Debit)
Remaining Balance: ₹${latestTransaction.remainingBalance.toFixed(2)}
-----------------------------------------------------
Verification     : ANPR Overhead Camera + RFID Sensor
Authority        : National Highways Authority of India (NHAI)
Status           : Barrier Cleared • Green Signal
=====================================================`;
                    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `fasttag_toll_slip_${latestTransaction.id}.txt`;
                    a.click();
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Electronic Toll Slip</span>
                </button>
              </div>

              <div className="pt-2 text-center text-[10px] font-mono text-slate-500">
                National Highways Authority of India (NHAI) • FASTag Electronic Tolling
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
