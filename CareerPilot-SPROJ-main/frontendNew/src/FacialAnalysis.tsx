import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

type HistoryEntry = { emotion: string; attention: string };

interface FacialAnalysisProps {
  onAnalysisUpdate?: (data: { emotion: string; attention: string }) => void;
}

export default function FacialAnalysis({ onAnalysisUpdate }: FacialAnalysisProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState("Loading models...");
  const [emotion, setEmotion] = useState("Detecting...");
  const [attention, setAttention] = useState("Analyzing...");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load models
  const loadModels = async () => {
    const MODEL_URL = "/models";
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL + "/tiny_face_detector_model");
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL + "/face_expression_model");
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL + "/face_landmark_68");
    setStatus("Models loaded");
  };

  // Start webcam
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setStatus("Camera access denied: " + (err as Error).message);
    }
  };

  // Analyze face
  const analyze = async () => {
    if (!videoRef.current) return;

    const detections = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 1024, scoreThreshold: 0.5 }))
      .withFaceLandmarks()
      .withFaceExpressions();

    if (detections && detections.expressions) {
      const expr = detections.expressions;
      const keys = Object.keys(expr) as Array<keyof typeof expr>;
      let mainEmotion: string = keys.reduce((a, b) => (expr[a] > expr[b] ? a : b));

      // Head tilt for attention
      const points = detections.landmarks.positions;
      const leftEye = points[36];
      const rightEye = points[45];
      const dx = Math.abs(leftEye.x - rightEye.x);
      const dy = Math.abs(leftEye.y - rightEye.y);
      const tiltRatio = dy / dx;
      const focusState = tiltRatio > 0.2 ? "Not focused" : "Focused";

      // Approximate nervousness
      if ((expr.fearful > 0.01 || expr.surprised > 0.1 || expr.sad > 0.01) && focusState === 'Not focused') {
        mainEmotion = "nervous"; 
      }

      setEmotion(mainEmotion);
      setAttention(focusState);

      setHistory((prev) => [...prev.slice(-9), { emotion: mainEmotion, attention: focusState }]);

      if (onAnalysisUpdate) {
        onAnalysisUpdate({ emotion: mainEmotion, attention: focusState });
      }
    } else {
      setEmotion("No face detected");
      setAttention("Not focused");
      if (onAnalysisUpdate) onAnalysisUpdate({ emotion: "none", attention: "none" });
    }
  };

  useEffect(() => {
    loadModels().then(() => {
      startVideo();
      const interval = setInterval(analyze, 1000);
      return () => clearInterval(interval);
    });
  }, []);

  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="text-lg font-bold mb-2">Facial Analysis</h2>
      <p>{status}</p>
      <video
        ref={videoRef}
        autoPlay
        muted
        width={320}
        height={240}
        style={{ borderRadius: "10px", marginTop: "10px" }}
      />
      <div className="mt-2">
        <p><strong>Emotion:</strong> {emotion}</p>
        <p><strong>Attention:</strong> {attention}</p>
      </div>
    </div>
  );
}
