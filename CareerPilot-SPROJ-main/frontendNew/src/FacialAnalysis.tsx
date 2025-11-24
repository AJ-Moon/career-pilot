import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

type HistoryEntry = { timestamp: Date; emotion: string; attention: string };

interface FacialAnalysisProps {
  onAnalysisUpdate?: (data: { emotion: string; attention: string }) => void;
}

export default function FacialAnalysis({ onAnalysisUpdate }: FacialAnalysisProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState("Loading models...");
  const [emotion, setEmotion] = useState("Detecting...");
  const [attention, setAttention] = useState("Analyzing...");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Utility: log events
  const logEvent = (emotion: string, attention: string) => {
    const entry: HistoryEntry = { timestamp: new Date(), emotion, attention };
    setHistory(prev => [...prev.slice(-19), entry]); // keep last 20 logs
  };

  // Load face-api models
  const loadModels = async () => {
    const MODEL_URL = "/models";
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL + "/tiny_face_detector_model");
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL + "/face_expression_model");
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL + "/face_landmark_68");
      setStatus("Models loaded. Starting webcam...");
    } catch (err) {
      setStatus("Error loading models: " + (err as Error).message);
    }
  };

  // Start webcam
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      logEvent("Interview started", "N/A");
    } catch (err) {
      setStatus("Camera access denied: " + (err as Error).message);
    }
  };

  // Analyze face every second
  const analyze = async () => {
    if (!videoRef.current) return;

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.5 }))
      .withFaceLandmarks()
      .withFaceExpressions();

    if (detection && detection.expressions) {
      const expr = detection.expressions;
      const keys = Object.keys(expr) as Array<keyof typeof expr>;
      let mainEmotion: string = keys.reduce((a, b) => (expr[a] > expr[b] ? a : b));

      // Head tilt attention
      const points = detection.landmarks.positions;
      const leftEye = points[36];
      const rightEye = points[45];
      const dx = Math.abs(leftEye.x - rightEye.x);
      const dy = Math.abs(leftEye.y - rightEye.y);
      const tiltRatio = dy / dx;
      const focusState = tiltRatio > 0.2 ? "Not focused" : "Focused";

      // Adjust emotion if nervous
      if ((expr.fearful > 0.01 || expr.surprised > 0.1 || expr.sad > 0.01) && focusState === "Not focused") {
        mainEmotion = "nervous";
      }

      setEmotion(mainEmotion);
      setAttention(focusState);
      logEvent(mainEmotion, focusState);

      if (onAnalysisUpdate) onAnalysisUpdate({ emotion: mainEmotion, attention: focusState });
    } else {
      setEmotion("No face detected");
      setAttention("Not focused");
      logEvent("No face detected", "Not focused");
      if (onAnalysisUpdate) onAnalysisUpdate({ emotion: "none", attention: "none" });
    }
  };

  useEffect(() => {
    loadModels().then(startVideo);
    const interval = setInterval(analyze, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center text-center w-full">
      <h2 className="text-lg font-bold mb-2">Facial Analysis</h2>
      <p className="text-sm text-gray-500">{status}</p>
      
      <video
        ref={videoRef}
        autoPlay
        muted
        width={320}
        height={240}
        className="rounded-lg border border-gray-300 mt-2"
      />

      <div className="mt-2 mb-2">
        <p><strong>Emotion:</strong> {emotion}</p>
        <p><strong>Attention:</strong> {attention}</p>
      </div>

      {/* Live Logs */}
      <div className="overflow-y-auto h-36 w-full max-w-md bg-white rounded p-2 border border-gray-200">
        <h3 className="font-medium mb-1 text-sm">Live Logs (last 20 events):</h3>
        {history.map((h, i) => (
          <div key={i} className="flex justify-between text-xs mb-1">
            <span>{h.timestamp.toLocaleTimeString()}</span>
            <span>{h.emotion}</span>
            <span>{h.attention}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
