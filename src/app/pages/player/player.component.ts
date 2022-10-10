import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from "@angular/router";

import { RequestService } from 'src/app/request.service';

import { PlaylistVideo } from 'src/app/interfaces';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  constructor(private route: ActivatedRoute, private titleService: Title, private request: RequestService) { }

  title = "";

  videoList: PlaylistVideo[] = [];

  setDocTitle(title: string) {
    this.titleService.setTitle(title);
  }

  isFirstPlaying() {
    return false;
  }
  isLastPlaying() {
    return true;
  }
  play() {
    return true;
  }
  pause() {
    return true;
  }
  previous() {
    return true;
  }
  next() {
    return true;
  }

  ngOnInit(): void {
    const route = this.route.pathFromRoot
    route[route.length - 1].url.subscribe(url => {
      const playlistId = url[0].path
      this.request.getPlaylistVideoList(playlistId).subscribe(list => {
        this.videoList = list;
      })
    })
  }
}
