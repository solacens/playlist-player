import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';

import { PlaylistComponent, DialogAddPlaylistComponent } from './pages/playlist/playlist.component';
import { PlayerComponent } from './pages/player/player.component';

@NgModule({
  declarations: [
    AppComponent,
    PlaylistComponent,
    DialogAddPlaylistComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    Title
  ],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule { }
