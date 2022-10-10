import { Injectable } from '@angular/core';

import { Playlist, PlaylistInfo } from 'src/app/interfaces';

import { Base64 } from 'js-base64';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {

  private body = document.getElementsByTagName('body')[0];

  get theme(): string {
    return LocalService.theme;
  }

  get isLightTheme(): boolean {
    return LocalService.theme === 'light';
  }

  get isDarkTheme(): boolean {
    return LocalService.theme === 'dark';
  }

  setDarkTheme(): void {
    this.body.classList.remove(LocalService.theme);
    LocalService.theme ='dark';
    this.body.classList.add(LocalService.theme);
  }

  setLightTheme(): void {
    this.body.classList.remove(LocalService.theme);
    LocalService.theme = 'light';
    this.body.classList.add(LocalService.theme);
  }

  get savedPlaylists(): PlaylistInfo[] {
    return LocalService.savedPlaylists;
  }

  set savedPlaylists(value: PlaylistInfo[]) {
    LocalService.savedPlaylists = value;
  }

  get preferredSource(): string {
    return LocalService.preferredSource
  }

  set preferredSource(value: string) {
    LocalService.preferredSource = value;
  }

  getPlaylistCache(id: string): Playlist {
    return LocalService.getPlaylistCache(id);
  }

  setPlaylistCache(id: string, value: Playlist) {
    LocalService.setPlaylistCache(id, value);
  }

  init(): void {
    // Body theme class
    this.body.classList.add(LocalService.theme);
  }
}

class LocalService {
  static get theme(): string {
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'dark');
    }
    return localStorage.getItem('theme') ?? 'dark';
  }

  static set theme(value: string) {
    localStorage.setItem('theme', value);
  }

  static get savedPlaylists(): PlaylistInfo[] {
    const savedPlaylists: PlaylistInfo[] = JSON.parse(Base64.decode(localStorage.getItem('savedPlaylists') ?? 'W10='));
    return savedPlaylists;
  }

  static set savedPlaylists(value: PlaylistInfo[]) {
    localStorage.setItem('savedPlaylists', Base64.encode(JSON.stringify(value)));
  }

  static get preferredSource(): string {
    const preferredSource: string = localStorage.getItem('preferredSource') ?? "";
    return preferredSource;
  }

  static set preferredSource(value: string) {
    localStorage.setItem('preferredSource', value);
  }

  static getPlaylistCache(playlistId: string): Playlist {
    const playlistCache: Playlist = JSON.parse(Base64.decode(localStorage.getItem(`${playlistId}`) ?? "eyJkZXRhaWxzIjp7Im5hbWUiOiIiLCJpZCI6IiIsImF1dGhvciI6IiJ9LCJ2aWRlb3MiOltdfQ=="));
    return playlistCache;
  }

  static setPlaylistCache(playlistId: string, value: Playlist) {
    localStorage.setItem(`${playlistId}`, Base64.encode(JSON.stringify(value)));
  }

}
