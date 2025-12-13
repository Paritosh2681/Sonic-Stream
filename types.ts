export interface Song {
  id: string;
  file?: File; // Optional because fetched songs won't have a File object
  url: string;
  name: string; // Maps to 'title' in DB
  artist?: string;
  duration?: number;
  coverUrl?: string;
  userId?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export enum PlaybackState {
  PLAYING,
  PAUSED,
  STOPPED
}