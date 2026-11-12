import React, { useState } from 'react';
import {
  ParkingCircle,
  Car,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Ticket,
  AlertCircle,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface ParkingBay {
  id: string;
  plate?: string;
  owner?: string;
  entryTime?: string;
  occupied: boolean;
}

export const ParkingSimulator: React.FC<{
  currentPlate: string;
  soundEnabled: boolean;
}> = ({ currentPlate, soundEnabled }) => {
  const [bays, setBays] = useState<ParkingBay[]>([
    { id: 'A-1', plate: 'TS 09 AB 1234', owner: 'Vikramaditya Rao', entryTime: '05:30 AM', occupied: true },
    { id: 'A-2', occupied: false },
    { id: 'A-3', occupied: false },
    { id: 'A-4', plate: 'KA 03 MG 7712', owner: 'Arjun Nambiar', entryTime: '05:45 AM', occupied: true },
    { id: 'B-1', occupied: false },
    { id: 'B-2', plate: 'DL 01 CA 4021', owner: 'Sunil Sharma', entryTime: '06:01 AM', occupied: true },
    { id: 'B-3', occupied: false },
    { id: 'B-4', occupied: false },
    { id: 'C-1', occupied: false },
    { id: 'C-2', occupied: false },
    { id: 'C-3', occupied: false },
    { id: 'C-4', occupied: false },
  ]);

  const [inputPlate, setInputPlate] = useState<string>(currentPlate || 'TS09AB1234');
  const [gateArmState, setGateArmState] = useState<'closed' | 'opening' | 'open'>('closed');
  const [lastIssuedTicket, setLastIssuedTicket] = useState<{
    id: string;
    plate: string;
    bay: string;
    time: string;
  } | null>(null);
  const [checkoutReceipt, setCheckoutReceipt] = useState<{
    plate: string;
    duration: string;
    fee: number;
    time: string;
  } | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Ready for vehicle arrival at Entry Barrier 1');

  // Trigger automated parking entry
  const handleEntry = () => {
    const clean = inputPlate.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!clean) return;

    // Check if already in parking
    const existing = bays.find((b) => b.plate?.replace(/[^A-Z0-9]/g, '') === clean);
    if (existing) {
      setStatusMessage(`Vehicle ${clean} is already parked at Bay ${existing.id}`);
      return;
    }

    // Find first vacant bay
    const emptyBayIdx = bays.findIndex((b) => !b.occupied);
    if (emptyBayIdx === -1) {
      setStatusMessage('Parking facility is 100% FULL');
      return;
    }

    // Raise barrier
    if (soundEnabled) {
      sound.playGateMotor();
      sound.playSuccess();
    }
    setGateArmState('opening');
    setStatusMessage(`ANPR Verified Plate [${clean}] • Opening barrier arm...`);

    const allocatedBay = bays[emptyBayIdx].id;
    const ticketId = `PRK-${Math.floor(100000 + Math.random() * 900000)}`;
    const timeStr = new Date().toLocaleTimeString();

    setTimeout(() => {
      setGateArmState('open');
      const updated = [...bays];
      updated[emptyBayIdx] = {
        id: allocatedBay,
        plate: clean.length >= 8 ? `${clean.slice(0, 2)} ${clean.slice(2, 4)} ${clean.slice(4, 6)} ${clean.slice(6)}` : clean,
        entryTime: timeStr,
        occupied: true,
      };
      setBays(updated);
      setLastIssuedTicket({
        id: ticketId,
        plate: clean,
        bay: allocatedBay,
        time: timeStr,
      });
      setCheckoutReceipt(null);
      setStatusMessage(`Vehicle parked in Bay ${allocatedBay}. Gate closing.`);

      setTimeout(() => {
        setGateArmState('closed');
        if (soundEnabled) sound.playGateMotor();
      }, 3500);
    }, 1200);
  };

  // Trigger automated checkout / exit
  const handleExit = (bayId: string) => {
    const bay = bays.find((b) => b.id === bayId);
    if (!bay || !bay.occupied) return;

    if (soundEnabled) {
      sound.playGateMotor();
      sound.playSuccess();
    }
    try {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    } catch {}

    const fee = Math.floor(30 + Math.random() * 40); // ₹30 - ₹70
    setCheckoutReceipt({
      plate: bay.plate || 'UNKNOWN',
      duration: '1 hr 35 mins',
      fee,
      time: new Date().toLocaleTimeString(),
    });
    setLastIssuedTicket(null);

    setBays(bays.map((b) => (b.id === bayId ? { ...b, occupied: false, plate: undefined, entryTime: undefined } : b)));
    setStatusMessage(`Exit processed for ${bay.plate}. Fee collected: ₹${fee}. Gate open.`);
  };

  const occupiedCount = bays.filter((b) => b.occupied).length;
  const vacantCount = bays.length - occupiedCount;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-mono text-xs font-semibold uppercase">
              Automated Facility Management
            </span>
            <span className="text-xs text-slate-400">Barrier Boom Integration</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <ParkingCircle className="w-5 h-5 text-amber-400" />
            Smart ANPR Parking Entry & Exit Gate Automation
          </h2>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Vacant Bays: {vacantCount}
          </span>
          <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Occupied: {occupiedCount}
          </span>
        </div>
      </div>

      {/* Interactive Gate Boom Simulator & Ticket Machine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Animated Barrier & Gate Booth */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-slate-300">
                ENTRY LANE 01 – OPTICAL ANPR BOOM BARRIER
              </span>
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${
                  gateArmState === 'closed'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                BARRIER: {gateArmState.toUpperCase()}
              </span>
            </div>

            {/* Visual Gate Animation Graphic */}
            <div className="relative h-48 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-end px-8 pb-4">
              {/* Traffic Light on Gate Post */}
              <div className="absolute top-4 left-6 flex flex-col gap-1.5 p-1.5 bg-slate-900 rounded-md border border-slate-700">
                <span
                  className={`w-3.5 h-3.5 rounded-full ${
                    gateArmState === 'closed' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-rose-950'
                  }`}
                ></span>
                <span
                  className={`w-3.5 h-3.5 rounded-full ${
                    gateArmState !== 'closed' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-emerald-950'
                  }`}
                ></span>
              </div>

              {/* Gate Base Post */}
              <div className="w-10 h-28 bg-slate-800 border-2 border-slate-700 rounded-t-lg z-10 flex flex-col items-center justify-between py-2">
                <span className="w-4 h-4 rounded-full bg-amber-400"></span>
                <span className="text-[8px] font-mono text-slate-400">BOOM</span>
              </div>

              {/* Red-White Striped Barrier Arm with CSS Pivot Rotation */}
              <div
                style={{
                  transformOrigin: 'left center',
                  transform: gateArmState === 'closed' ? 'rotate(0deg)' : 'rotate(-72deg)',
                  transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                className="h-4 w-72 rounded-r-md border border-slate-700 z-10 ml-1 shadow-lg flex items-center overflow-hidden"
              >
                {/* Diagonal stripes */}
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      'repeating-linear-gradient(45deg, #ef4444, #ef4444 14px, #ffffff 14px, #ffffff 28px)',
                  }}
                ></div>
              </div>

              {/* Vehicle in Queue */}
              <div className="absolute right-8 bottom-4 flex items-center gap-3 bg-slate-900/90 border border-slate-700 p-2.5 rounded-xl shadow-lg">
                <Car className="w-8 h-8 text-amber-400" />
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">Approaching Vehicle</span>
                  <span className="px-2 py-0.5 rounded bg-white text-slate-950 font-mono font-black text-xs">
                    {inputPlate}
                  </span>
                </div>
              </div>
            </div>

            {/* Gate Trigger Input Form */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <input
                type="text"
                value={inputPlate}
                onChange={(e) => setInputPlate(e.target.value.toUpperCase())}
                placeholder="Enter Plate (e.g. TS09AB1234)"
                className="w-full sm:flex-1 px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-500 uppercase tracking-wider"
              />
              <button
                onClick={handleEntry}
                disabled={gateArmState !== 'closed'}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Simulate Vehicle Entry</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              {statusMessage}
            </p>
          </div>

          {/* Ticket Receipt or Checkout Slip */}
          {lastIssuedTicket && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-900 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Ticket className="w-8 h-8 text-amber-400" />
                <div>
                  <span className="text-[10px] text-amber-400 font-mono uppercase font-bold">
                    Automated Ticket Issued: #{lastIssuedTicket.id}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-bold text-white font-mono">
                      {lastIssuedTicket.plate}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      • Assigned Bay: <strong className="text-amber-400">{lastIssuedTicket.bay}</strong>
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-mono">{lastIssuedTicket.time}</span>
            </div>
          )}

          {checkoutReceipt && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <div>
                  <span className="text-[10px] text-emerald-400 font-mono uppercase font-bold">
                    Checkout Paid & Barrier Lifted
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-bold text-white font-mono">
                      {checkoutReceipt.plate}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      • Stay: {checkoutReceipt.duration}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  ₹{checkoutReceipt.fee}.00
                </span>
                <span className="block text-[10px] text-slate-500 font-mono">{checkoutReceipt.time}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): 12-Bay Parking Grid */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-white font-mono uppercase">
                Facility Bay Layout (12 Spots)
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Click occupied bay to checkout</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {bays.map((bay) => (
                <div
                  key={bay.id}
                  onClick={() => bay.occupied && handleExit(bay.id)}
                  className={`p-2.5 rounded-xl border transition-all text-center flex flex-col justify-between min-h-[90px] ${
                    bay.occupied
                      ? 'bg-amber-500/10 border-amber-500/50 hover:border-rose-500 cursor-pointer shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400">{bay.id}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        bay.occupied ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'
                      }`}
                    ></span>
                  </div>

                  {bay.occupied ? (
                    <div className="space-y-0.5 my-1">
                      <span className="text-[10px] font-mono font-bold text-white block truncate">
                        {bay.plate}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 block">{bay.entryTime}</span>
                      <span className="text-[9px] font-mono text-emerald-400 hover:text-rose-400 block font-semibold">
                        [Click Exit]
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-mono text-slate-600 font-semibold my-auto">
                      EMPTY
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
