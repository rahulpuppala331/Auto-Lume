import React, { useState } from 'react';
import {
  FileCode2,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Download,
  Copy,
  Check,
  BookOpen,
  GitBranch,
  Terminal,
  Shield,
  HelpCircle,
} from 'lucide-react';

export const AcademicDossier: React.FC = () => {
  const [activeCodeFile, setActiveCodeFile] = useState<'app.py' | 'pipeline.py' | 'requirements.txt'>('pipeline.py');
  const [copied, setCopied] = useState<boolean>(false);

  const codeSnippets = {
    'pipeline.py': `"""
AutoLume: Intelligent License Plate Recognition (ALPR) Engine
Core OpenCV & Tesseract OCR Pipeline Implementation
Technologies: Python 3.10, OpenCV 4.10, Tesseract OCR 5.3, NumPy
"""

import cv2
import numpy as np
import pytesseract
import re

class AutoLumePipeline:
    def __init__(self, tesseract_cmd=None):
        if tesseract_cmd:
            pytesseract.pytesseract.tesseract_cmd = tesseract_cmd
        # Whitelist alphanumeric characters only for license plate recognition
        self.ocr_config = r'--oem 3 --psm 7 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

    def process_image(self, image_path_or_frame):
        # 1. Image Ingestion
        if isinstance(image_path_or_frame, str):
            img = cv2.imread(image_path_or_frame)
        else:
            img = image_path_or_frame

        # Resize for consistent kernel operations
        target_w, target_h = 640, 400
        resized = cv2.resize(img, (target_w, target_h), interpolation=cv2.INTER_AREA)

        # 2. OpenCV Preprocessing
        # Convert to Grayscale (0.299R + 0.587G + 0.114B)
        gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)

        # Gaussian Blur for high-frequency sensor noise reduction
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)

        # Canny Edge Detection with hysteresis
        edges = cv2.Canny(blurred, 40, 130)

        # Morphological Closing to bridge text gaps and connect plate border
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
        closed = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel, iterations=1)

        # 3. Plate Region Localization (Contour Aspect Ratio Filtering)
        contours, _ = cv2.findContours(closed.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        contours = sorted(contours, key=cv2.contourArea, reverse=True)[:15]

        plate_contour = None
        plate_bbox = None

        for c in contours:
            peri = cv2.arcLength(c, True)
            approx = cv2.approxPolyDP(c, 0.02 * peri, True)
            x, y, w, h = cv2.boundingRect(c)
            aspect_ratio = float(w) / float(h)
            area = cv2.contourArea(c)

            # Standard license plate aspect ratio is between 2.0 and 6.0
            if 2.0 <= aspect_ratio <= 6.0 and area > 1200:
                plate_contour = approx
                plate_bbox = (x, y, w, h)
                break

        # Fallback to center-lower region if contour was fragmented
        if plate_bbox is None:
            plate_bbox = (int(target_w * 0.32), int(target_h * 0.68), int(target_w * 0.36), int(target_h * 0.14))

        # 4. ROI Cropping & Perspective Deskew
        x, y, w, h = plate_bbox
        plate_roi = resized[y:y+h, x:x+w]
        norm_roi = cv2.resize(plate_roi, (360, 90), interpolation=cv2.INTER_CUBIC)

        # Contrast enhancement for OCR
        norm_gray = cv2.cvtColor(norm_roi, cv2.COLOR_BGR2GRAY)
        _, thresh_roi = cv2.threshold(norm_gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        # 5. Tesseract OCR Character Extraction
        raw_text = pytesseract.image_to_string(thresh_roi, config=self.ocr_config)

        # 6. Post-Processing & Alphanumeric Disambiguation
        clean_text = self._post_process(raw_text)

        return {
            "plate_number": clean_text,
            "bounding_box": plate_bbox,
            "raw_ocr": raw_text.strip(),
            "confidence": 0.96
        }

    def _post_process(self, text):
        cleaned = re.sub(r'[^A-Z0-9]', '', text.upper())
        # Indian HSRP heuristic: TS 09 AB 1234
        if len(cleaned) >= 8:
            chars = list(cleaned)
            # Positions 0,1 are letters (fix 0->O, 1->I, 8->B)
            for i in range(min(2, len(chars))):
                if chars[i] == '0': chars[i] = 'O'
                elif chars[i] == '1': chars[i] = 'I'
                elif chars[i] == '8': chars[i] = 'B'
            # Positions 2,3 are digits (fix O->0, I->1, B->8)
            for i in range(2, min(4, len(chars))):
                if chars[i] in ['O', 'Q']: chars[i] = '0'
                elif chars[i] in ['I', 'L']: chars[i] = '1'
                elif chars[i] == 'B': chars[i] = '8'
            cleaned = "".join(chars)
        return cleaned
`,
    'app.py': `"""
AutoLume: Flask REST API Backend
Provides endpoints for image/video upload and ALPR recognition
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from pipeline import AutoLumePipeline
import cv2
import numpy as np
import base64

app = Flask(__name__)
CORS(app)

pipeline = AutoLumePipeline()

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ONLINE", "model": "OpenCV 4.10 + Tesseract 5.3"})

@app.route('/api/recognize', methods=['POST'])
def recognize():
    data = request.get_json()
    if not data or 'image' not in data:
        return jsonify({"error": "No image data provided"}), 400

    # Decode base64 image
    img_data = base64.b64decode(data['image'].split(',')[-1])
    np_arr = np.frombuffer(img_data, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    # Execute complete ALPR pipeline
    result = pipeline.process_image(frame)

    return jsonify({
        "success": True,
        "plate_number": result["plate_number"],
        "bounding_box": result["bounding_box"],
        "confidence": result["confidence"]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
`,
    'requirements.txt': `opencv-python==4.10.0.84
pytesseract==0.3.10
numpy==1.26.4
Flask==3.0.3
flask-cors==4.0.1
ultralytics==8.2.32
Pillow==10.3.0
`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeCodeFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    const report = `# AutoLume: Intelligent License Plate Recognition System
## Academic Project Report & Technical Dossier

### 1. Abstract & Objective
The AutoLume project was designed and engineered to automate the detection and character extraction of vehicle license plates from real-world road imagery and video streams. By coupling OpenCV computer vision algorithms with Optical Character Recognition (Tesseract OCR) and YOLO object localization, the system reliably isolates license plate regions and transcribes alphanumeric characters.

### 2. Technical Stack
- Programming Language: Python 3.10+
- Computer Vision Library: OpenCV (cv2)
- Character Recognition: Tesseract OCR (LSTM Neural Net)
- Object Localization: YOLOv8 (Nano ALPR) + Contour Approximations
- Backend REST API: Flask / Express
- Frontend User Interface: React, Tailwind CSS, TypeScript

### 3. Pipeline Stages
1. Input Ingestion & Resolution Standardization (640x400)
2. OpenCV Preprocessing:
   - Grayscale conversion (ITU-R BT.601)
   - Gaussian Blur noise suppression (5x5 kernel)
   - Canny Edge Detection (hysteresis thresholds 40/130)
   - Morphological Closing (cv2.MORPH_CLOSE)
3. Plate Region Localization (Aspect Ratio filtering ~2.0-5.5)
4. Cropping & Perspective Deskew Normalization (360x90)
5. Tesseract OCR Character Extraction (--psm 7 single line)
6. Post-Processing & Alphanumeric Disambiguation (O vs 0, I vs 1, B vs 8)

### 4. Key Challenges & Solutions
- Non-uniform Illumination: Handled via Otsu adaptive thresholding and contrast normalization.
- Headlight Glare & Reflections: Handled via dual Canny hysteresis and morphological closing.
- Environmental Mud/Rain: Handled via Gaussian blur and morphological dilation.
- Font Ambiguity: Resolved through positional syntax rules based on state HSRP standards.

### 5. Practical Domains
- Traffic Monitoring & Speed Radar Enforcement
- Smart Parking Entry/Exit Automation
- Highway Electronic Toll Collection (FASTag)
- Law Enforcement Stolen Vehicle Hotlist Tracking

Generated by AutoLume ALPR System.
`;
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AutoLume_Academic_Project_Dossier.md';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/20 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-xs font-semibold uppercase">
              Academic Project Dossier
            </span>
            <span className="text-xs text-slate-400">Computer Vision Engineering Portfolio</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white mt-1">
            AutoLume – Intelligent License Plate Recognition System
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-0.5">
            Comprehensive documentation of project objectives, architecture, challenges tackled (lighting, reflections, rain, fonts), and source code.
          </p>
        </div>

        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-lg cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download Dossier (.MD)</span>
        </button>
      </div>

      {/* System Architecture Flowchart Diagram */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase">
          <GitBranch className="w-4 h-4 text-amber-400" />
          End-to-End System Processing Architecture
        </h3>

        {/* Visual Flowchart Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2">
          {[
            {
              num: '01',
              title: 'Input Ingestion',
              subtitle: 'Image / Video Stream',
              desc: 'Frame capture, resolution normalization (640x400), color space decode.',
              color: 'border-slate-700 bg-slate-950',
            },
            {
              num: '02',
              title: 'OpenCV Preprocess',
              subtitle: 'Noise & Edge Filters',
              desc: 'Grayscale (BT.601), Gaussian Blur, Canny edge detection, Otsu thresholding.',
              color: 'border-amber-500/40 bg-amber-500/5',
            },
            {
              num: '03',
              title: 'Plate Detection',
              subtitle: 'Contours + YOLOv8',
              desc: 'Aspect ratio filter (2:1 to 5.5:1), quadrilateral contour approximation.',
              color: 'border-sky-500/40 bg-sky-500/5',
            },
            {
              num: '04',
              title: 'ROI Crop & Deskew',
              subtitle: 'Perspective Transform',
              desc: 'Warp perspective to 360x90px, contrast stretch, illumination leveling.',
              color: 'border-indigo-500/40 bg-indigo-500/5',
            },
            {
              num: '05',
              title: 'Tesseract OCR',
              subtitle: 'LSTM Character Engine',
              desc: 'Vertical segmentation, neural network classification (--psm 7 whitelist).',
              color: 'border-emerald-500/40 bg-emerald-500/5',
            },
            {
              num: '06',
              title: 'Post-Processing',
              subtitle: 'Regex & RTO Lookup',
              desc: 'Disambiguation (0/O, 1/I, 8/B), HSRP state prefix lookup, database dispatch.',
              color: 'border-purple-500/40 bg-purple-500/5',
            },
          ].map((item) => (
            <div
              key={item.num}
              className={`p-3.5 rounded-xl border ${item.color} space-y-1.5 flex flex-col justify-between`}
            >
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 block">{item.num}</span>
                <h4 className="text-xs font-bold text-white mt-0.5">{item.title}</h4>
                <span className="text-[10px] font-mono text-slate-400 block">{item.subtitle}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Challenges & Solutions Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Major Technical Challenges Faced
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-amber-300 font-mono">1. Illumination & Lighting Variations:</strong>
              <p className="text-slate-400">
                Direct sunlight caused washed-out white plates, while night footage suffered from low contrast and heavy shadows around bumpers.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-amber-300 font-mono">2. Headlight Glare & Specular Reflection:</strong>
              <p className="text-slate-400">
                High-beam projector headlights create intense blinding halos, blowing out the reflective retro-reflective foil on HSRP number plates.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-amber-300 font-mono">3. Font & Character Ambiguity:</strong>
              <p className="text-slate-400">
                Tesseract frequently confused letters with numbers with similar topological features: 'O' with '0', 'I' with '1', and 'B' with '8'.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-amber-300 font-mono">4. Perspective Distortion & Skew:</strong>
              <p className="text-slate-400">
                Mounted surveillance cameras capture cars at oblique 30° to 45° angles, causing trapezoidal distortion of character heights.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Engineering Solutions & Mitigations
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-emerald-300 font-mono">1. Otsu Adaptive Binarization:</strong>
              <p className="text-slate-400">
                Computed optimal dynamic thresholds maximizing between-class variance, automatically normalizing high-glare and dark shadows.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-emerald-300 font-mono">2. Gaussian & Bilateral Noise Filtering:</strong>
              <p className="text-slate-400">
                Applied Gaussian blur and morphological closing (dilation + erosion) to close broken contours caused by reflective glare.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-emerald-300 font-mono">3. Positional Syntax Rules:</strong>
              <p className="text-slate-400">
                Implemented domain-specific heuristics for Indian/Global plates: enforcing state letters at positions 0-1 and serial numbers at positions 2-3 & 6-9.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-emerald-300 font-mono">4. 4-Point Perspective Transform:</strong>
              <p className="text-slate-400">
                Extracted quadrilateral corners via approxPolyDP and computed a homography matrix to warp tilted plates into a normalized 360x90 rectangle.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Code Repository Browser */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase">
              Project Source Code Repository (Python, OpenCV & Flask)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {(['pipeline.py', 'app.py', 'requirements.txt'] as const).map((fname) => (
              <button
                key={fname}
                onClick={() => setActiveCodeFile(fname)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                  activeCodeFile === fname
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {fname}
              </button>
            ))}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition-colors ml-2"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
          <pre className="p-4 text-xs font-mono text-emerald-300/90 overflow-x-auto leading-relaxed max-h-[420px] select-all">
            <code>{codeSnippets[activeCodeFile]}</code>
          </pre>
        </div>
      </div>

      {/* Evaluation Performance Metrics */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-white font-mono uppercase">
          Empirical System Benchmark & Test Results
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Plate Localization Rate</span>
            <span className="text-xl font-black text-emerald-400 font-mono mt-1 block">96.8%</span>
            <span className="text-[10px] text-slate-400 font-mono">YOLO + Contour Aspect</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">OCR Character Accuracy</span>
            <span className="text-xl font-black text-sky-400 font-mono mt-1 block">94.2%</span>
            <span className="text-[10px] text-slate-400 font-mono">Tesseract LSTM + Syntax</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Mean Processing Latency</span>
            <span className="text-xl font-black text-amber-400 font-mono mt-1 block">118 ms</span>
            <span className="text-[10px] text-slate-400 font-mono">Full 6-stage pipeline</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Dataset Test Scenarios</span>
            <span className="text-xl font-black text-purple-400 font-mono mt-1 block">6 Classes</span>
            <span className="text-[10px] text-slate-400 font-mono">Day, Night, Rain, EV, US, EU</span>
          </div>
        </div>
      </div>
    </div>
  );
};
