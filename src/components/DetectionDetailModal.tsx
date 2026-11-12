import React from 'react';
import {
  X,
  Download,
  Trash2,
  Clock,
  Car,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  FileText,
} from 'lucide-react';
import { DetectionRecord } from '../types';

interface DetectionDetailModalProps {
  detection: DetectionRecord | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const DetectionDetailModal: React.FC<DetectionDetailModalProps> = ({
  detection,
  onClose,
  onDelete,
}) => {
  if (!detection) return null;

  const handleDownload = () => {
    const jsonStr = JSON.stringify(detection, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autolume_detection_${detection.plateNumber}_${Date.now()}.json`;
    a.click();
  };

  const formattedDate = new Date(detection.timestamp).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = new Date(detection.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden my-8 animate-in fade-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Detection Record Details • #{detection.id.slice(-6)}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Top Plate & Status Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block">
                Extracted Plate
              </span>
              <div className="flex items-center gap-3 mt-1">
                {/* Embossed visual */}
                <div className="bg-white text-slate-950 px-3 py-1.5 rounded-md font-mono font-black text-xl tracking-widest border border-slate-900 flex items-center gap-2 shadow">
                  <span className="text-[9px] bg-blue-800 text-white px-1 py-0.5 rounded font-bold">
                    IND
                  </span>
                  <span>{detection.plateNumber}</span>
                </div>

                <span
                  className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
                    detection.status === 'detected'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {detection.status === 'detected' ? 'Successfully Detected' : 'Review Required'}
                </span>
              </div>
            </div>

            <div className="text-right sm:text-right">
              <span className="text-[10px] font-mono text-slate-500 block">Confidence Score</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">
                {detection.confidence.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-mono block">Detection Date</span>
              <span className="font-semibold text-slate-200 mt-0.5 block">{formattedDate}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-mono block">Detection Time</span>
              <span className="font-semibold text-slate-200 mt-0.5 block">{formattedTime}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-mono block">Source Medium</span>
              <span className="font-semibold text-amber-400 font-mono mt-0.5 block uppercase">
                {detection.sourceType}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-mono block">Processing Time</span>
              <span className="font-semibold text-sky-400 font-mono mt-0.5 block">
                {detection.processingTime} seconds
              </span>
            </div>
          </div>

          {/* Visual Comparison: Original | Processed | Cropped Plate */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
              Computer Vision Pipeline Views
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Original Frame with BBox */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 block font-semibold">
                  1. Original Vehicle Frame
                </span>
                <div className="relative h-32 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                  {detection.originalFile ? (
                    <img
                      src={detection.originalFile}
                      alt="Original"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-[10px] font-mono text-slate-500">Preview saved in archive</div>
                  )}
                  {/* Bounding Box overlay */}
                  <div
                    style={{
                      left: `${detection.boundingBox.x}%`,
                      top: `${detection.boundingBox.y}%`,
                      width: `${detection.boundingBox.width}%`,
                      height: `${detection.boundingBox.height}%`,
                    }}
                    className="absolute border-2 border-emerald-400 bg-emerald-400/10 pointer-events-none"
                  />
                </div>
                <span className="text-[9px] font-mono text-slate-500 block truncate">
                  BBox: x={detection.boundingBox.x}%, y={detection.boundingBox.y}%, w={detection.boundingBox.width}%
                </span>
              </div>

              {/* Contrast & Edge Mask */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 block font-semibold">
                  2. Contrast & Edge Isolation
                </span>
                <div className="h-32 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                  {detection.processedImage ? (
                    <img
                      src={detection.processedImage}
                      alt="Edge Analysis"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-[10px] font-mono text-slate-500">Binarized Gradient Map</div>
                  )}
                </div>
                <span className="text-[9px] font-mono text-slate-500 block">
                  Engine: Multi-Spectral Vision Core
                </span>
              </div>

              {/* Cropped Plate ROI */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 block font-semibold">
                  3. Plate Region & OCR Output
                </span>
                <div className="h-32 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center p-2">
                  <div className="bg-white p-2 rounded shadow border border-slate-700 text-slate-950 font-mono font-bold text-center tracking-widest text-sm">
                    {detection.plateNumber}
                  </div>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 block">
                  Alphanumeric Character Recognition
                </span>
              </div>
            </div>
          </div>

          {/* OCR Breakdown & Vehicle Registry */}
          {detection.vehicleMetadata && (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-sky-400" />
                  Vehicle Registry Specifications (RTO / DMV)
                </span>
                {detection.vehicleMetadata.isStolen ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold">
                    HOTLIST / STOLEN
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                    VERIFIED VEHICLE
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">Make & Model</span>
                  <span className="font-semibold text-slate-200">
                    {detection.vehicleMetadata.make} {detection.vehicleMetadata.model}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">Owner</span>
                  <span className="font-semibold text-slate-200">
                    {detection.vehicleMetadata.ownerName || 'Citizen Vehicle'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">RTO Jurisdiction</span>
                  <span className="font-semibold text-slate-200">
                    {detection.vehicleMetadata.stateName || 'National'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">FASTag Wallet</span>
                  <span className="font-semibold text-amber-400 font-mono">
                    ₹{detection.vehicleMetadata.fastTagBalance?.toFixed(2) || '850.00'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => onDelete(detection.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 text-xs font-mono font-medium transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Detection</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Download Result</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-mono transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
