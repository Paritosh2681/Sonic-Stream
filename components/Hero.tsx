import React, { useRef } from 'react';
import { Button } from './Button';
import { Upload, PlayCircle, Users, Music } from 'lucide-react';
import { Song } from '../types';

interface HeroProps {
  onUpload: (file: File) => void;
  currentSong: Song | null;
  onPlayClick: () => void;
  onViewLibrary: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onUpload, currentSong, onPlayClick, onViewLibrary }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center pt-32 pb-16 overflow-hidden">
      
      {/* Animated Blobs - Increased intensity for specific Hero glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-sky-600/30 rounded-full blur-[100px] animate-pulse opacity-60 mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 left-[-10%] w-[600px] h-[600px] bg-indigo-900/40 rounded-full blur-[120px] animate-pulse opacity-50 pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 container mx-auto px-6 md:px-12">
        {/* Changed from ScrollReveal to standard div with animation class to guarantee visibility on load */}
        <div className="max-w-4xl space-y-6 animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
          
          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm mb-2 transition-colors hover:bg-white/10 cursor-default">
             <div className="flex -space-x-2">
                <div className="w-5 h-5 rounded-full bg-slate-700 border border-black"></div>
                <div className="w-5 h-5 rounded-full bg-slate-600 border border-black"></div>
                <div className="w-5 h-5 rounded-full bg-slate-500 border border-black flex items-center justify-center text-[8px] text-white">
                  <Users className="w-2.5 h-2.5" />
                </div>
             </div>
             <span className="text-xs text-slate-400 font-medium tracking-wide">
               <span className="text-sky-400">120+</span> beta users joined
             </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-normal tracking-tighter text-left">
            <span className="block text-white mb-2">Precision Playback</span>
            <span className="block text-sky-500 drop-shadow-[0_0_15px_rgba(14,165,233,0.5)]">
              For Your Local Files
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed text-left">
            No streaming compression. Local, bit-perfect, zero-latency rendering for your offline collection.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-5 pt-6">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="audio/*"
              className="hidden" 
            />
            
            <div className="flex flex-col w-full sm:w-auto gap-3">
              <Button 
                size="lg" 
                onClick={() => fileInputRef.current?.click()}
                className="group w-full sm:w-auto"
              >
                <Upload className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" />
                Drop a track to test
              </Button>
              
              <Button 
                variant="secondary"
                size="md"
                onClick={onViewLibrary}
                className="w-full sm:w-auto justify-center"
              >
                <Music className="w-4 h-4 mr-2 text-zinc-400" />
                View Library
              </Button>
            </div>
            
            {currentSong && (
              <Button 
                variant="outline" 
                size="lg"
                onClick={onPlayClick}
                className="w-full sm:w-auto"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Play "{currentSong.name}"
              </Button>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};