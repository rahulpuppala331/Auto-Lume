import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Video,
  Camera,
  Upload,
  Clock,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Layers,
  Zap,
} from 'lucide-react';
import { SAMPLE_VIDEO_FEEDS } from '../utils/mockPresets';
import { VideoDetectionEvent, VideoInputSource } from '../types';
import { sound } from '../utils/soundEffects';

interface VideoRecognitionPlayerProps {
  onSelectFrameForAnalysis: (frameDataUrl: string, plateHint: string) => void;
  soundEnabled: boolean;
}

export const VideoRecognitionPlayer: React.FC<VideoRecognitionPlayerProps> = ({
  onSelectFrameForAnalysis,
  soundEnabled,
}) => {
  const [selectedFeed, setSelectedFeed] = useState<VideoInputSource>(SAMPLE_VIDEO_FEEDS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [userUploadedVideoUrl, setUserUploadedVideoUrl] = useState<string | null>(null);
  const [detectedEvents, setDetectedEvents] = useState<VideoDetectionEvent[]>([]);
  const [activeTrackingBox, setActiveTrackingBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    plate: string;
    conf: number;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastLoggedSecRef = useRef<number>(-1);

  // Handle local user video upload
  const handleUserVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUserUploadedVideoUrl(url);
    setIsPlaying(true);
    setDetectedEvents([]);
    if (soundEnabled) sound.playScanBeep();
  };

  // Video playback loop (Canvas Procedural Simulation or HTML5 Video)
  useEffect(() => {
    if (!isPlaying) return;

    let lastTimestamp = performance.now();

    const loop = (now: number) => {
      const deltaSec = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (userUploadedVideoUrl && userVideoRef.current) {
        // HTML5 User Video Mode
        const v = userVideoRef.current;
        if (!v.paused && !v.ended) {
          setCurrentTime(v.currentTime);
          drawVideoFrameToCanvas(v);
        }
      } else {
        // Procedural Sample Highway / Parking / Toll Video Stream
        setCurrentTime((prev) => {
          const next = prev + deltaSec;
          if (next >= selectedFeed.durationSec) {
            return 0; // Loop video
          }
          return next;
        });
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, selectedFeed, userUploadedVideoUrl]);

  // Draw user video to canvas
  const drawVideoFrameToCanvas = (videoEl: HTMLVideoElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

    // Dynamic scan reticle overlay
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    const boxX = canvas.width * 0.32;
    const boxY = canvas.height * 0.68;
    const boxW = canvas.width * 0.36;
    const boxH = canvas.height * 0.14;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    ctx.fillStyle = '#10b981';
    ctx.fillRect(boxX, boxY - 22, 140, 20);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('ANPR TRACKING', boxX + 6, boxY - 8);
  };

  // Procedural canvas rendering for built-in video streams
  useEffect(() => {
    if (userUploadedVideoUrl) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 640;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    // Background Asphalt Road & Markings
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Road lanes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width * 0.33, 0);
    ctx.lineTo(width * 0.33, height);
    ctx.moveTo(width * 0.66, 0);
    ctx.lineTo(width * 0.66, height);
    ctx.stroke();

    // Moving lane divider dashes
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    const dashOffset = (currentTime * 120) % 60;
    ctx.lineDashOffset = -dashOffset;
    ctx.setLineDash([25, 20]);
    ctx.beginPath();
    ctx.moveTo(width * 0.33, 0);
    ctx.lineTo(width * 0.33, height);
    ctx.moveTo(width * 0.66, 0);
    ctx.lineTo(width * 0.66, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Find if a vehicle is currently in frame for this timestamp
    const activePlateInfo = selectedFeed.platesInVideo.find(
      (p: any) => currentTime >= p.startSec && currentTime <= p.endSec
    );

    if (activePlateInfo) {
      const progress = (currentTime - activePlateInfo.startSec) / (activePlateInfo.endSec - activePlateInfo.startSec);
      
      // Interpolate bounding box size and position as car drives closer
      const start = activePlateInfo.bboxAtStart;
      const end = activePlateInfo.bboxAtEnd;
      const curX = start.x + (end.x - start.x) * progress;
      const curY = start.y + (end.y - start.y) * progress;
      const curW = start.width + (end.width - start.width) * progress;
      const curH = start.height + (end.height - start.height) * progress;

      // Draw car body representation
      const carW = (curW / 100) * width * 2.8;
      const carH = carW * 0.75;
      const carCenterX = (curX / 100) * width + ((curW / 100) * width) / 2;
      const carCenterY = (curY / 100) * height - carH * 0.35;

      // Car shadow
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.beginPath();
      ctx.ellipse(carCenterX, carCenterY + carH * 0.45, carW * 0.55, carH * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Car color gradient
      let carColor1 = '#f8fafc';
      let carColor2 = '#94a3b8';
      if (activePlateInfo.plate.includes('MH12')) {
        carColor1 = '#dc2626'; // Red
        carColor2 = '#7f1d1d';
      } else if (activePlateInfo.plate.includes('DL01')) {
        carColor1 = '#1e293b'; // Black
        carColor2 = '#020617';
      } else if (activePlateInfo.plate.includes('KA03')) {
        carColor1 = '#0d9488'; // Teal EV
        carColor2 = '#134e4a';
      }

      const grad = ctx.createLinearGradient(0, carCenterY - carH / 2, 0, carCenterY + carH / 2);
      grad.addColorStop(0, carColor1);
      grad.addColorStop(1, carColor2);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(carCenterX - carW / 2, carCenterY - carH / 2, carW, carH, 16);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Windshield
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.roundRect(carCenterX - carW * 0.35, carCenterY - carH * 0.4, carW * 0.7, carH * 0.35, 8);
      ctx.fill();

      // Headlights
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.ellipse(carCenterX - carW * 0.35, carCenterY + carH * 0.15, carW * 0.1, carH * 0.1, 0, 0, Math.PI * 2);
      ctx.ellipse(carCenterX + carW * 0.35, carCenterY + carH * 0.15, carW * 0.1, carH * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();

      // License Plate Recess
      const pxX = (curX / 100) * width;
      const pxY = (curY / 100) * height;
      const pxW = (curW / 100) * width;
      const pxH = (curH / 100) * height;

      // Draw License Plate
      const isEV = activePlateInfo.plate.includes('KA03');
      ctx.fillStyle = isEV ? '#15803d' : '#ffffff';
      ctx.fillRect(pxX, pxY, pxW, pxH);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(pxX, pxY, pxW, pxH);

      // Blue IND Strip
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(pxX + 1, pxY + 1, pxW * 0.14, pxH - 2);

      // Plate Text
      ctx.fillStyle = isEV ? '#ffffff' : '#020617';
      ctx.font = `bold ${Math.max(12, Math.round(pxH * 0.58))}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(activePlateInfo.formattedPlate, pxX + pxW * 0.58, pxY + pxH * 0.54);

      // ACTIVE ANPR BOUNDING BOX
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.strokeRect(pxX - 3, pxY - 3, pxW + 6, pxH + 6);

      // Corner reticles
      const cl = 8;
      ctx.fillStyle = '#10b981';
      ctx.fillRect(pxX - 4, pxY - 4, cl, 3);
      ctx.fillRect(pxX - 4, pxY - 4, 3, cl);
      ctx.fillRect(pxX + pxW + 1 - cl, pxY - 4, cl, 3);
      ctx.fillRect(pxX + pxW + 1, pxY - 4, 3, cl);

      // Tracking label
      ctx.fillStyle = '#10b981';
      ctx.fillRect(pxX - 3, Math.max(pxY - 22, 0), pxW + 6, 18);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 10px "JetBrains Mono", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`ANPR: 96% | ${activePlateInfo.plate}`, pxX + 2, Math.max(pxY - 9, 11));

      setActiveTrackingBox({
        x: curX,
        y: curY,
        width: curW,
        height: curH,
        plate: activePlateInfo.plate,
        conf: 0.96,
      });

      // Log detection event if passing threshold
      const secInt = Math.floor(currentTime);
      if (secInt !== lastLoggedSecRef.current && (secInt === 1 || secInt === 4 || secInt === 7 || secInt === 10)) {
        lastLoggedSecRef.current = secInt;
        const newEv: VideoDetectionEvent = {
          id: `V-EV-${Date.now().toString().slice(-4)}`,
          timestampSec: Number(currentTime.toFixed(1)),
          timestampFormatted: `00:0${secInt}`,
          plate: activePlateInfo.plate,
          formattedPlate: activePlateInfo.formattedPlate,
          vehicle: activePlateInfo.vehicle,
          confidence: 0.96,
          bbox: { x: curX, y: curY, width: curW, height: curH },
          frameSnapshotDataUrl: canvas.toDataURL('image/jpeg', 0.8),
        };
        setDetectedEvents((prev) => {
          if (prev.some((p) => p.plate === newEv.plate)) return prev;
          return [newEv, ...prev];
        });
        if (soundEnabled) sound.playScanBeep();
      }
    } else {
      setActiveTrackingBox(null);
    }

    // Telemetry OSD Watermark
    ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
    ctx.fillRect(15, 15, 310, 32);
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`LIVE ANPR FEED • ${selectedFeed.title.slice(0, 22)}...`, 25, 35);

    // Frame Counter
    ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
    ctx.fillRect(width - 150, 15, 135, 32);
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`TIME: ${currentTime.toFixed(1)}s / ${selectedFeed.durationSec}s`, width - 140, 35);
  }, [currentTime, selectedFeed, userUploadedVideoUrl, soundEnabled]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (userUploadedVideoUrl && userVideoRef.current) {
      userVideoRef.current.currentTime = val;
    }
  };

  const handleCaptureCurrentFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const hint = activeTrackingBox?.plate || 'TS09AB1234';
    if (soundEnabled) sound.playShutter();
    onSelectFrameForAnalysis(dataUrl, hint);
  };

  return (
    <div className="space-y-4">
      {/* Video Source Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Video className="w-4 h-4 text-amber-400" />
            Video Stream Input & Real-Time Plate Recognition
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Process continuous video streams, track moving vehicles with dynamic bounding boxes, and log timestamped OCR plates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Preset Feed Switcher */}
          <select
            value={selectedFeed.id}
            disabled={Boolean(userUploadedVideoUrl)}
            onChange={(e) => {
              const f = SAMPLE_VIDEO_FEEDS.find((feed) => feed.id === e.target.value);
              if (f) {
                setSelectedFeed(f);
                setCurrentTime(0);
                setDetectedEvents([]);
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
          >
            {SAMPLE_VIDEO_FEEDS.map((feed) => (
              <option key={feed.id} value={feed.id}>
                {feed.title.split(' (')[0]}
              </option>
            ))}
          </select>

          {/* User Video File Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime"
            className="hidden"
            onChange={handleUserVideoUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-xs text-amber-300 border border-amber-500/40 font-mono font-medium transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{userUploadedVideoUrl ? 'Replace Video' : 'Upload Video File'}</span>
          </button>

          {userUploadedVideoUrl && (
            <button
              onClick={() => {
                setUserUploadedVideoUrl(null);
                setCurrentTime(0);
              }}
              className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-400 font-mono"
              title="Return to Preset Stream"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Video Screen & Live Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (8 cols): Video Player with Reticles */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center min-h-[340px]">
            {/* Hidden user video element for decoding */}
            {userUploadedVideoUrl && (
              <video
                ref={userVideoRef}
                src={userUploadedVideoUrl}
                playsInline
                muted
                autoPlay
                className="hidden"
              />
            )}

            {/* Primary Rendering Canvas */}
            <canvas ref={canvasRef} className="w-full max-h-[400px] object-contain" />

            {/* Overlay Play/Pause Button */}
            <button
              onClick={() => {
                setIsPlaying(!isPlaying);
                if (userUploadedVideoUrl && userVideoRef.current) {
                  if (isPlaying) userVideoRef.current.pause();
                  else userVideoRef.current.play();
                }
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-amber-400 hover:text-white transition-colors cursor-pointer shadow-lg"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Live Detected Badge */}
            {activeTrackingBox && (
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 font-mono text-xs text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Active Target: {activeTrackingBox.plate}</span>
              </div>
            )}
          </div>

          {/* Video Scrubbing Bar & Controls */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  setCurrentTime(0);
                  if (userVideoRef.current) userVideoRef.current.currentTime = 0;
                }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Restart Video"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="text-xs font-mono text-slate-300 whitespace-nowrap">
                {currentTime.toFixed(1)}s / {selectedFeed.durationSec}s
              </div>
            </div>

            {/* Progress Bar */}
            <input
              type="range"
              min="0"
              max={selectedFeed.durationSec}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="w-full sm:flex-1 accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer mx-2"
            />

            {/* Frame Analyze Button */}
            <button
              onClick={handleCaptureCurrentFrame}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono shadow-md whitespace-nowrap transition-transform active:scale-95 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Analyze Frame at {currentTime.toFixed(1)}s</span>
            </button>
          </div>
        </div>

        {/* Right Column (4 cols): Video Detections Timeline Feed */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 h-full flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white font-mono uppercase">
                  Video Plate Log ({detectedEvents.length})
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 animate-pulse">
                REC ACTIVE
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              Recognized plates from the video stream. Click any event to inspect its OpenCV processing stages.
            </p>

            <div className="flex-1 space-y-2 overflow-y-auto max-h-[340px] pr-1">
              {detectedEvents.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-500 font-mono">
                  Playing stream... scanning for vehicles...
                </div>
              ) : (
                detectedEvents.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => {
                      if (ev.frameSnapshotDataUrl) {
                        onSelectFrameForAnalysis(ev.frameSnapshotDataUrl, ev.plate);
                      }
                    }}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/60 transition-all cursor-pointer space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-bold text-[10px]">
                        {ev.timestampFormatted}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold">
                        {(ev.confidence * 100).toFixed(0)}% OCR
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-white text-slate-950 font-mono font-black text-xs">
                        {ev.formattedPlate}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 group-hover:text-amber-400 transition-colors">
                        Inspect →
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 truncate">{ev.vehicle}</p>
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
