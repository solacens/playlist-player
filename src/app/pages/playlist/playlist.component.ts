import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ConfigService } from 'src/app/config.service';
import { RequestService } from 'src/app/request.service';

import { PlaylistInfo } from 'src/app/interfaces';

@Component({
  selector: 'app-index',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent {

  constructor(public dialog: MatDialog, public config: ConfigService, private request: RequestService) { }

  playlists: PlaylistInfo[] = this.config.savedPlaylists

  addPlaylist(playlistId: string): void {
    if (!this.playlists.some(x => x.id == playlistId)) {
      this.request.getPlaylistInfo(playlistId).subscribe(playlistInfo => {
        this.playlists.push(playlistInfo);
        this.config.savedPlaylists = this.playlists;
      })
    }
  }

  deletePlaylist(playlist: PlaylistInfo): void {
    this.playlists = this.playlists.filter(x => x != playlist);
    this.config.savedPlaylists = this.playlists;
  }

  openDialogAddPlaylist(): void {
    const dialogRef = this.dialog.open(DialogAddPlaylistComponent, {});

    dialogRef.afterClosed().subscribe(playlistId => {
      this.addPlaylist(playlistId);
    });
  }

}

@Component({
  selector: 'dialog-add-playlist',
  templateUrl: './dialog-add-playlist.html',
})
export class DialogAddPlaylistComponent {

  constructor(public dialogRef: MatDialogRef<DialogAddPlaylistComponent>) { }

  playlistId = "";

  onNoClick(): void {
    this.dialogRef.close();
  }

}
