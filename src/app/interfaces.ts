export interface PlaylistInfo {
  name: string,
  id: string,
  author: string
}

export interface PlaylistVideo {
  name: string,
  id: string,
  author: string,
  length: number,
  thumbnail: string
}

export interface Playlist {
  details: PlaylistInfo,
  videos: PlaylistVideo[]
}

function EmptyPlaylist(): Playlist {
  const playlist: Playlist = {
    details: {
      name: "",
      id: "",
      author: ""
    },
    videos: []
  };
  return playlist;
}

export { EmptyPlaylist }
