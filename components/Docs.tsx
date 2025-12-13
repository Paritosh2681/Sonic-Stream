import React from 'react';
import { FileAudio, ShieldAlert, Cpu, Terminal } from 'lucide-react';

export const Docs: React.FC = () => {
  return (
    <section id="docs" className="py-32 bg-zinc-950 relative border-t border-zinc-900">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="mb-16 border-b border-zinc-900 pb-8">
            <h2 className="text-4xl md:text-5xl font-heading text-white mb-6">Documentation</h2>
            <p className="text-zinc-400 text-lg max-w-2xl">
              Technical reference for the SonicStream audio engine. <br/>
              Everything runs locally. Here is how it works.
            </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
           
           {/* Column 1 */}
           <div className="space-y-12">
              <div className="group">
                 <div className="flex items-center gap-3 text-sky-500 font-medium mb-4">
                    <FileAudio className="w-5 h-5" />
                    <h3 className="text-white text-xl">Supported Formats</h3>
                 </div>
                 <p className="text-zinc-500 leading-relaxed mb-4">
                    SonicStream leverages the <span className="text-zinc-300 font-mono text-xs p-1 bg-zinc-900 rounded">AudioContext</span> API. Support depends on your browser (Chrome/Firefox/Safari).
                 </p>
                 <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-zinc-400">
                      <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full mt-2"></span>
                      <span><strong className="text-zinc-200">FLAC</strong> - 16/24-bit lossless. Recommended.</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-zinc-400">
                      <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full mt-2"></span>
                      <span><strong className="text-zinc-200">MP3</strong> - 320kbps recommended.</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-zinc-400">
                      <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full mt-2"></span>
                      <span><strong className="text-zinc-200">WAV</strong> - Uncompressed PCM.</span>
                    </li>
                 </ul>
              </div>

              <div className="group">
                 <div className="flex items-center gap-3 text-sky-500 font-medium mb-4">
                    <ShieldAlert className="w-5 h-5" />
                    <h3 className="text-white text-xl">Sandbox Mode</h3>
                 </div>
                 <p className="text-zinc-500 leading-relaxed">
                    If you are not logged in, or if the connection fails, the player enters <strong className="text-white">Sandbox Mode</strong>. 
                    Files are blobs in memory. Refreshing the page wipes the state. This is a feature, not a bug, ensuring zero data persistence on shared machines.
                 </p>
              </div>
           </div>

           {/* Column 2 */}
           <div className="space-y-12">
              <div className="group">
                 <div className="flex items-center gap-3 text-sky-500 font-medium mb-4">
                    <Cpu className="w-5 h-5" />
                    <h3 className="text-white text-xl">Audio Engine Specs</h3>
                 </div>
                 <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                       <span className="text-zinc-500 text-sm">Sample Rate</span>
                       <span className="text-zinc-300 font-mono text-sm">Up to 96kHz</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                       <span className="text-zinc-500 text-sm">Latency</span>
                       <span className="text-zinc-300 font-mono text-sm">&lt; 10ms</span>
                    </div>
                    <div className="flex justify-between pb-2">
                       <span className="text-zinc-500 text-sm">Processing</span>
                       <span className="text-zinc-300 font-mono text-sm">32-bit Float</span>
                    </div>
                 </div>
              </div>

              <div className="group">
                 <div className="flex items-center gap-3 text-sky-500 font-medium mb-4">
                    <Terminal className="w-5 h-5" />
                    <h3 className="text-white text-xl">CLI Metadata</h3>
                 </div>
                 <p className="text-zinc-500 leading-relaxed mb-4">
                    We use ID3v2.4 tags for metadata. If your cover art isn't showing, ensure it's embedded as <span className="font-mono text-xs text-zinc-400 bg-zinc-900 px-1">APIC</span> type Front Cover.
                 </p>
              </div>
           </div>

        </div>
      </div>
    </section>
  );
};