// Referencing: https://github.com/imshibaji/PersonalRadio/blob/master/src/app/services/audio.service.ts

import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ConfigService } from './config.service';
import { StreamState } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor(private config: ConfigService) {
    this.audioObject.volume = this.state.volume;
  }

  private state: StreamState = {
    playing: false,
    duration: undefined,
    currentTime: undefined,
    volume: this.config.volume,
    canplay: false,
    error: false,
  };

  private stop$ = new Subject();

  private audioObject = new Audio();

  audioEvents = [
    "ended",
    "error",
    "play",
    "playing",
    "pause",
    "timeupdate",
    "canplay",
    "loadedmetadata",
    "loadstart"
  ];

  private stateChange: BehaviorSubject<StreamState> = new BehaviorSubject(
    this.state
  );

  private updateStateEvents(event: Event): void {
    switch (event.type) {
      case "canplay":
        this.state.duration = this.audioObject.duration;
        this.state.canplay = true;
        break;
      case "playing":
        this.state.playing = true;
        break;
      case "pause":
        this.state.playing = false;
        break;
      case "timeupdate":
        this.state.currentTime = this.audioObject.currentTime;
        break;
      case "error":
        this.resetState();
        this.state.error = true;
        break;
    }
    this.stateChange.next(this.state);
  }

  private resetState() {
    this.state = {
      playing: false,
      duration: undefined,
      currentTime: undefined,
      volume: this.state.volume,
      canplay: false,
      error: false
    };
  }

  getState(): Observable<StreamState> {
    return this.stateChange.asObservable();
  }

  private streamObservable(url: string) {
    return new Observable(observer => {
      // Play audio
      this.audioObject.src = url;
      this.audioObject.load();
      this.audioObject.play();

      const handler = (event: Event) => {
        this.updateStateEvents(event);
        observer.next(event);
      };

      this.addEvents(this.audioObject, this.audioEvents, handler);
      return () => {
        // Stop Playing
        this.audioObject.pause();
        this.audioObject.currentTime = 0;
        // remove event listeners
        this.removeEvents(this.audioObject, this.audioEvents, handler);
        // reset state
        this.resetState();
      };
    });
  }

  private addEvents(obj: any, events: any, handler: any) {
    events.forEach((event: any) => {
      obj.addEventListener(event, handler);
    });
  }

  private removeEvents(obj: any, events: any, handler: any) {
    events.forEach((event: any) => {
      obj.removeEventListener(event, handler);
    });
  }

  playStream(url: string) {
    return this.streamObservable(url).pipe(takeUntil(this.stop$));
  }

  play() {
    this.audioObject.play();
  }

  pause() {
    this.audioObject.pause();
  }

  stop() {
    this.stop$.next(null);
  }

  seekTo(seconds: number) {
    this.audioObject.currentTime = seconds;
  }

  setVolume(volume: number) {
    this.audioObject.volume = volume;
  }

}
