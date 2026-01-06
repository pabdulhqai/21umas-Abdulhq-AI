
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, ShieldCheck, Activity } from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

const LiveAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcription, setTranscription] = useState('');
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Manually implemented base64 encoding as required by guidelines
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  // Manually implemented base64 decoding as required by guidelines
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  // Decodes raw PCM audio bytes to an AudioBuffer for playback
  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
    return buffer;
  };

  const toggleSession = async () => {
    if (isActive) {
      if (sessionRef.current) sessionRef.current.close();
      setIsActive(false);
      return;
    }

    setIsConnecting(true);
    // Create a new GoogleGenAI instance right before making an API call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputCtx = new AudioContext({ sampleRate: 16000 });
      const outputCtx = new AudioContext({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      let nextStartTime = 0;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: "أنت مساعد صوتي مباشر لجامعة 21 سبتمبر. تحدث بوضوح ومهنية طبية. حافظ على إجاباتك موجزة ومركزة."
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const input = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(input.length);
              for (let i = 0; i < input.length; i++) int16[i] = input[i] * 32768;
              // Ensure data is streamed only after the session promise resolves
              sessionPromise.then(s => s.sendRealtimeInput({ 
                media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } 
              }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            // Process the model's output audio bytes
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              const buffer = await decodeAudioData(decode(audioData), outputCtx);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });

              // Schedule gapless playback
              nextStartTime = Math.max(nextStartTime, outputCtx.currentTime);
              source.start(nextStartTime);
              nextStartTime += buffer.duration;
              sourcesRef.current.add(source);
            }

            // Handle session interruption
            if (msg.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) {
                try {
                  source.stop();
                } catch (e) {
                  // Ignore errors if already stopped
                }
              }
              sourcesRef.current.clear();
              nextStartTime = 0;
            }
          },
          onclose: () => setIsActive(false),
          onerror: (e) => {
            console.error('Live session error:', e);
            setIsConnecting(false);
          }
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to connect to live session:', err);
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] glass rounded-3xl p-10 shadow-2xl border-2 border-emerald-100">
      <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 transition-all duration-500 ${isActive ? 'bg-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.4)]' : 'bg-slate-200'}`}>
        {isActive ? (
          <div className="pulse-animation w-24 h-24 rounded-full bg-emerald-400 flex items-center justify-center">
             <Activity size={48} className="text-white animate-pulse" />
          </div>
        ) : (
          <MicOff size={48} className="text-slate-400" />
        )}
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-2">المساعد الصوتي المباشر</h2>
      <p className="text-slate-500 text-center max-w-sm mb-8">تحدث مباشرة مع الذكاء الاصطناعي للحصول على استشارات أكاديمية وطبية فورية.</p>

      <button
        onClick={toggleSession}
        disabled={isConnecting}
        className={`px-10 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 ${
          isActive ? 'bg-red-500 text-white' : 'medical-gradient text-white'
        }`}
      >
        {isConnecting ? 'جاري الاتصال...' : isActive ? 'إنهاء الجلسة' : 'بدء التحدث الآن'}
        {isActive ? <MicOff size={24} /> : <Mic size={24} />}
      </button>

      <div className="mt-8 flex gap-6">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={14} className="text-emerald-500" />
          اتصال مشفر وآمن
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Volume2 size={14} className="text-blue-500" />
          جودة صوت 24kHz
        </div>
      </div>
    </div>
  );
};

export default LiveAssistant;
