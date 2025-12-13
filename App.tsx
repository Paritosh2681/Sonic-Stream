import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { InfoSection } from './components/InfoSection';
import { WhyLocal } from './components/WhyLocal';
import { Footer } from './components/Footer';
import { Player } from './components/Player';
import { FullPlayer } from './components/FullPlayer';
import { LoginModal } from './components/LoginModal';
import { Library } from './components/Library';
import { Docs } from './components/Docs';
import { Song, User } from './types';
import { extractMetadata } from './services/metadataService';
import { supabase } from './services/supabaseClient';
import { uploadTrack, fetchUserTracks } from './services/storageService';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

// Toast Component
const Toast: React.FC<{ message: string; type: 'error' | 'success' | 'info'; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    error: 'bg-red-900/90 border-red-700',
    success: 'bg-green-900/90 border-green-700',
    info: 'bg-sky-900/90 border-sky-700'
  };

  return (
    <div className={`fixed top-24 right-6 z-[100] flex items-start gap-3 px-4 py-3 rounded-lg border shadow-xl backdrop-blur-md max-w-sm animate-[slideIn_0.3s_ease-out] ${bgColors[type]}`}>
      {type === 'error' ? <AlertCircle className="w-5 h-5 text-white/80 mt-0.5" /> : <CheckCircle className="w-5 h-5 text-white/80 mt-0.5" />}
      <div className="flex-1">
        <p className="text-sm text-white font-medium leading-snug">{message}</p>
      </div>
      <button onClick={onClose} className="text-white/60 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
  
  // Navigation State
  const [view, setView] = useState<'home' | 'library'>('home');
  
  // Audio State
  const [library, setLibrary] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);

  // Define refreshLibrary using useCallback
  const refreshLibrary = useCallback(async (userId: string) => {
    try {
      console.log("Syncing library for user:", userId);
      const remoteTracks = await fetchUserTracks(userId);
      setLibrary(remoteTracks);
    } catch (e) {
      console.error("Failed to refresh library", e);
    }
  }, []);

  // Initialize Supabase Auth Listener & Fetch Library
  useEffect(() => {
    // Helper to sync user and library
    const syncUserSession = async (sessionUser: any) => {
      if (sessionUser) {
        const currentUser = {
          id: sessionUser.id,
          username: sessionUser.email?.split('@')[0] || 'User',
          email: sessionUser.email || ''
        };
        setUser(currentUser);
        // Fetch immediately on login/restore
        refreshLibrary(currentUser.id);
      } else {
        setUser(null);
        setLibrary([]); // Clear library on logout
        setCurrentSong(null);
        setIsPlaying(false);
      }
    };

    // 1. Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncUserSession(session?.user);
    });

    // 2. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUserSession(session?.user);
    });

    return () => subscription.unsubscribe();
  }, [refreshLibrary]);

  // Fetch library when entering library view
  useEffect(() => {
    if (view === 'library' && user) {
      refreshLibrary(user.id);
    }
  }, [view, user, refreshLibrary]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error.message);
    // State clearing handled by auth listener
  };

  const showNotification = (message: string, type: 'error' | 'success' | 'info') => {
    setNotification({ message, type });
  };

  // Audio Handlers
  const handleUpload = async (file: File) => {
    // Strict check for auth before upload
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser || !user) {
      showNotification("Please sign in to upload music.", 'info');
      setIsLoginOpen(true);
      return;
    }

    setIsUploading(true);
    let title = file.name.replace(/\.[^/.]+$/, "");
    let artist = 'Unknown Artist';
    let coverUrl: string | undefined = undefined;

    try {
      // 1. Extract Metadata
      const metadata = await extractMetadata(file);
      title = metadata.title || title;
      artist = metadata.artist || artist;
      coverUrl = metadata.coverUrl;

      // 2. Upload to Supabase Storage & DB
      const newSong = await uploadTrack(file, currentUser.id, {
        title,
        artist,
        duration: 0 
      });

      // 3. Add coverUrl locally for this session
      newSong.coverUrl = coverUrl;

      // 4. Update Library State
      setLibrary(prev => [newSong, ...prev]);
      setCurrentSong(newSong);
      setIsPlaying(true);
      setView('library');
      showNotification("Track uploaded & synced successfully", 'success');

    } catch (error: any) {
      console.error("Upload/Sync failed:", error);
      const msg = error.message || "Unknown error";

      // FALLBACK: If Cloud sync fails (RLS, Network), play locally
      const localUrl = URL.createObjectURL(file);
      const tempSong: Song = {
        id: `local-${Date.now()}`,
        url: localUrl,
        name: title,
        artist: artist,
        duration: 0,
        userId: user.id,
        file: file,
        coverUrl: coverUrl
      };

      setLibrary(prev => [tempSong, ...prev]);
      setCurrentSong(tempSong);
      setIsPlaying(true);
      setView('library');

      // Detailed Handling for RLS Errors
      if (msg.includes("Storage Upload Failed") && msg.includes("security policy")) {
        showNotification("Upload failed (Storage Permissions). Playing locally.", 'error');
        
        console.group('%c ⚠️ Supabase Storage RLS Policy Missing', 'color: #fbbf24; font-weight: bold; font-size: 14px;');
        console.log('%cRun this SQL to fix Storage permissions:', 'color: #38bdf8;');
        console.log(`
create policy "Allow Individual Uploads" 
on storage.objects for insert 
to authenticated 
with check ( bucket_id = 'audio' AND (storage.foldername(name))[1] = auth.uid()::text );

create policy "Allow Individual View" 
on storage.objects for select 
to authenticated 
using ( bucket_id = 'audio' AND (storage.foldername(name))[1] = auth.uid()::text );
        `);
        console.groupEnd();
      } else if (msg.includes("Database Record Creation Failed") && msg.includes("security policy")) {
        showNotification("Sync failed (Database Permissions). Playing locally.", 'error');

        console.group('%c ⚠️ Supabase Database RLS Policy Missing', 'color: #fbbf24; font-weight: bold; font-size: 14px;');
        console.log('%cRun this SQL to fix Database permissions:', 'color: #38bdf8;');
        console.log(`
-- Run this in Supabase SQL Editor to fix the database error
alter table tracks enable row level security;

create policy "Users can insert their own tracks" 
on tracks for insert 
to authenticated 
with check (auth.uid() = user_id);

create policy "Users can view their own tracks" 
on tracks for select 
to authenticated 
using (auth.uid() = user_id);
        `);
        console.groupEnd();
      } else if (msg.includes("Bucket not found")) {
         showNotification("Setup Error: 'audio' bucket missing. Playing locally.", 'error');
      } else {
        showNotification(`Playing locally. Cloud error: ${msg}`, 'error');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const onTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const onSeek = (time: number) => {
    if (audioRef.current) {
       audioRef.current.currentTime = time;
       setCurrentTime(time);
    }
  };

  const onVolumeChange = (vol: number) => {
    setVolume(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  };

  const handleNavigate = (page: 'home' | 'library') => {
    setView(page);
    window.scrollTo(0, 0);
  };

  // Sync audio element with React state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
            console.error("Playback error", e);
            setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  // Sync volume on load
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume, currentSong]);

  return (
    <div className="min-h-screen bg-black text-slate-200 selection:bg-sky-500/30 relative">
      <div className="bg-noise"></div>
      
      {/* Toast Notifications */}
      {notification && (
        <Toast 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      {/* Invisible Audio Element: The Single Source of Truth */}
      {currentSong && (
        <audio 
          ref={audioRef}
          src={currentSong.url}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          crossOrigin="anonymous" 
        />
      )}

      {/* Upload Loading Overlay */}
      {isUploading && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
             <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
             <p className="text-white font-medium animate-pulse">Uploading & Syncing Database...</p>
          </div>
        </div>
      )}

      <div className="relative z-10">
        <Header 
          user={user} 
          onLoginClick={() => setIsLoginOpen(true)} 
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          currentPage={view}
        />
        
        <main>
          {view === 'home' ? (
             <>
               <Hero 
                 onUpload={handleUpload} 
                 currentSong={currentSong}
                 onPlayClick={() => {
                    if (currentSong) {
                        setIsPlaying(true);
                        setIsFullPlayerOpen(true);
                    }
                 }}
                 onViewLibrary={() => handleNavigate('library')}
               />
               <WhyLocal />
               <InfoSection />
               <Docs />
             </>
          ) : (
             <Library 
                songs={library}
                currentSong={currentSong}
                isPlaying={isPlaying}
                onPlay={(song) => {
                    setCurrentSong(song);
                    setIsPlaying(true);
                }}
                onPause={() => setIsPlaying(false)}
                onNavigateHome={() => handleNavigate('home')}
                user={user}
                onLoginClick={() => setIsLoginOpen(true)}
                onRefresh={() => user && refreshLibrary(user.id)}
             />
          )}
        </main>
        
        {view === 'home' && <Footer />}
      </div>

      {/* Logic: If Full Player is NOT open, show Mini Player */}
      {currentSong && !isFullPlayerOpen && (
        <Player 
          song={currentSong} 
          isPlaying={isPlaying} 
          onTogglePlay={togglePlay} 
          currentTime={currentTime}
          duration={duration}
          onSeek={onSeek}
          onExpand={() => setIsFullPlayerOpen(true)}
        />
      )}

      {/* Full Player Overlay */}
      {currentSong && isFullPlayerOpen && (
        <FullPlayer
          song={currentSong}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          currentTime={currentTime}
          duration={duration}
          onSeek={onSeek}
          volume={volume}
          onVolumeChange={onVolumeChange}
          onClose={() => setIsFullPlayerOpen(false)}
        />
      )}

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
      
      {/* Spacer to prevent content from hiding behind mini player */}
      {currentSong && !isFullPlayerOpen && <div className="h-24" />}
    </div>
  );
};

export default App;