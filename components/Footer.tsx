import React from 'react';
import { Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black py-24 border-t border-zinc-900 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          
          <div className="space-y-6 max-w-md">
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-sky-600 rounded-full animate-pulse"></div>
               <p className="text-zinc-200 font-medium">Built late at night by a human.</p>
             </div>
             
             <div className="space-y-4 text-sm text-zinc-500 leading-relaxed">
               <p>
                 I just wanted a music player that looked good and didn't annoy me with ads or tracking scripts. 
               </p>
             </div>
          </div>

          <div className="flex flex-col md:items-end gap-6 pt-2">
             <div className="flex items-center gap-6">
                <a 
                  href="https://github.com/Paritosh2681/Music-Player-" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-zinc-600 hover:text-white transition-colors group"
                >
                  <Github className="w-4 h-4" />
                  <span className="text-sm group-hover:underline decoration-zinc-700 underline-offset-4">Source Code</span>
                </a>
             </div>
             
             <div className="text-right">
                <p className="text-zinc-700 text-xs font-mono">
                  Tested on Chrome. Might explode on Safari.
                </p>
             </div>
          </div>

        </div>

      </div>
    </footer>
  );
};