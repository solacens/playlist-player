import { Injectable } from '@angular/core';
import { first, map, Observable, reduce, shareReplay } from 'rxjs';

import axios from 'axios';

import { Playlist, PlaylistInfo, PlaylistVideo } from 'src/app/interfaces';
import { ConfigService } from './config.service';

const THRESHOLD_90D = 98.0;

@Injectable({
  providedIn: 'root'
})

export class RequestService {

  constructor(private config: ConfigService) { }

  serverList = new Observable<string>(observer => {
    if (this.config.preferredSource) {
      observer.next(this.config.preferredSource);
      observer.complete();
    }
    else {
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
    }
  }).pipe(shareReplay(1))

  getPlaylist(id: string, forceUpdate: boolean = false): Observable<Playlist> {
    return new Observable<any>(observer => {
      this.serverList.subscribe(serverBaseUri => {
        const cache = this.config.getPlaylistCache(id);
        if (cache.details.id == id && !forceUpdate) {
          observer.next(cache);
          observer.complete();
        }
        else {
          axios.get(`https://${serverBaseUri}/api/v1/playlists/${id}`)
            .then((response) => {
              this.config.preferredSource = serverBaseUri;
              observer.next(response.data);
              const videoCount = response.data.videoCount;
              if (videoCount > 200) {
                const extraFetchCount = Math.ceil(videoCount / 150) - 1;
                for (let i = 1; i <= extraFetchCount; i++) {
                  axios.get(`https://${serverBaseUri}/api/v1/playlists/${id}?page=${i * 3}`)
                    .then((response) => {
                      this.config.preferredSource = serverBaseUri;
                      observer.next(response.data);
                      if (i == extraFetchCount) {
                        observer.complete();
                      }
                    })
                    .catch((error) => {
                      this.config.preferredSource = "";
                      observer.error(error);
                    });
                }
              }
              else {
                observer.complete();
              }
            })
            .catch((error) => {
              this.config.preferredSource = "";
              observer.error(error);
            });
        }
      })
    }).pipe(
      // Reduce video data from paginations into a single list
      reduce((acc: any, next: any) => {
        // Instance of `Playlist`
        if ("details" in acc && "videos" in acc) {
          return acc;
        }
        // Transformation if that's raw response
        else {
          const playlistInfo: PlaylistInfo = {
            name: acc.title,
            id: acc.playlistId,
            author: acc.author
          };
          const playlistVideoList: PlaylistVideo[] = acc.videos
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
          const playlist: Playlist = {
            details: playlistInfo,
            videos: playlistVideoList
          }
          for (let i in next.videos) {
            const raw = next.videos[i];
            const playlistVideo: PlaylistVideo = {
              name: raw.title,
              id: raw.videoId,
              author: raw.author,
              length: raw.lengthSeconds,
              thumbnail: raw.videoThumbnails.filter((z: any) => z.quality == 'default')[0].url
            };
            playlist.videos.push(playlistVideo);
          }
          return playlist;
        }
      }),
      map(x => {
        x.videos = [...new Map(x.videos.map((x: PlaylistVideo) => [x.id, x])).values()]
        this.config.setPlaylistCache(x.details.id, x);
        return x;
      })
    );
  }

  getPlaylistInfo(id: string): Observable<PlaylistInfo> {
    return this.getPlaylist(id).pipe(
      first(),
      map(x => {
        return x.details
      })
    );
  }

}
