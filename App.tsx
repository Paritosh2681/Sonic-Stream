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
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
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
    if (userId === 'guest') return; // Guests don't sync
    if (!isSupabaseConfigured) return; // Skip if no backend

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
    if (!isSupabaseConfigured) {
      console.log("Supabase not configured (Offline Mode). Auth disabled.");
      return;
    }

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
        // Only clear if we aren't already in guest mode
        setUser(prev => prev?.id === 'guest' ? prev : null);
        if (user?.id !== 'guest') {
           setLibrary([]); 
           setCurrentSong(null);
           setIsPlaying(false);
        }
      }
    };

    // 1. Check initial session
    supabase.auth.getSession()
      .then(({ data }) => {
        syncUserSession(data?.session?.user);
      })
      .catch(err => {
        console.warn("Supabase auth check failed (offline mode):", err);
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
    if (view === 'library' && user && user.id !== 'guest') {
      refreshLibrary(user.id);
    }
  }, [view, user, refreshLibrary]);

  const handleLogout = async () => {
    if (user?.id === 'guest') {
      setUser(null);
      setLibrary([]);
      setCurrentSong(null);
      setIsPlaying(false);
      setView('home');
      return;
    }
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut();
      if (error) console.error('Error signing out:', error.message);
    } else {
      setUser(null);
    }
  };

  const handleGuestLogin = () => {
    setUser({ id: 'guest', username: 'Guest', email: '' });
    setIsLoginOpen(false);
    showNotification("Entered Guest Mode. Tracks will not be saved to cloud.", 'info');
  };

  const showNotification = (message: string, type: 'error' | 'success' | 'info') => {
    setNotification({ message, type });
  };

  // Audio Handlers
  const handleUpload = async (file: File) => {
    // Strict check for auth before upload
    if (!user) {
      showNotification("Please sign in or continue as guest to upload music.", 'info');
      setIsLoginOpen(true);
      return;
    }

    setIsUploading(true);
    let title = file.name.replace(/\.[^/.]+$/, "");
    let artist = 'Unknown Artist';
    let coverUrl: string | undefined = undefined;

    // GUEST MODE or NO BACKEND MODE
    if (user.id === 'guest' || !isSupabaseConfigured) {
        try {
          const metadata = await extractMetadata(file);
          title = metadata.title || title;
          artist = metadata.artist || artist;
          coverUrl = metadata.coverUrl;

          const guestSong: Song = {
            id: `guest-${Date.now()}`,
            url: URL.createObjectURL(file), // Create local blob URL
            name: title,
            artist: artist,
            duration: 0,
            userId: 'guest',
            file: file,
            coverUrl: coverUrl
          };

          setLibrary(prev => [guestSong, ...prev]);
          setCurrentSong(guestSong);
          setIsPlaying(true);
          setView('library');
          
          if (!isSupabaseConfigured && user.id !== 'guest') {
             showNotification("Backend not connected. Playing locally.", 'info');
          } else {
             showNotification("Playing local track (Guest Mode)", 'success');
          }
        } catch (e) {
          showNotification("Failed to load local file", 'error');
        } finally {
          setIsUploading(false);
        }
        return;
    }

    // AUTHENTICATED UPLOAD LOGIC
    try {
      // 1. Extract Metadata
      const metadata = await extractMetadata(file);
      title = metadata.title || title;
      artist = metadata.artist || artist;
      coverUrl = metadata.coverUrl;

      // 2. Upload to Supabase Storage & DB
      const newSong = await uploadTrack(file, user.id, {
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

      if (msg.includes("Storage Upload Failed")) {
        showNotification("Upload failed (Storage). Playing locally.", 'error');
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
    if (audioRef.current) {
        setDuration(audioRef.current.duration);
        // Force volume application on metadata load
        audioRef.current.volume = volume;
    }
  };
  
  const handleAudioError = (e: any) => {
    console.error("Audio playback error:", e);
    // Only show notification if we actually have a song loaded
    if (currentSong) {
        showNotification("Error playing audio file. Format may be unsupported.", 'error');
        setIsPlaying(false);
    }
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
        // We use a promise check to prevent "The play() request was interrupted" errors
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => {
                console.error("Playback start error:", e);
                // Don't auto-pause here immediately to avoid UI flickering if it's just a race condition
                // But if it's "NotAllowedError", we should probably pause UI
                if (e.name === 'NotAllowedError') {
                    setIsPlaying(false);
                    showNotification("Autoplay blocked. Click play to start.", 'info');
                }
            });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  // Sync volume on load - ensuring it's always applied
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
      {/* Removed crossOrigin="anonymous" to fix Blob URL playback on some browsers */}
      {currentSong && (
        <audio 
          ref={audioRef}
          src={currentSong.url}
          preload="auto"
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onError={handleAudioError}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Upload Loading Overlay */}
      {isUploading && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
             <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
             <p className="text-white font-medium animate-pulse">
               {user?.id === 'guest' ? 'Processing Local Audio...' : 'Uploading & Syncing...'}
             </p>
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
        onGuestLogin={handleGuestLogin}
      />
      
      {/* Spacer to prevent content from hiding behind mini player */}
      {currentSong && !isFullPlayerOpen && <div className="h-24" />}
    </div>
  );
};

export default App;