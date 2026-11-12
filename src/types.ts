export type SourceType = 'image' | 'video' | 'camera';
export type DetectionStatus = 'detected' | 'review' | 'failed';

export interface BoundingBox {
  x: number; // percentage or px
  y: number;
  width: number;
  height: number;
}

export interface CharacterConfidence {
  char: string;
  conf: number;
  bbox?: [number, number, number, number];
}

export type CharacterBox = CharacterConfidence;

export interface VehicleMetadata {
  make?: string;
  model?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleClass?: string;
  color?: string;
  stateCode?: string;
  stateName?: string;
  ownerName?: string;
  insuranceValidUntil?: string;
  pucValidUntil?: string;
  fastTagBalance?: number;
  isStolen?: boolean;
  alertReason?: string;
  registrationDate?: string;
  parkingStatus?: {
    isParked: boolean;
    bay?: string;
    entryTime?: string;
  };
}

export type VehicleRecord = VehicleMetadata & {
  plateNumber: string;
  normalizedPlate: string;
  isWanted?: boolean;
};

export interface DetectionRecord {
  id: string;
  _id?: string;
  plateNumber: string;
  confidence: number;
  sourceType: SourceType;
  originalFile?: string; // Data URL or URL
  processedImage?: string; // OpenCV processed preview data URL
  croppedPlate?: string; // Cropped plate data URL
  boundingBox: BoundingBox;
  timestamp: string; // ISO string
  processingTime: number; // in seconds (e.g. 1.24)
  status: DetectionStatus;
  detectionMethod: string; // 'YOLOv8 + OpenCV + Tesseract OCR'
  rawOcrText?: string;
  characters?: CharacterConfidence[];
  vehicleMetadata?: VehicleMetadata;
  notes?: string;
  isDemo?: boolean;
  // Video specific fields
  videoId?: string;
  frameNumber?: number;
  videoTimestamp?: string;
}

export interface ALPRResult {
  plateNumber: string;
  formattedPlate: string;
  confidence: number;
  boundingBox: BoundingBox;
  vehicleType: string;
  vehicleColor: string;
  countryOrState: string;
  notes: string;
  charBreakdown: CharacterConfidence[];
  vehicleRecord?: VehicleRecord;
  pipelineLatency: {
    preprocessingMs: number;
    yoloDetectionMs: number;
    croppingAndDeskewMs: number;
    tesseractOcrMs: number;
    postProcessingMs: number;
    totalMs: number;
  };
}

export interface PipelineParams {
  blurRadius: number; // 1 to 9 (Gaussian kernel)
  cannyLow: number; // 20 to 150
  cannyHigh: number; // 80 to 250
  thresholdMode: 'otsu' | 'adaptive' | 'manual';
  manualThreshold: number; // 50 to 200
  dilationIters: number; // 0 to 4
  minAspectRatio: number; // 2.0 to 3.0
  maxAspectRatio: number; // 4.5 to 6.5
  minPlateAreaPct: number; // 0.5 to 5.0
}

export interface PipelineStepOutput {
  id: string;
  name: string;
  stageNumber: number;
  description: string;
  pythonSnippet: string;
  canvasDataUrl: string;
  metrics: { [key: string]: string | number };
}

export interface PresetVehicle {
  id: string;
  name: string;
  plate: string;
  formattedPlate: string;
  vehicle: string;
  challenge: string;
  challengeType: 'clear' | 'low_light' | 'rain' | 'dirty' | 'ev' | 'angled';
  svgDataUrl: string;
  realPlateBBox: BoundingBox;
  defaultParams?: Partial<PipelineParams>;
}

export type PresetVehicleSample = PresetVehicle;

export interface VideoInputSource {
  id: string;
  title: string;
  description: string;
  durationSec: number;
  fps: number;
  platesInVideo: {
    startSec: number;
    endSec: number;
    plate: string;
    formattedPlate: string;
    vehicle: string;
    bboxAtStart: BoundingBox;
    bboxAtEnd: BoundingBox;
    challenge: string;
  }[];
}

export interface VideoDetectionEvent {
  id: string;
  timestampSec: number;
  timestampFormatted: string;
  plate: string;
  formattedPlate: string;
  vehicle: string;
  confidence: number;
  bbox: BoundingBox;
  frameSnapshotDataUrl?: string;
}

export interface TollTransaction {
  id: string;
  plateNumber: string;
  timestamp: string;
  tollPlaza: string;
  lane: string;
  vehicleClass: string;
  fee: number;
  fastTagStatus: 'PAID' | 'LOW_BALANCE' | 'EXEMPT' | 'MANUAL_REQUIRED';
  remainingBalance: number;
}

export interface DashboardStats {
  totalDetections: number;
  platesDetected: number;
  detectionAccuracy: number;
  todayDetections: number;
  recentDetections: DetectionRecord[];
}

export interface AnalyticsData {
  totalDetections: number;
  platesDetected: number;
  todayDetections: number;
  detectionSuccessRate: number;
  averageConfidence: number;
  imageCount: number;
  videoCount: number;
  cameraCount: number;
  dailyTrends: { day: string; count: number; date: string }[];
  confidenceBuckets: {
    high: number; // >= 90%
    review: number; // 70-89%
    low: number; // < 70%
  };
  topPlates: { plateNumber: string; count: number; lastSeen: string; status: DetectionStatus }[];
}

export interface SystemSettings {
  demoMode: boolean;
  confidenceThreshold: number; // e.g. 75
  highConfidenceThreshold: number; // 90
  reviewConfidenceThreshold: number; // 70
  maxUploadSizeBytes: number; // 25 MB
  flaskApiUrl: string;
  mongoDbConnected: boolean;
  yoloModelStatus: 'available' | 'mock_active' | 'unavailable';
  tesseractStatus: 'available' | 'unavailable';
  backendStatus: 'connected' | 'demo_mode' | 'disconnected';
  theme: 'dark' | 'light';
}
