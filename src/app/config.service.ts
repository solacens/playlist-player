import { Injectable } from '@angular/core';

import { PlaylistInfo } from 'src/app/interfaces';

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
    const savedPlaylists: PlaylistInfo[] = JSON.parse(localStorage.getItem('savedPlaylists') ?? "[]");
    return savedPlaylists;
  }

  static set savedPlaylists(value: PlaylistInfo[]) {
    localStorage.setItem('savedPlaylists', JSON.stringify(value));
  }
}
