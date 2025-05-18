import React, { useEffect, useState, useRef } from 'react';
import { AudioLevelIndicator } from '../components/AudioLevelIndicator';

interface AudioLevelContainerProps {
  stream: MediaStream | null;
  className?: string;
}

export function AudioLevelContainer({ stream, className = '' }: AudioLevelContainerProps) {
  const [level, setLevel] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!stream) {
      setLevel(0);
      return;
    }

    const setupAudioAnalysis = async () => {
      try {
        // Cleanup previous audio context if exists
        if (sourceRef.current) {
          sourceRef.current.disconnect();
          sourceRef.current = null;
        }
        if (audioContextRef.current) {
          if (audioContextRef.current.state !== 'closed') {
            await audioContextRef.current.close();
          }
          audioContextRef.current = null;
        }
        if (analyserRef.current) {
          analyserRef.current = null;
        }

        // Initialize new audio context and analyser
        const context = new AudioContext();
        const analyser = context.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.3;

        const source = context.createMediaStreamSource(stream);
        source.connect(analyser);

        // Store references
        audioContextRef.current = context;
        analyserRef.current = analyser;
        sourceRef.current = source;

        // Start audio level monitoring
        const updateLevel = () => {
          if (!analyserRef.current) return;

          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          
          // Calculate RMS (Root Mean Square) for better level representation
          const rms = Math.sqrt(
            dataArray.reduce((acc, val) => acc + (val * val), 0) / dataArray.length
          );
          
          // Apply a more responsive curve
          const normalizedLevel = Math.pow(rms / 255, 0.5);
          setLevel(normalizedLevel);

          animationFrameRef.current = requestAnimationFrame(updateLevel);
        };

        updateLevel();
      } catch (error) {
        console.error('Error setting up audio analysis:', error);
      }
    };

    setupAudioAnalysis();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }
      if (audioContextRef.current) {
        if (audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
        }
        audioContextRef.current = null;
      }
      if (analyserRef.current) {
        analyserRef.current = null;
      }
    };
  }, [stream]);

  return <AudioLevelIndicator level={level} className={className} />;
} 