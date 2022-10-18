export interface PlaylistInfo {
  name: string,
  id: string,
  author: string
}

export interface PlaylistVideo {
  name: string,
  id: string,
  url: string,
  author: string,
  length: number,
  thumbnail: string
}

export interface Playlist {
  details: PlaylistInfo,
  videos: PlaylistVideo[]
}

export interface PlayState {
  currentIndex: number,
  currentTime: number,
  playing: boolean,
  duration: number
}

export interface StreamState {
  playing: boolean;
  readableCurrentTime: string;
  readableDuration: string;
  duration: number | undefined;
  currentTime: number | undefined;
  volume: number;
  canplay: boolean;
  error: boolean;
}

//////////////////////////////

function EmptyPlaylist(): Playlist {
  return {
    details: {
      name: "",
      id: "",
      author: ""
    },
    videos: []
  };
}

function NewPlayState(): PlayState {
  return {
    currentIndex: 0,
    currentTime: 0,
    playing: false,
    duration: 0
  };
}

function EmptyStreamState(): StreamState {
  return {
    playing: false,
    readableCurrentTime: "",
    readableDuration: "",
    duration: undefined,
    currentTime: 0,
    volume: 0,
    canplay: true,
    error: false
  };
}

export { EmptyPlaylist, NewPlayState, EmptyStreamState }
