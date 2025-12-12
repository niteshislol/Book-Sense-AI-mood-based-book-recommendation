import React, { useState, useRef, useEffect } from 'react';
import { MOOD_GENRE_MAP } from '../constants';
import { analyzeMoodAndRecommend } from '../services/geminiService';
import { Book, MoodResult } from '../types';

interface MoodDetectorProps {
  onRecommendationFound: (moodData?: MoodResult) => void;
}

type Mode = 'manual' | 'camera';

const MoodDetector: React.FC<MoodDetectorProps> = ({ onRecommendationFound }) => {
  const [mode, setMode] = useState<Mode>('manual');
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not access camera. Please allow permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (mode === 'camera') startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [mode]);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsScanning(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];

      try {
        const moodResult = await analyzeMoodAndRecommend(base64Image);
        onRecommendationFound(moodResult);
      } catch (e) {
        console.error("Mood detection error:", e);
        alert(`Failed to analyze mood. Error: ${e instanceof Error ? e.message : String(e)}`);
      } finally {
        setIsScanning(false);
      }
    }
  };

  const handleManualSelect = (mood: string) => {
    const genres = MOOD_GENRE_MAP[mood] || ['Fiction'];
    onRecommendationFound({ mood, confidence: 100, suggestedGenres: genres });
  };

  return (
    <div className="container mx-auto px-6 py-24 min-h-screen flex flex-col items-center">

      <h2 className="text-4xl font-poppins font-bold text-gray-900 dark:text-white mb-4 text-center">How are you feeling?</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-10 text-center max-w-lg">
        Let our AI analyze your mood to find the perfect book for your emotional state.
      </p>

      {/* Mode Switcher */}
      <div className="flex bg-gray-200 dark:bg-white/5 rounded-full p-1 mb-10 border border-gray-300 dark:border-white/10">
        <button
          onClick={() => setMode('manual')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === 'manual' ? 'bg-[#6f57ff] text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
        >
          Manual Selector
        </button>
        <button
          onClick={() => setMode('camera')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === 'camera' ? 'bg-[#6f57ff] text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
        >
          AI Camera Detect
        </button>
      </div>

      {/* Manual Mode */}
      {mode === 'manual' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in">
          {[
            { l: 'Happy', i: '😀' }, { l: 'Sad', i: '😔' },
            { l: 'Excited', i: '🤩' }, { l: 'Bored', i: '😐' },
            { l: 'Stressed', i: '😖' }, { l: 'Romantic', i: '❤️' }
          ].map((m) => (
            <button
              key={m.l}
              onClick={() => handleManualSelect(m.l)}
              className="glass-panel w-32 h-32 flex flex-col items-center justify-center rounded-2xl hover:scale-110 hover:bg-white/80 dark:hover:bg-white/10 transition-all border-gray-200 dark:border-white/10 group"
            >
              <span className="text-4xl mb-2 group-hover:scale-125 transition-transform">{m.i}</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white">{m.l}</span>
            </button>
          ))}
        </div>
      )}

      {/* Camera Mode */}
      {mode === 'camera' && (
        <div className="flex flex-col items-center w-full max-w-md animate-fade-in relative">
          <div className="relative w-full aspect-[4/3] rounded-[32px] overflow-hidden border-2 border-gray-300 dark:border-white/20 shadow-[0_0_50px_rgba(111,87,255,0.2)] bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />

            {/* Overlay Grid */}
            <div className="absolute inset-0 border-[20px] border-black/20 dark:border-white/5 pointer-events-none rounded-[32px]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border border-white/30 rounded-[50%] opacity-50 pointer-events-none"></div>

            {isScanning && (
              <div className="absolute inset-0 bg-[#6f57ff]/20 z-10 flex items-center justify-center backdrop-blur-sm">
                <div className="text-white font-bold animate-pulse text-xl">Analysing Expressions...</div>
              </div>
            )}
          </div>

          <button
            onClick={handleCapture}
            disabled={isScanning}
            className="mt-8 px-8 py-4 bg-gradient-to-r from-[#6f57ff] to-[#5da6ff] rounded-full text-white font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all flex items-center gap-2"
          >
            {isScanning ? 'Thinking...' : (
              <>
                <span>✨</span> Detect Mood with Gemini
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default MoodDetector;