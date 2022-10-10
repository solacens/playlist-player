import { Injectable } from '@angular/core';
import { first, map, Observable, shareReplay } from 'rxjs';

import axios from 'axios';

import { PlaylistInfo, PlaylistVideo } from 'src/app/interfaces';

const THRESHOLD_90D = 98.0;

@Injectable({
  providedIn: 'root'
})

export class RequestService {
  serverList = new Observable(observer => {
    axios.get('https://api.invidious.io/instances.json')
      .then((response) => {
        const servers = response.data
          .filter((x: any[]) => {
            return parseFloat((x[1].monitor ?? { "90dRatio": { "ratio": "0.0" } })["90dRatio"].ratio) > THRESHOLD_90D;
          })
          .map((x: any[]) => x[0]);
        observer.next(servers[Math.floor(Math.random() * servers.length)]);
        observer.complete();
      })
      .catch((error) => {
        observer.error(error);
      });
  }).pipe(shareReplay(1))

  getPlaylist(id: string): Observable<any> {
    return new Observable(observer => {
      this.serverList.subscribe(serverBaseUri => {
        axios.get(`https://${serverBaseUri}/api/v1/playlists/${id}`)
          .then((response) => {
            observer.next(response.data);
            observer.complete();
          })
          .catch((error) => {
            observer.error(error);
          });
      })
    });
  }

  getPlaylistInfo(id: string): Observable<PlaylistInfo> {
    return this.getPlaylist(id).pipe(
      first(),
      map(x => {
        const playlistInfo: PlaylistInfo = {
          name: x.title,
          id: x.playlistId,
          author: x.author
        };
        return playlistInfo
      })
    );
  }

  getPlaylistVideoList(id: string): Observable<PlaylistVideo[]> {
    return this.getPlaylist(id).pipe(
      first(),
      map(x => {
        const playlistVideoList: PlaylistVideo[] = x.videos
          .map((y: any) => {
            const playlistVideo: PlaylistVideo = {
              name: y.title,
              id: y.videoId,
              author: y.author,
              length: y.lengthSeconds,
              thumbnail: y.videoThumbnails.filter((z: any) => z.quality == 'default')[0].url
            };
            return playlistVideo;
          });
        return playlistVideoList;
      })
    );
  }

}
