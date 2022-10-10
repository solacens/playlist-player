import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PlaylistComponent } from "./pages/playlist/playlist.component";
import { PlayerComponent } from "./pages/player/player.component";

const routes: Routes = [
  { path: "", component: PlaylistComponent, data: { title: 'Playlists' } },
  { path: "**", component: PlayerComponent, data: { title: 'Player' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
