import React from 'react';
import { Shield, WifiOff, HardDrive } from 'lucide-react';

export const WhyLocal: React.FC = () => {
  return (
    <section id="why-local" className="py-24 bg-black relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-heading text-white mb-6">
              Reclaim Your <br />
              <span className="text-sky-500">Digital Sovereignty</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              In an era of subscription fatigue and data mining, we believe your music collection belongs to you, not a cloud server.
            </p>
            
            <div className="space-y-8">
              <div className="flex gap-4 group">
                <div className="w-12 h-12 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-800 group-hover:border-sky-500/50 transition-colors">
                  <WifiOff className="w-6 h-6 text-zinc-400 group-hover:text-sky-500 transition-colors" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">True Offline Freedom</h3>
                  <p className="text-zinc-500 text-sm">No internet required. No buffering. Your music plays instantly, anywhere, even in a Faraday cage.</p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="w-12 h-12 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-800 group-hover:border-sky-500/50 transition-colors">
                  <Shield className="w-6 h-6 text-zinc-400 group-hover:text-sky-500 transition-colors" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Total Privacy</h3>
                  <p className="text-zinc-500 text-sm">We don't know what you listen to. We don't want to know. Every byte stays in your browser's local sandbox.</p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="w-12 h-12 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-800 group-hover:border-sky-500/50 transition-colors">
                  <HardDrive className="w-6 h-6 text-zinc-400 group-hover:text-sky-500 transition-colors" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Bit-Perfect Quality</h3>
                  <p className="text-zinc-500 text-sm">Streaming services compress audio to save bandwidth. Local files deliver the raw, uncompressed experience you deserve.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-12 md:mt-0">
            {/* Abstract visual representation of quality comparison */}
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 to-purple-500/10 blur-3xl rounded-full"></div>
            <div className="relative bg-zinc-950/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
               <div className="space-y-4 font-mono text-sm">
                  <div className="flex justify-between text-zinc-600 border-b border-zinc-800 pb-2 text-xs tracking-widest uppercase">
                    <span>Metric</span>
                    <span>Streaming</span>
                    <span className="text-sky-500">Local</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-900">
                    <span className="text-zinc-400">Bitrate</span>
                    <span className="text-zinc-600">~320 kbps</span>
                    <span className="text-sky-400">1411+ kbps</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-900">
                    <span className="text-zinc-400">Latency</span>
                    <span className="text-zinc-600">Variable</span>
                    <span className="text-sky-400">0ms</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-900">
                    <span className="text-zinc-400">Ownership</span>
                    <span className="text-zinc-600">Rented</span>
                    <span className="text-sky-400">Owned</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-400">Tracking</span>
                    <span className="text-zinc-600">Active</span>
                    <span className="text-sky-400">None</span>
                  </div>
               </div>
               
               <div className="mt-8 pt-6 border-t border-zinc-800">
                  <div className="flex items-end justify-between mb-2">
                     <span className="text-xs text-zinc-500 uppercase tracking-wider">Audio Fidelity</span>
                     <span className="text-xs text-sky-500 font-bold">100%</span>
                  </div>
                  <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                     <div className="h-full bg-gradient-to-r from-sky-600 to-sky-400 w-full"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};