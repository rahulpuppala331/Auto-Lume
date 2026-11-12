import React, { useState } from 'react';
import {
  PipelineParams,
  PipelineStepOutput,
  PresetVehicle,
} from '../types';
import {
  Sliders,
  Code2,
  Copy,
  Check,
  Eye,
  RefreshCw,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface PipelineInspectorProps {
  steps: PipelineStepOutput[];
  params: PipelineParams;
  setParams: React.Dispatch<React.SetStateAction<PipelineParams>>;
  onRecompute: () => void;
  selectedPreset: PresetVehicle;
  setSelectedPreset: (p: PresetVehicle) => void;
  presets: PresetVehicle[];
  isProcessing: boolean;
}

export const PipelineInspector: React.FC<PipelineInspectorProps> = ({
  steps,
  params,
  setParams,
  onRecompute,
  selectedPreset,
  setSelectedPreset,
  presets,
  isProcessing,
}) => {
  const [selectedStepIdx, setSelectedStepIdx] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'deep_dive' | 'grid'>('deep_dive');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);

  const currentStep = steps[selectedStepIdx] || steps[0];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner explaining the 6-stage pipeline */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/20 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-xs font-semibold uppercase">
              AutoLume Core Architecture
            </span>
            <span className="text-xs text-slate-400">OpenCV 4.10 + YOLOv8 + Tesseract OCR</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white mt-1">
            6-Stage Computer Vision & OCR Processing Pipeline
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-0.5">
            Step-by-step visual execution: from initial image ingestion, OpenCV filtering (grayscale, blur, Canny edge, morphology), contour & YOLO localization, to Tesseract character segmentation and regex post-processing.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-slate-400">Dataset Scenario:</span>
          <select
            value={selectedPreset.id}
            onChange={(e) => {
              const found = presets.find((p) => p.id === e.target.value);
              if (found) setSelectedPreset(found);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
          >
            {presets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.plate} ({p.name.split(' - ')[1] || p.vehicle})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Left Controls & Pipeline Step Selector, Right Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 cols): Parameter Controls & Step List */}
        <div className="lg:col-span-4 space-y-4">
          {/* Interactive OpenCV Tuning Panel */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                Live OpenCV Hyperparameters
              </h3>
              <button
                onClick={onRecompute}
                disabled={isProcessing}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isProcessing ? 'animate-spin' : ''}`} />
                Re-filter
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              Adjust OpenCV filter parameters to solve challenges like night glare, rain streaks, or low contrast.
            </p>

            <div className="space-y-3 text-xs">
              {/* Blur Radius */}
              <div>
                <div className="flex justify-between text-slate-300 font-mono mb-1">
                  <span>Gaussian Blur Radius (k):</span>
                  <span className="text-amber-400 font-bold">{params.blurRadius} px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  value={params.blurRadius}
                  onChange={(e) => setParams({ ...params, blurRadius: parseInt(e.target.value, 10) })}
                  className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">Larger kernel suppresses rain & sensor noise</span>
              </div>

              {/* Canny Low */}
              <div>
                <div className="flex justify-between text-slate-300 font-mono mb-1">
                  <span>Canny Lower Threshold:</span>
                  <span className="text-amber-400 font-bold">{params.cannyLow}</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="5"
                  value={params.cannyLow}
                  onChange={(e) => setParams({ ...params, cannyLow: parseInt(e.target.value, 10) })}
                  className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              {/* Canny High */}
              <div>
                <div className="flex justify-between text-slate-300 font-mono mb-1">
                  <span>Canny Upper Threshold:</span>
                  <span className="text-amber-400 font-bold">{params.cannyHigh}</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="240"
                  step="10"
                  value={params.cannyHigh}
                  onChange={(e) => setParams({ ...params, cannyHigh: parseInt(e.target.value, 10) })}
                  className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">Hysteresis tracking to detect plate borders</span>
              </div>

              {/* Morphology Dilation Iterations */}
              <div>
                <div className="flex justify-between text-slate-300 font-mono mb-1">
                  <span>Morphological Closing / Dilation:</span>
                  <span className="text-amber-400 font-bold">{params.dilationIters} iters</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="1"
                  value={params.dilationIters}
                  onChange={(e) => setParams({ ...params, dilationIters: parseInt(e.target.value, 10) })}
                  className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">Bridges character strokes and plate rectangles</span>
              </div>
            </div>
          </div>

          {/* Step Selector List */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Pipeline Stages ({steps.length})
            </h3>
            <div className="space-y-1.5">
              {steps.map((st, idx) => {
                const isSelected = selectedStepIdx === idx;
                return (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStepIdx(idx)}
                    className={`w-full text-left p-2.5 rounded-lg transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                        : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold ${
                          isSelected ? 'bg-slate-950 text-amber-400' : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <p className="text-xs leading-tight truncate">{st.name}</p>
                        <p
                          className={`text-[10px] font-mono leading-none mt-0.5 ${
                            isSelected ? 'text-slate-800' : 'text-slate-500'
                          }`}
                        >
                          Stage {st.stageNumber} • {st.id.replace('step-', '')}
                        </p>
                      </div>
                    </div>
                    {isSelected && <Sparkles className="w-4 h-4 text-slate-950 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (8 cols): Large Interactive Step Viewer */}
        <div className="lg:col-span-8 space-y-4">
          {/* Header of Active Step */}
          {currentStep && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[11px] font-bold">
                      STAGE {currentStep.stageNumber} OF 6
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Step #{selectedStepIdx + 1}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                    {currentStep.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode(viewMode === 'deep_dive' ? 'grid' : 'deep_dive')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                  >
                    {viewMode === 'deep_dive' ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-sky-400" /> Gallery View
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-3.5 h-3.5 text-amber-400" /> Focus View
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowCodeModal(!showCodeModal)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-xs text-emerald-400 border border-emerald-500/40 transition-colors cursor-pointer"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Python Code</span>
                  </button>
                </div>
              </div>

              {/* Viewport: Either Single Deep Dive Canvas or 6-Step Grid */}
              {viewMode === 'deep_dive' ? (
                <div className="space-y-4">
                  {/* Canvas Frame */}
                  <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center min-h-[300px] shadow-inner">
                    <img
                      src={currentStep.canvasDataUrl}
                      alt={currentStep.name}
                      className="max-h-[380px] w-auto object-contain mx-auto transition-transform duration-200"
                    />

                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700/60 font-mono text-[11px] text-slate-300">
                      AutoLume CV Output
                    </div>

                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-emerald-400 border border-slate-800">
                      Processed Frame
                    </div>
                  </div>

                  {/* Step Description */}
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
                    <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentStep.description}
                    </p>
                  </div>

                  {/* Live Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {Object.entries(currentStep.metrics).map(([k, v]) => (
                      <div
                        key={k}
                        className="p-3 rounded-lg bg-slate-950/80 border border-slate-800"
                      >
                        <p className="text-[10px] text-slate-500 font-mono uppercase">{k}</p>
                        <p className="text-xs font-semibold text-white font-mono mt-0.5 truncate">
                          {String(v)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Python / OpenCV Source Code Section */}
                  <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                    <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-mono font-bold text-slate-200">
                          Python & OpenCV Script (Academic Implementation)
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyCode(currentStep.pythonSnippet)}
                        className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 transition-colors"
                      >
                        {copiedCode ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy Snippet
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 text-xs font-mono text-amber-200/90 overflow-x-auto leading-relaxed bg-slate-950">
                      <code>{currentStep.pythonSnippet}</code>
                    </pre>
                  </div>
                </div>
              ) : (
                /* Grid Gallery View of All 6 Steps */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {steps.map((st, idx) => (
                    <div
                      key={st.id}
                      onClick={() => {
                        setSelectedStepIdx(idx);
                        setViewMode('deep_dive');
                      }}
                      className="group p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 transition-all cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded bg-slate-800 text-amber-400 font-mono text-[11px] flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span className="truncate">{st.name.split(':')[1] || st.name}</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">Stage {st.stageNumber}</span>
                      </div>

                      <div className="h-36 rounded-lg overflow-hidden bg-slate-900 border border-slate-800/80 flex items-center justify-center">
                        <img
                          src={st.canvasDataUrl}
                          alt={st.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {st.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
