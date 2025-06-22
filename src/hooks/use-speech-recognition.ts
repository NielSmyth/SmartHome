"use client";

import { useEffect, useState, useRef } from 'react';

interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  start: () => void;
  stop: () => void;
  supported: boolean;
  error: string | null;
}

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string) => void;
}

export const useSpeechRecognition = (options: UseSpeechRecognitionOptions = {}): SpeechRecognitionHook => {
  const { onResult } = options;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
      if (onResult) {
        onResult(currentTranscript);
      }
    };

    recognitionRef.current = recognition;
  }, [onResult]);

  const start = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stop = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  return {
    isListening,
    transcript,
    start,
    stop,
    supported: !!recognitionRef.current,
    error,
  };
};
