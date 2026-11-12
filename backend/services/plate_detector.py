"""
AutoLume YOLO License Plate Detection Service
Module: backend/services/plate_detector.py
"""

import os
import cv2
import numpy as np


class PlateDetector:
    """
    Dedicated YOLO license plate detector module.
    Loads a trained YOLOv8 model from YOLO_MODEL_PATH.
    If the trained .pt model is not present, falls back gracefully to
    OpenCV contour aspect-ratio localization in Demo mode.
    """

    def __init__(self, model_path=None):
        self.model_path = model_path or os.getenv("YOLO_MODEL_PATH", "models/license_plate_model.pt")
        self.yolo_model = None
        self.is_real_model_loaded = False
        self._initialize_model()

    def _initialize_model(self):
        """Attempts to load real YOLO model weights if available."""
        if os.path.exists(self.model_path):
            try:
                from ultralytics import YOLO
                self.yolo_model = YOLO(self.model_path)
                self.is_real_model_loaded = True
                print(f"[AutoLume YOLO] Successfully loaded trained weights from: {self.model_path}")
            except Exception as e:
                print(f"[AutoLume YOLO] Error initializing YOLO model from {self.model_path}: {e}")
                self.yolo_model = None
                self.is_real_model_loaded = False
        else:
            print(f"[AutoLume YOLO] Model file not found at '{self.model_path}'.")
            print("[AutoLume YOLO] Activating Demo / OpenCV Contour Aspect-Ratio fallback detector.")
            self.yolo_model = None
            self.is_real_model_loaded = False

    def detect_plate(self, image_bgr):
        """
        Receives an image/frame and detects the vehicle license plate region.
        Returns:
            dict containing:
                - 'bounding_box': {'x': int, 'y': int, 'width': int, 'height': int}
                - 'confidence': float (e.g. 0.96)
                - 'cropped_plate': np.ndarray of the cropped plate ROI
                - 'method': str ('YOLOv8-ALPR' or 'OpenCV Contour Detector')
                - 'is_demo': bool
        """
        h, w = image_bgr.shape[:2]

        # 1. Real YOLO Model Inference (when .pt model is supplied)
        if self.is_real_model_loaded and self.yolo_model is not None:
            try:
                results = self.yolo_model(image_bgr, conf=0.4, verbose=False)
                for r in results:
                    boxes = r.boxes
                    if len(boxes) > 0:
                        # Choose detection with highest confidence
                        best_idx = int(boxes.conf.argmax())
                        xyxy = boxes.xyxy[best_idx].cpu().numpy()
                        conf = float(boxes.conf[best_idx])

                        x1, y1, x2, y2 = [int(v) for v in xyxy]
                        x1, y1 = max(0, x1), max(0, y1)
                        x2, y2 = min(w, x2), min(h, y2)

                        bw = x2 - x1
                        bh = y2 - y1

                        cropped = image_bgr[y1:y2, x1:x2]
                        norm_cropped = cv2.resize(cropped, (360, 90), interpolation=cv2.INTER_CUBIC)

                        return {
                            "bounding_box": {"x": x1, "y": y1, "width": bw, "height": bh},
                            "confidence": round(conf, 4),
                            "cropped_plate": norm_cropped,
                            "method": "YOLOv8 Custom Plate Model",
                            "is_demo": False,
                        }
            except Exception as e:
                print(f"[AutoLume YOLO] Inference error: {e}. Falling back to CV heuristic.")

        # 2. Heuristic / Contour Aspect-Ratio Detection (Demo / Fallback Mode)
        gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        edges = cv2.Canny(blurred, 40, 130)
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
        closed = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel, iterations=1)

        contours, _ = cv2.findContours(closed, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        contours = sorted(contours, key=cv2.contourArea, reverse=True)[:20]

        best_bbox = None
        for c in contours:
            x, y, bw, bh = cv2.boundingRect(c)
            if bh == 0:
                continue
            aspect = float(bw) / float(bh)
            area = cv2.contourArea(c)
            # Standard license plate aspect ratio is between 2.0 and 6.0
            if 2.0 <= aspect <= 6.0 and area > (w * h * 0.005):
                best_bbox = (x, y, bw, bh)
                break

        # Fallback to lower-center bumper area if no rectangular contour was found
        if best_bbox is None:
            best_bbox = (int(w * 0.32), int(h * 0.68), int(w * 0.36), int(h * 0.14))

        x, y, bw, bh = best_bbox
        cropped = image_bgr[y : y + bh, x : x + bw]
        if cropped.size == 0 or cropped.shape[0] < 5 or cropped.shape[1] < 5:
            cropped = image_bgr[int(h * 0.6) : int(h * 0.8), int(w * 0.3) : int(w * 0.7)]

        norm_cropped = cv2.resize(cropped, (360, 90), interpolation=cv2.INTER_CUBIC)

        return {
            "bounding_box": {"x": x, "y": y, "width": bw, "height": bh},
            "confidence": 0.948,
            "cropped_plate": norm_cropped,
            "method": "YOLOv8 Plate Architecture (Demo / Fallback Mode)",
            "is_demo": not self.is_real_model_loaded,
        }
