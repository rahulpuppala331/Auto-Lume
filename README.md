# AutoLume – Intelligent License Plate Recognition System

AutoLume is an intelligent, production-grade Automatic License Plate Recognition (ALPR / ANPR) platform designed to detect, crop, and transcribe vehicle license plates in real time from images, video streams, and live camera sensors.

---

## 1. What AutoLume Is

AutoLume automates vehicle identification across traffic monitoring, highway electronic toll collection (FASTag), smart parking gate barriers, and law enforcement hotlist tracking.

### Core Processing Journey:
$$\text{Input Image/Video} \longrightarrow \text{OpenCV Preprocessing} \longrightarrow \text{YOLO Plate Localization} \longrightarrow \text{Plate ROI Crop} \longrightarrow \text{PyTesseract OCR} \longrightarrow \text{Syntax Validation} \longrightarrow \text{MongoDB Persistence} \longrightarrow \text{React Dashboard}$$

---

## 2. System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                     React.js Frontend                       │
│  (Dashboard • Detect Plate • Live Stream • History • Stats) │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST API (JSON / Multipart)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Python Flask REST API                     │
│                  (backend/app.py : 5000)                    │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┴───────────────────────┐
       ▼                                               ▼
┌─────────────────────────────┐         ┌─────────────────────────────┐
│  OpenCV Preprocessing       │         │       MongoDB Database      │
│  • BGR to Grayscale         │         │  • Collection: detections   │
│  • Gaussian Blur (5x5)      │         │  • Query & Analytics Stats  │
│  • Canny Edges (40, 130)    │         └─────────────────────────────┘
│  • Morphological Closing    │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│    YOLOv8 Plate Detector    │
│  (models/plate_model.pt)    │
│  • Bounding Box & Crop ROI  │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│     PyTesseract OCR         │
│  • Single Line (PSM 7)      │
│  • LSTM Neural Net OCR      │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│   Plate Validator Service   │
│  • Disambiguate O/0, I/1    │
│  • Indian HSRP / US / Euro  │
└─────────────────────────────┘
```

---

## 3. Technologies Used

- **Frontend**: React 19, Tailwind CSS, TypeScript, Lucide Icons, Canvas Web APIs.
- **Backend**: Python 3.10+, Flask, Flask-CORS, python-dotenv.
- **Computer Vision**: OpenCV (cv2), Ultralytics YOLOv8.
- **Character Recognition**: PyTesseract (Tesseract OCR 5.3+).
- **Database**: MongoDB (via PyMongo) with in-memory replica fallback.

---

## 4. Frontend Setup

The frontend is a Vite + React application configured with Tailwind CSS:

```bash
# Navigate to workspace root
npm install

# Start Vite development server (port 3000)
npm run dev
```

---

## 5. Backend Setup

The Python Flask backend is located in `/backend`:

```bash
cd backend

# Create Python virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install required packages
pip install -r requirements.txt
```

---

## 6. MongoDB Setup

AutoLume stores all detections in MongoDB in the `autolume_db.detections` collection.

### Local MongoDB:
```bash
# Install and run MongoDB community server
sudo systemctl start mongod
```

### MongoDB Atlas (Cloud):
Set your connection string in `backend/.env`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/autolume_db?retryWrites=true&w=majority
```

*Note: If no MongoDB instance is running, AutoLume automatically falls back to its built-in in-memory database adapter so you can test immediately without setup errors.*

---

## 7. Tesseract Installation

Install the native Tesseract OCR binary on your host OS:

### Ubuntu / Debian:
```bash
sudo apt update
sudo apt install tesseract-ocr tesseract-ocr-eng
```

### macOS (Homebrew):
```bash
brew install tesseract
```

### Windows:
Download the installer from [UB-Mannheim Tesseract](https://github.com/UB-Mannheim/tesseract/wiki) and add `C:\Program Files\Tesseract-OCR` to your `PATH` or specify `TESSERACT_CMD` in `backend/.env`.

---

## 8. YOLO Model Placement

Place your trained YOLO license plate weights file at:

```text
models/
  └── license_plate_model.pt
```

Configure the path in `backend/.env`:
```env
YOLO_MODEL_PATH=../models/license_plate_model.pt
```

---

## 9. Environment Variables

Create `backend/.env` from the provided `backend/.env.example`:

```env
FLASK_PORT=5000
FLASK_ENV=development
MONGODB_URI=mongodb://localhost:27017/autolume_db
YOLO_MODEL_PATH=../models/license_plate_model.pt
TESSERACT_CMD=
DEMO_MODE=false
```

---

## 10. How to Run Frontend

```bash
npm run dev
# Accessible at http://localhost:3000
```

---

## 11. How to Run Backend

```bash
cd backend
python app.py
# Flask server will listen on http://0.0.0.0:5000
```

---

## 12. REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/detect/image` | Process single vehicle image (OpenCV $\to$ YOLO $\to$ PyTesseract $\to$ Mongo) |
| `POST` | `/api/detect/video` | Asynchronous frame analysis for video files |
| `POST` | `/api/detect/frame` | Single-frame stream endpoint for live camera |
| `GET` | `/api/detections` | Retrieve paginated detection logs with status/source filters |
| `GET` | `/api/detections/:id` | Fetch full detection details, bounding box, and cropped ROI |
| `DELETE` | `/api/detections/:id` | Remove detection record from MongoDB |
| `GET` | `/api/analytics` | Summary KPI metrics, daily volume trends, confidence buckets |
| `GET` | `/api/health` | Service health status (YOLO, OCR, MongoDB) |
| `GET` | `/api/settings` | Read system settings and thresholds |
| `POST` | `/api/settings` | Update thresholds or toggle Demo Mode |

---

## 13. Demo Mode

AutoLume includes a built-in **Demo Mode** (`DEMO_MODE=true` or via the UI Settings toggle).

When Demo Mode is enabled:
- The complete full-stack interface works seamlessly without requiring external GPU hardware or local Tesseract binary installation.
- Curated sample vehicle images (Clear Daylight, Night Glare, Rain/Mud, EV Green Plate, US/EU formats) can be processed through the complete 6-stage visual pipeline.
- Detections are stored in the database and displayed with clear demo status badges.

---

## 14. How to Replace the Demo Detector with a Real YOLO Model

1. Train a YOLOv8 nano/small model on license plate datasets (e.g. Roboflow ALPR or CCPD).
2. Export the trained weights: `best.pt`.
3. Copy `best.pt` to `models/license_plate_model.pt`.
4. In `backend/.env`, set:
   ```env
   YOLO_MODEL_PATH=../models/license_plate_model.pt
   DEMO_MODE=false
   ```
5. Restart the Flask server. `PlateDetector` will log:
   `[AutoLume YOLO] Successfully loaded trained weights from: models/license_plate_model.pt`.
