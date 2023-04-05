import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainMenuComponent } from './component/main-menu/main-menu.component';
import { GameComponent } from './component/game/game.component';

const routes: Routes = [
  {path: '', component: MainMenuComponent},
  {path: 'game', component: GameComponent},
  {path: ':points', component: MainMenuComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
