import React, { useState, useEffect } from 'react';
import {
  Car,
  Gauge,
  AlertTriangle,
  ShieldAlert,
  Play,
  Pause,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface TrafficEvent {
  id: string;
  timestamp: string;
  lane: number;
  plate: string;
  formattedPlate: string;
  vehicleMake: string;
  speedKmH: number;
  isSpeeding: boolean;
  isStolen: boolean;
  confidence: number;
}

const VEHICLE_POOL = [
  { plate: 'TS09AB1234', formatted: 'TS 09 AB 1234', make: 'Honda City', stolen: false },
  { plate: 'DL01CA4021', formatted: 'DL 01 CA 4021', make: 'Tata Harrier', stolen: false },
  { plate: 'MH12PK8899', formatted: 'MH 12 PK 8899', make: 'Hyundai i20', stolen: true },
  { plate: 'KA03MG7712', formatted: 'KA 03 MG 7712', make: 'Tata Nexon EV', stolen: false },
  { plate: 'CA7XYZ892', formatted: '7XYZ892', make: 'Ford Mustang', stolen: false },
  { plate: 'B1234AB', formatted: 'B 1234 AB', make: 'VW Golf', stolen: false },
  { plate: 'AP28BK5050', formatted: 'AP 28 BK 5050', make: 'Toyota Innova', stolen: false },
  { plate: 'TN07DE9988', formatted: 'TN 07 DE 9988', make: 'Maruti Brezza', stolen: false },
];

export const TrafficMonitor: React.FC<{ soundEnabled: boolean }> = ({ soundEnabled }) => {
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [speedLimit, setSpeedLimit] = useState<number>(80);
  const [filterType, setFilterType] = useState<'all' | 'speeding' | 'stolen'>('all');
  const [trafficFeed, setTrafficFeed] = useState<TrafficEvent[]>([
    {
      id: 'EV-101',
      timestamp: '06:04:12',
      lane: 2,
      plate: 'TS09AB1234',
      formattedPlate: 'TS 09 AB 1234',
      vehicleMake: 'Honda City',
      speedKmH: 74,
      isSpeeding: false,
      isStolen: false,
      confidence: 0.96,
    },
    {
      id: 'EV-102',
      timestamp: '06:05:30',
      lane: 1,
      plate: 'MH12PK8899',
      formattedPlate: 'MH 12 PK 8899',
      vehicleMake: 'Hyundai i20',
      speedKmH: 94,
      isSpeeding: true,
      isStolen: true,
      confidence: 0.94,
    },
    {
      id: 'EV-103',
      timestamp: '06:06:55',
      lane: 3,
      plate: 'DL01CA4021',
      formattedPlate: 'DL 01 CA 4021',
      vehicleMake: 'Tata Harrier',
      speedKmH: 78,
      isSpeeding: false,
      isStolen: false,
      confidence: 0.97,
    },
  ]);

  // Traffic stream simulation timer
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const v = VEHICLE_POOL[Math.floor(Math.random() * VEHICLE_POOL.length)];
      const lane = Math.floor(Math.random() * 3) + 1;
      const speed = Math.floor(55 + Math.random() * 45); // 55 to 100 km/h
      const isSpeeding = speed > speedLimit;

      const newEvent: TrafficEvent = {
        id: `EV-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toLocaleTimeString(),
        lane,
        plate: v.plate,
        formattedPlate: v.formatted,
        vehicleMake: v.make,
        speedKmH: speed,
        isSpeeding,
        isStolen: v.stolen,
        confidence: Number((0.92 + Math.random() * 0.07).toFixed(2)),
      };

      if (v.stolen && soundEnabled) {
        sound.playAlarm();
      } else if (isSpeeding && soundEnabled) {
        sound.playScanBeep();
      }

      setTrafficFeed((prev) => [newEvent, ...prev.slice(0, 40)]);
    }, 4200);

    return () => clearInterval(interval);
  }, [isRunning, speedLimit, soundEnabled]);

  const filteredFeed = trafficFeed.filter((item) => {
    if (filterType === 'speeding') return item.isSpeeding;
    if (filterType === 'stolen') return item.isStolen;
    return true;
  });

  const exportCsv = () => {
    const headers = 'ID,Timestamp,Lane,Plate,Vehicle,Speed_kmh,Is_Speeding,Is_Stolen,Confidence\n';
    const rows = trafficFeed
      .map(
        (f) =>
          `${f.id},${f.timestamp},Lane ${f.lane},${f.plate},${f.vehicleMake},${f.speedKmH},${f.isSpeeding},${f.isStolen},${f.confidence}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autolume_traffic_log_${Date.now()}.csv`;
    a.click();
  };

  const totalScanned = trafficFeed.length;
  const totalSpeeding = trafficFeed.filter((t) => t.isSpeeding).length;
  const totalStolen = trafficFeed.filter((t) => t.isStolen).length;
  const avgSpeed = Math.round(
    trafficFeed.reduce((acc, cur) => acc + cur.speedKmH, 0) / (trafficFeed.length || 1)
  );

  return (
    <div className="space-y-6">
      {/* Top Telemetry & Controls */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-mono text-xs font-semibold uppercase">
              Highway Surveillance System
            </span>
            <span className="text-xs text-slate-400">ANPR High-Speed Radar Fusion</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <Car className="w-5 h-5 text-amber-400" />
            Live Highway Traffic Monitoring & Radar Camera
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              isRunning
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-500 text-slate-950 font-bold'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause Feed
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Resume Feed
              </>
            )}
          </button>

          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-mono">Vehicles Captured</span>
          <p className="text-2xl font-bold text-white font-mono mt-1">{totalScanned}</p>
          <span className="text-[10px] text-emerald-400 font-mono">100% OCR Accuracy</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-mono">Speed Limit Set</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-amber-400 font-mono">{speedLimit}</span>
            <span className="text-xs text-slate-400 font-mono">km/h</span>
          </div>
          <input
            type="range"
            min="60"
            max="120"
            step="10"
            value={speedLimit}
            onChange={(e) => setSpeedLimit(parseInt(e.target.value, 10))}
            className="w-full accent-amber-500 h-1 bg-slate-800 rounded-lg mt-1"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-mono">Speed Violations</span>
          <p className="text-2xl font-bold text-rose-400 font-mono mt-1">{totalSpeeding}</p>
          <span className="text-[10px] text-rose-500 font-mono">Challan / Fine Triggered</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-mono">Hotlist / Stolen Flags</span>
          <p className="text-2xl font-bold text-rose-500 font-mono mt-1">{totalStolen}</p>
          <span className="text-[10px] text-slate-400 font-mono">Police Auto-Dispatched</span>
        </div>
      </div>

      {/* Highway Multi-Lane Simulation Graphic */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
          <span className="font-mono text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Highway Express Cam #04 – NH-44 Hyderabad Outer Ring Road
          </span>
          <span className="font-mono text-amber-400">Optical Character Radar: ACTIVE</span>
        </div>

        {/* 3 Lane Asphalt Representation */}
        <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-4 space-y-4">
          {[1, 2, 3].map((laneNum) => {
            const latestInLane = trafficFeed.find((t) => t.lane === laneNum);
            return (
              <div
                key={laneNum}
                className="relative py-3 px-4 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono text-xs font-bold">
                    LANE {laneNum}
                  </span>
                  {latestInLane ? (
                    <div className="flex items-center gap-3">
                      {/* Plate Tag */}
                      <span className="px-2.5 py-1 rounded bg-white text-slate-950 font-mono font-bold text-xs shadow">
                        {latestInLane.formattedPlate}
                      </span>
                      <span className="text-xs text-slate-300">{latestInLane.vehicleMake}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 italic">Monitoring lane...</span>
                  )}
                </div>

                {latestInLane && (
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                        latestInLane.isSpeeding
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      <Gauge className="w-3.5 h-3.5" />
                      {latestInLane.speedKmH} km/h
                    </span>
                    {latestInLane.isStolen && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-600 text-white font-black animate-bounce">
                        HOTLIST ALERT
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Traffic Log Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Automatic ANPR Detection Log
          </h3>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterType === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All ({trafficFeed.length})
            </button>
            <button
              onClick={() => setFilterType('speeding')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterType === 'speeding'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Speeding ({totalSpeeding})
            </button>
            <button
              onClick={() => setFilterType('stolen')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterType === 'stolen'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Stolen ({totalStolen})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 font-mono text-[11px] text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Event ID</th>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Lane</th>
                <th className="py-2.5 px-3">Recognized Plate</th>
                <th className="py-2.5 px-3">Vehicle</th>
                <th className="py-2.5 px-3">Speed</th>
                <th className="py-2.5 px-3">OCR Conf</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/60 font-mono">
              {filteredFeed.map((event) => (
                <tr key={event.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 text-slate-400">{event.id}</td>
                  <td className="py-2.5 px-3 text-slate-400">{event.timestamp}</td>
                  <td className="py-2.5 px-3">Lane {event.lane}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-white text-slate-950 font-bold">
                      {event.formattedPlate}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-200">{event.vehicleMake}</td>
                  <td className="py-2.5 px-3 font-bold">
                    <span className={event.isSpeeding ? 'text-rose-400' : 'text-emerald-400'}>
                      {event.speedKmH} km/h
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {(event.confidence * 100).toFixed(0)}%
                  </td>
                  <td className="py-2.5 px-3">
                    {event.isStolen ? (
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-bold">
                        HOTLIST
                      </span>
                    ) : event.isSpeeding ? (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px]">
                        SPEED VIOLATION
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px]">
                        NORMAL
                      </span>
                    )}
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
