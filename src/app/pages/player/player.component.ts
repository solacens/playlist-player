import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from "@angular/router";

import { RequestService } from 'src/app/request.service';

import { Playlist, EmptyPlaylist, StreamState, EmptyStreamState } from 'src/app/interfaces';
import { AudioService } from 'src/app/audio.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  constructor(private route: ActivatedRoute, private titleService: Title, private request: RequestService, private audio: AudioService) { }

  title = "";

  currentIndex = 0;

  state: StreamState = EmptyStreamState();

  playlist: Playlist = EmptyPlaylist();

  updateTitle() {
    const title = `${this.playlist.details.name} - ${this.currentIndex + 1}/${this.playlist.videos.length}`
    this.titleService.setTitle(title);
    this.title = title;
  }

  updatePlaylist() {
    const playlistId = this.playlist.details.id;
    this.playlist = EmptyPlaylist();
    this.request.getPlaylist(playlistId, true).subscribe((playlist: Playlist) => {
      this.playlist = this.shufflePlaylist(playlist);
      this.state = EmptyStreamState();
      this.titleService.setTitle(playlist.details.name);
    });
  }

  shuffle(x: any[]) {
    for (let i = x.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [x[i], x[j]] = [x[j], x[i]];
    }
    return x;
  }

  shufflePlaylist(x: Playlist): Playlist {
    x.videos = this.shuffle(x.videos);
    return x
  }

  loadSong(index = 0) {
    this.currentIndex = index
    this.state.duration = this.playlist.videos[index].length;
    this.updateTitle();
    this.playStream();
  }

  isFirstPlaying() {
    return this.currentIndex == 0;
  }

  isLastPlaying() {
    return this.currentIndex == this.playlist.videos.length - 1;
  }

  classIsPlaying(index: number) {
    return `pointer ${(this.currentIndex == index) ? 'playing' : ''}`
  }

  playStream() {
    this.audio.stop();
    this.request.resolveVideoId(this.playlist.videos[this.currentIndex].id).subscribe(url => {
      this.audio.playStream(url).subscribe((events: any) => {
        if (events.type == 'ended') {
          if (!this.isLastPlaying()) {
            this.next();
          } else {
            this.playlist = this.shufflePlaylist(this.playlist);
            this.currentIndex = 0;
            this.playStream();
          }
        }
      });
    });
  }

  play() {
    this.audio.play()
  }

  pause() {
    this.audio.pause()
  }

  previous() {
    this.loadSong(this.currentIndex - 1);
  }

  next() {
    this.loadSong(this.currentIndex + 1);
  }

  onSliderChangeEnd(event: any) {
    this.audio.seekTo(event.value);
  }

  ngOnInit(): void {
    const route = this.route.pathFromRoot;
    route[route.length - 1].url.subscribe(url => {
      const playlistId = url[0].path
      this.request.getPlaylist(playlistId).subscribe((playlist: Playlist) => {
        this.playlist = this.shufflePlaylist(playlist);
        this.updateTitle();
        this.audio.getState().subscribe(state => {
          this.state = state;
        });
        this.loadSong();
      });
    })
  }
}
