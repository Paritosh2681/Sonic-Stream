import { supabase } from './supabaseClient';
import { Song } from '../types';

export const uploadTrack = async (file: File, userId: string, metadata: { title: string; artist?: string; duration?: number }) => {
  // 1. Sanitize filename and create path
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  // 2. Upload Audio File
  const { error: uploadError } = await supabase.storage
    .from('audio')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error("Storage upload details:", uploadError);
    throw new Error(`Storage Upload Failed: ${uploadError.message}`);
  }

  // 3. Get Public URL
  const { data: { publicUrl } } = supabase.storage
    .from('audio')
    .getPublicUrl(filePath);

  // 4. Insert Record into DB
  // This must succeed for the track to be valid. We do not catch errors silently here.
  const { data, error: dbError } = await supabase
    .from('tracks')
    .insert({
      user_id: userId, // explicit user_id mapping
      title: metadata.title || file.name.replace(/\.[^/.]+$/, ""),
      artist: metadata.artist || 'Unknown Artist',
      url: publicUrl,
      duration: metadata.duration || 0,
    })
    .select(); // .select() ensures we get the inserted row back

  if (dbError) {
    console.error("Database insert details:", dbError);
    // Attempt to clean up the orphaned file if DB insert fails
    await supabase.storage.from('audio').remove([filePath]);
    throw new Error(`Database Record Creation Failed: ${dbError.message} (Code: ${dbError.code})`);
  }

  if (!data || data.length === 0) {
    throw new Error("Database Insert succeeded but returned no data. Check RLS policies.");
  }

  const savedTrack = data[0];

  // Return the confirmed database object
  return {
    id: savedTrack.id,
    url: savedTrack.url,
    name: savedTrack.title || savedTrack.name,
    artist: savedTrack.artist,
    duration: savedTrack.duration,
    userId: savedTrack.user_id,
    file: file // Keep local file reference for immediate playback if needed, though URL is preferred
  } as Song;
};

export const fetchUserTracks = async (userId: string): Promise<Song[]> => {
  try {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('user_id', userId)
      .order('id', { ascending: false }); // Show newest first

    if (error) {
       console.error('Error fetching tracks:', error.message);
       throw error;
    }

    if (!data) return [];

    return data.map((track: any) => ({
      id: track.id,
      url: track.url,
      name: track.title, 
      artist: track.artist,
      duration: track.duration,
      userId: track.user_id
    }));

  } catch (error: any) {
    console.error('Fetch error:', error);
    // Return empty array so UI doesn't crash, but log error
    return [];
  }
};