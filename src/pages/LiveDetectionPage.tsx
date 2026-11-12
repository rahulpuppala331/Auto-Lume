import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Car,
  Cpu,
  Layers,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { DetectionRecord } from '../types';
import { sound } from '../utils/soundEffects';

interface LiveDetectionPageProps {
  onSaveDetectionToDb: (detection: DetectionRecord) => void;
  soundEnabled: boolean;
}

export const LiveDetectionPage: React.FC<LiveDetectionPageProps> = ({
  onSaveDetectionToDb,
  soundEnabled,
}) => {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [autoScanInterval, setAutoScanInterval] = useState<boolean>(false);
  const [lastDetectedPlate, setLastDetectedPlate] = useState<DetectionRecord | null>(null);
  const [liveStreamLogs, setLiveStreamLogs] = useState<DetectionRecord[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const autoScanTimerRef = useRef<any>(null);

  // Start browser camera stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      alert('Unable to access camera. Please check camera permissions in browser.');
    }
  };

  // Stop browser camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setAutoScanInterval(false);
    if (autoScanTimerRef.current) clearInterval(autoScanTimerRef.current);
  };

  // Capture frame and send to backend REST API
  const captureFrameAndDetect = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsScanning(true);
    if (soundEnabled) sound.playShutter();

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    try {
      const res = await fetch('/api/detect/frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: dataUrl,
          plateHint: '',
        }),
      });

      const data = await res.json();
      if (data.success) {
        const record: DetectionRecord = {
          id: data.id || `live_${Date.now()}`,
          _id: data.id || `live_${Date.now()}`,
          plateNumber: data.plateNumber,
          confidence: data.confidence,
          sourceType: 'camera',
          originalFile: dataUrl,
          boundingBox: data.boundingBox || { x: 33, y: 69, width: 34, height: 13 },
          timestamp: new Date().toISOString(),
          processingTime: data.processingTime || 0.95,
          status: 'detected',
          detectionMethod: 'Multi-Spectral Vision Core',
          rawOcrText: data.rawOcrText || data.plateNumber,
          characters: data.characters,
          vehicleMetadata: data.vehicleMetadata,
        };

        setLastDetectedPlate(record);
        setLiveStreamLogs((prev) => [record, ...prev.slice(0, 15)]);
        onSaveDetectionToDb(record);
        if (soundEnabled) sound.playSuccess();
      }
    } catch (err) {
      console.warn('Frame detection notice:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Periodic Auto-scan effect
  useEffect(() => {
    if (autoScanInterval && isCameraActive) {
      autoScanTimerRef.current = setInterval(() => {
        captureFrameAndDetect();
      }, 3500);
    } else {
      if (autoScanTimerRef.current) clearInterval(autoScanTimerRef.current);
    }

    return () => {
      if (autoScanTimerRef.current) clearInterval(autoScanTimerRef.current);
    };
  }, [autoScanInterval, isCameraActive]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase">
              Optical Sensor Stream
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-['Outfit'] mt-1">
            Real-Time Live Camera Detection
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-0.5">
            Capture frames from connected optical cameras, USB sensors, or mobile devices for real-time plate localization and optical character extraction.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {!isCameraActive ? (
            <button
              onClick={startCamera}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono shadow-xl shadow-amber-500/20 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Start Camera</span>
            </button>
          ) : (
            <>
              <button
                onClick={captureFrameAndDetect}
                disabled={isScanning}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs font-mono shadow-lg cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>{isScanning ? 'Processing Frame...' : 'Capture Frame'}</span>
              </button>

              <button
                onClick={() => setAutoScanInterval(!autoScanInterval)}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer border ${
                  autoScanInterval
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <span>Auto-Scan (3s): {autoScanInterval ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={stopCamera}
                className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 text-xs font-mono font-bold cursor-pointer"
              >
                Stop Camera
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Screen & Live OCR Results Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Camera Feed Viewport */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center min-h-[380px] shadow-2xl">
            {/* Real video feed */}
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`w-full max-h-[440px] object-cover ${!isCameraActive ? 'hidden' : 'block'}`}
            />
            {/* Hidden canvas for frame grab */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Standby Placeholder when camera stopped */}
            {!isCameraActive && (
              <div className="text-center p-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Camera className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white">Camera Standby</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Click <strong>Start Camera</strong> to connect your device's video feed and test real-time license plate detection.
                </p>
              </div>
            )}

            {/* Overlaid Target Reticle when Camera is Active */}
            {isCameraActive && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                <div className="w-80 h-24 border-2 border-emerald-400 bg-emerald-400/10 rounded-xl relative flex items-center justify-center">
                  <span className="text-[11px] font-mono text-emerald-300 font-bold bg-slate-950/80 px-2 py-0.5 rounded">
                    ALPR DETECTION ZONE
                  </span>
                  {/* Reticle corner marks */}
                  <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-emerald-300"></span>
                  <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-emerald-300"></span>
                  <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-emerald-300"></span>
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-300"></span>
                </div>

                <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-emerald-400 font-mono text-[11px] border border-slate-800">
                  LIVE RTSP / WEBCAM 1080P
                </div>
              </div>
            )}
          </div>

          {/* Architecture Reminder Card (Section 17 Spec) */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-1.5 text-slate-400">
            <span className="font-bold text-amber-400 block uppercase">
              Architecture Separation Note:
            </span>
            <p className="leading-relaxed">
              Camera Feed (Browser) → React Frame Capture → Flask REST API (/api/detect/frame) → OpenCV Preprocessing → YOLO Plate Localization → PyTesseract OCR → MongoDB Persistence.
            </p>
          </div>
        </div>

        {/* Right Column (4 cols): Live Target Details & Detected Feed */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Target Banner */}
          {lastDetectedPlate ? (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">
                Last Extracted Plate
              </span>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="px-3 py-1.5 rounded bg-white text-slate-950 font-mono font-black text-lg tracking-wider">
                  {lastDetectedPlate.plateNumber}
                </span>
                <span className="text-emerald-400 font-mono font-bold text-sm">
                  {lastDetectedPlate.confidence.toFixed(1)}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">Status</span>
                  <span className="text-emerald-400 font-bold">SAVED TO MONGO</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">Latency</span>
                  <span className="text-sky-400 font-bold">{lastDetectedPlate.processingTime}s</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center py-8 space-y-2">
              <Cpu className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs font-mono text-slate-400">
                Awaiting camera frame capture...
              </p>
            </div>
          )}

          {/* Live Stream History Log */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Live Session Detections ({liveStreamLogs.length})
            </h4>

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {liveStreamLogs.length === 0 ? (
                <div className="text-center py-6 text-xs font-mono text-slate-600">
                  No plates detected in this camera session yet.
                </div>
              ) : (
                liveStreamLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{log.plateNumber}</span>
                      <span className="text-[9px] text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <span className="text-emerald-400 font-bold">{log.confidence.toFixed(1)}%</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
