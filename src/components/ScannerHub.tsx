import React, { useRef, useState } from 'react';
import {
  ALPRResult,
  PipelineStepOutput,
  PresetVehicle,
  VehicleRecord,
} from '../types';
import {
  Camera,
  Upload,
  Video,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Car,
  Clock,
  ParkingCircle,
  Receipt,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Zap,
  Image as ImageIcon,
  Sliders,
  ChevronRight,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { VideoRecognitionPlayer } from './VideoRecognitionPlayer';

interface ScannerHubProps {
  presets: PresetVehicle[];
  selectedPreset: PresetVehicle;
  setSelectedPreset: (p: PresetVehicle) => void;
  alprResult: ALPRResult | null;
  pipelineSteps: PipelineStepOutput[];
  isProcessing: boolean;
  onScanTrigger: (customImageBase64?: string, plateHint?: string) => void;
  onNavigateTab: (tab: 'pipeline' | 'parking' | 'toll' | 'hotlist') => void;
  soundEnabled: boolean;
}

export const ScannerHub: React.FC<ScannerHubProps> = ({
  presets,
  selectedPreset,
  setSelectedPreset,
  alprResult,
  pipelineSteps,
  isProcessing,
  onScanTrigger,
  onNavigateTab,
  soundEnabled,
}) => {
  // Input source mode: 'image' (upload or multi-type presets), 'video' (upload or stream), 'webcam'
  const [inputMode, setInputMode] = useState<'image' | 'video' | 'webcam'>('image');
  const [webcamActive, setWebcamActive] = useState<boolean>(false);
  const [userUploadedImage, setUserUploadedImage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local user image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setUserUploadedImage(base64);
        if (soundEnabled) sound.playShutter();
        onScanTrigger(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle live webcam capture
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setWebcamActive(true);
      }
    } catch (err) {
      console.error('Webcam access error:', err);
      alert('Unable to access camera. Please check permissions or use image/video inputs.');
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setWebcamActive(false);
  };

  const captureWebcamFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 400;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setUserUploadedImage(dataUrl);
    if (soundEnabled) sound.playShutter();
    onScanTrigger(dataUrl);
  };

  const activeImageSrc = userUploadedImage ? userUploadedImage : selectedPreset.svgDataUrl;
  const vehicleRecord: VehicleRecord | undefined = alprResult?.vehicleRecord;

  return (
    <div className="space-y-8">
      {/* 1. Project Hero & 6-Step Workflow Overview (First view of the site) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/30 border border-slate-800 p-6 md:p-8 shadow-2xl">
        <div className="max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono text-xs font-bold uppercase tracking-wider">
              Computer Vision & OCR System
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Academic Project: Python • OpenCV • YOLO • Tesseract OCR
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            Auto<span className="text-amber-400">Lume</span> – Intelligent License Plate Recognition
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            Automatically detect and extract alphanumeric vehicle license plates from real-world 
            <strong className="text-white"> images and video streams</strong>. The system performs image preprocessing using OpenCV (resizing, grayscale, noise reduction, Canny edges, thresholding), locates the plate region using YOLO & contour aspect ratio filtering, crops the plate, and applies Tesseract OCR for character extraction.
          </p>

          {/* 6-Step Pipeline Visual Tracker */}
          <div className="pt-2">
            <div className="text-[11px] font-mono text-amber-400 font-semibold uppercase mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Complete 6-Stage Recognition Process:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                { step: '1', title: 'Input Media', desc: 'Image / Video' },
                { step: '2', title: 'OpenCV Filter', desc: 'Gray, Blur, Edge' },
                { step: '3', title: 'Plate Detect', desc: 'YOLO & Contours' },
                { step: '4', title: 'Crop & Deskew', desc: 'ROI Normalization' },
                { step: '5', title: 'Tesseract OCR', desc: 'Character Extraction' },
                { step: '6', title: 'Post-Process', desc: 'Regex & RTO Match' },
              ].map((s) => (
                <div
                  key={s.step}
                  className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-left space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[10px] flex items-center justify-center font-bold">
                      {s.step}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Stage {s.step}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{s.title}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. USER INPUT TYPES SECTION (Image Upload, Multiple Image Types, and Video Input) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <h2 className="text-lg font-bold text-white uppercase font-mono tracking-wider">
                Select User Input Type
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload multiple types of vehicle images or video inputs for automatic number plate detection.
            </p>
          </div>

          {/* Input Mode Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setInputMode('image');
                stopWebcam();
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
                inputMode === 'image'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Image Input (Upload & Multiple Types)</span>
            </button>

            <button
              onClick={() => {
                setInputMode('video');
                stopWebcam();
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
                inputMode === 'video'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Video Input (Streams & Upload)</span>
            </button>

            <button
              onClick={() => {
                setInputMode('webcam');
                startWebcam();
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
                inputMode === 'webcam'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Live Camera</span>
            </button>
          </div>
        </div>

        {/* --- OPTION A: IMAGE INPUT (Upload & Multiple Image Categories) --- */}
        {inputMode === 'image' && (
          <div className="space-y-4">
            {/* Image Upload Zone */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-dashed border-slate-700 hover:border-amber-500/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white font-mono">
                    Upload Vehicle Image File
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Supports JPG, JPEG, PNG, WEBP, BMP. Drag and drop or browse from device.
                  </p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />

              <div className="flex items-center gap-2">
                {userUploadedImage && (
                  <button
                    onClick={() => {
                      setUserUploadedImage(null);
                      onScanTrigger(undefined, selectedPreset.plate);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
                  >
                    Clear Upload
                  </button>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition-transform active:scale-95 cursor-pointer shadow-lg shadow-amber-500/15"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Image File</span>
                </button>
              </div>
            </div>

            {/* Multiple Types of Vehicle Images Gallery */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  Multiple Image Types & Challenge Scenarios ({presets.length} Categories):
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Select a category to test lighting, weather & font conditions
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                {presets.map((preset, idx) => {
                  const isSelected = !userUploadedImage && selectedPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setUserUploadedImage(null);
                        setSelectedPreset(preset);
                        if (soundEnabled) sound.playScanBeep();
                        onScanTrigger(undefined, preset.plate);
                      }}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer relative flex flex-col justify-between min-h-[92px] group ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/15'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] font-mono font-bold px-1 py-0.5 rounded bg-slate-800 text-amber-400">
                            Type {idx + 1}
                          </span>
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                          )}
                        </div>
                        <p className="text-[11px] font-bold text-white truncate">
                          {preset.plate}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] text-slate-400 truncate">
                          {preset.name.split(' - ')[1] || preset.vehicle.split(' (')[0]}
                        </p>
                        <span className="text-[8px] font-mono uppercase text-slate-500 block truncate">
                          {preset.challengeType}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* --- OPTION B: VIDEO INPUT (Real-Time Video Player & Frame Recognition) --- */}
        {inputMode === 'video' && (
          <VideoRecognitionPlayer
            onSelectFrameForAnalysis={(frameDataUrl, plateHint) => {
              setUserUploadedImage(frameDataUrl);
              onScanTrigger(frameDataUrl, plateHint);
            }}
            soundEnabled={soundEnabled}
          />
        )}

        {/* --- OPTION C: WEBCAM CAMERA INPUT --- */}
        {inputMode === 'webcam' && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-4 min-h-[300px]">
            <div className="relative w-full max-w-xl rounded-xl overflow-hidden bg-black border border-slate-800">
              <video
                ref={videoRef}
                className="w-full h-[320px] object-cover"
                autoPlay
                playsInline
                muted
              />
              <div className="absolute inset-0 border-2 border-emerald-400/40 pointer-events-none flex items-center justify-center">
                <div className="w-72 h-20 border-2 border-emerald-400 bg-emerald-400/10 rounded-lg flex items-center justify-center text-[11px] font-mono text-emerald-300">
                  Align Vehicle Plate Here
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={captureWebcamFrame}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono shadow-xl cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Capture & Analyze Current Frame</span>
              </button>
              <button
                onClick={stopWebcam}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
              >
                Stop Camera
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. RECOGNITION RESULTS DASHBOARD (Recognizing Number Plates within Image or Video) */}
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base sm:text-lg font-bold text-white uppercase font-mono tracking-wider">
              License Plate Recognition Results within Media
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Latency: {alprResult?.pipelineLatency.totalMs.toFixed(1) || '118.0'} ms</span>
          </span>
        </div>

        {/* Media Frame & Extracted Plate Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Analyzed Image/Video Frame with Bounding Box Reticles */}
          <div className="lg:col-span-7 space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center min-h-[380px] group">
              <img
                src={activeImageSrc}
                alt="Analyzed Media Frame"
                className="w-full max-h-[440px] object-contain select-none"
              />

              {/* Laser scan line animation while processing */}
              {isProcessing && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_rgba(251,191,36,0.9)] animate-scan-line"></div>
                </div>
              )}

              {/* Bounding Box on Plate */}
              {alprResult && !isProcessing && (
                <div
                  style={{
                    left: `${alprResult.boundingBox.x}%`,
                    top: `${alprResult.boundingBox.y}%`,
                    width: `${alprResult.boundingBox.width}%`,
                    height: `${alprResult.boundingBox.height}%`,
                  }}
                  className="absolute border-2 border-emerald-400 bg-emerald-400/10 pointer-events-none transition-all duration-300"
                >
                  {/* Reticle brackets */}
                  <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-300"></span>
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-300"></span>
                  <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-300"></span>
                  <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-300"></span>

                  <div className="absolute -top-6 left-0 px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold whitespace-nowrap shadow-md">
                    YOLO PLATE: {(alprResult.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              )}

              {/* Telemetry overlay */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md border border-slate-700/60 font-mono text-[11px] text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  FRAME NORMALIZED (640x400)
                </span>
              </div>

              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <button
                  onClick={() => onScanTrigger(userUploadedImage || undefined, selectedPreset.plate)}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-transform active:scale-95 cursor-pointer font-mono"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isProcessing ? 'Detecting...' : 'Re-Run Detection'}</span>
                </button>
              </div>
            </div>

            {/* Context Challenge Description */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="font-semibold text-amber-400 font-mono mr-1">
                [Preprocessing Context]:
              </span>
              <span>{userUploadedImage ? 'Custom user media processed through OpenCV pipeline.' : selectedPreset.challenge}</span>
            </div>
          </div>

          {/* Right Column (5 cols): Extracted Plate, Character Confidences & Vehicle Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-slate-400 uppercase">
                    Extracted Alphanumeric Plate
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                    CONF: {alprResult ? `${(alprResult.confidence * 100).toFixed(1)}%` : '0%'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">
                  Tesseract OCR (LSTM)
                </span>
              </div>

              {/* Embossed HSRP Plate Visual */}
              <div className="p-4 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border-2 border-slate-700/80 shadow-2xl flex items-center justify-center">
                <div className="relative bg-white text-slate-950 border-2 border-slate-900 rounded-lg px-4 py-2.5 flex items-center shadow-lg font-mono font-black tracking-wider text-xl sm:text-2xl min-w-[240px] justify-between">
                  <div className="bg-blue-800 text-white text-[9px] font-bold px-1.5 py-1 rounded-sm flex flex-col items-center justify-center leading-none mr-3 select-none">
                    <span className="text-[8px] text-amber-300">☸</span>
                    <span>IND</span>
                  </div>

                  <span className="tracking-widest drop-shadow-sm select-all">
                    {alprResult?.formattedPlate || selectedPreset.formattedPlate}
                  </span>

                  <div className="w-3.5 h-3.5 rounded-full bg-sky-500/30 border border-sky-600 flex items-center justify-center ml-2">
                    <span className="text-[7px] text-sky-800 font-bold">✓</span>
                  </div>
                </div>
              </div>

              {/* Character Segmentation Matrix */}
              {alprResult && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Character-by-Character Segmentation:</span>
                    <span className="text-emerald-400 font-bold">Verified</span>
                  </span>
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                    {alprResult.charBreakdown.map((c: { char: string; conf: number }, i: number) => (
                      <div
                        key={i}
                        className="px-2 py-1 rounded bg-slate-950 border border-slate-800 flex flex-col items-center min-w-[28px]"
                      >
                        <span className="text-xs font-mono font-bold text-amber-400">{c.char}</span>
                        <span className="text-[9px] font-mono text-slate-500 leading-none mt-0.5">
                          {Math.round(c.conf * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vehicle RTO / DMV Registry Record */}
              {vehicleRecord && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-sky-400" />
                      <span className="text-xs font-bold text-white">
                        {vehicleRecord.vehicleMake || vehicleRecord.make || 'Vehicle'} {vehicleRecord.vehicleModel || vehicleRecord.model || ''}
                      </span>
                    </div>
                    {vehicleRecord.isStolen ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40">
                        <ShieldAlert className="w-3 h-3 text-rose-500" /> HOTLIST
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" /> VERIFIED
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block">Registered Owner</span>
                      <span className="font-medium text-slate-200">{vehicleRecord.ownerName || 'Verified Citizen'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block">RTO Jurisdiction</span>
                      <span className="font-medium text-slate-200 truncate block">
                        {vehicleRecord.stateName ? vehicleRecord.stateName.split('(')[0] : 'State Transport Authority'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block">Insurance Validity</span>
                      <span className="font-medium text-emerald-400 font-mono">
                        {vehicleRecord.insuranceValidUntil || 'Valid'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block">FASTag Wallet</span>
                      <span className="font-medium text-amber-400 font-mono">
                        ₹{(vehicleRecord.fastTagBalance ?? 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => onNavigateTab('pipeline')}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Inspect CV Pipeline</span>
                </button>

                <button
                  onClick={() => onNavigateTab('parking')}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-xs font-semibold text-sky-400 border border-sky-500/40 transition-colors cursor-pointer"
                >
                  <ParkingCircle className="w-3.5 h-3.5" />
                  <span>Open Parking Gate</span>
                </button>

                <button
                  onClick={() => onNavigateTab('toll')}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-xs font-semibold text-emerald-400 border border-emerald-500/40 transition-colors cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Process FASTag Toll</span>
                </button>

                <button
                  onClick={() => onNavigateTab('hotlist')}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-xs font-semibold text-rose-400 border border-rose-500/40 transition-colors cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Hotlist Status</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. VISUAL STEP-BY-STEP OPENCV PROCESSING STRIP FOR THIS RECOGNITION */}
        {pipelineSteps.length > 0 && (
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs sm:text-sm font-bold text-white font-mono uppercase">
                  OpenCV Image Preprocessing Stages for this Media:
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('pipeline')}
                className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Adjust Parameters in Pipeline Lab</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {pipelineSteps.slice(0, 6).map((step, idx) => (
                <div
                  key={step.id}
                  onClick={() => onNavigateTab('pipeline')}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 transition-all cursor-pointer group space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-amber-400 font-bold">Step {idx + 1}</span>
                    <span className="text-slate-500 truncate max-w-[80px]">
                      {step.name.split(':')[1]?.trim() || step.name.split(' ')[0]}
                    </span>
                  </div>

                  <div className="h-20 rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center">
                    <img
                      src={step.canvasDataUrl}
                      alt={step.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <p className="text-[10px] text-slate-400 truncate text-center">
                    {step.name.replace('OpenCV Preprocessing: ', '')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
