"""
AutoLume Image Processor Service
OpenCV Computer Vision Preprocessing Pipeline
"""

import cv2
import numpy as np


class ImageProcessor:
    """
    Handles preprocessing of vehicle frames to optimize license plate localization
    and character recognition clarity.
    """

    @staticmethod
    def resize(image, width=640, height=400):
        """Standardizes input dimensions for consistent filter kernel scaling."""
        return cv2.resize(image, (width, height), interpolation=cv2.INTER_AREA)

    @staticmethod
    def to_grayscale(image):
        """Converts BGR image to single-channel Luminance (ITU-R BT.601 weights)."""
        if len(image.shape) == 2:
            return image
        return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    @staticmethod
    def reduce_noise(gray_image, kernel_size=(5, 5), sigma=0):
        """Applies Gaussian Blur to eliminate high-frequency sensor noise & road grain."""
        return cv2.GaussianBlur(gray_image, kernel_size, sigma)

    @staticmethod
    def detect_edges(blurred_image, low_thresh=40, high_thresh=130):
        """Canny Edge Detection with hysteresis gradient tracking."""
        return cv2.Canny(blurred_image, low_thresh, high_thresh)

    @staticmethod
    def apply_morphology(edges_image, op="close", kernel_size=(5, 5), iterations=1):
        """
        Morphological closing/dilation to connect broken character edges
        and bridge rectangular plate boundaries.
        """
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, kernel_size)
        if op == "close":
            return cv2.morphologyEx(edges_image, cv2.MORPH_CLOSE, kernel, iterations=iterations)
        elif op == "dilate":
            return cv2.dilate(edges_image, kernel, iterations=iterations)
        elif op == "erode":
            return cv2.erode(edges_image, kernel, iterations=iterations)
        return edges_image

    @staticmethod
    def binarize_plate_roi(plate_roi):
        """
        Applies Otsu automatic global thresholding and contrast normalization
        specifically on cropped license plate ROI for PyTesseract OCR.
        """
        if len(plate_roi.shape) == 3:
            gray = cv2.cvtColor(plate_roi, cv2.COLOR_BGR2GRAY)
        else:
            gray = plate_roi

        # Contrast stretch
        norm = cv2.normalize(gray, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX)
        _, thresh = cv2.threshold(norm, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        return thresh

    @classmethod
    def run_preprocessing_pipeline(cls, bgr_image):
        """
        Executes the sequential OpenCV preprocessing pipeline.
        Returns a dictionary of stage matrices.
        """
        resized = cls.resize(bgr_image)
        gray = cls.to_grayscale(resized)
        blurred = cls.reduce_noise(gray, (5, 5))
        edges = cls.detect_edges(blurred, 45, 130)
        closed = cls.apply_morphology(edges, "close", (5, 5), 1)

        return {
            "resized": resized,
            "grayscale": gray,
            "blurred": blurred,
            "edges": edges,
            "morphology": closed,
        }
