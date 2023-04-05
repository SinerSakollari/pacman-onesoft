import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './shared/material/material.module';
import { MainMenuComponent } from './component/main-menu/main-menu.component';
import { LogoComponent } from './component/logo/logo.component';
import { GameComponent } from './component/game/game.component';
import { SaveScoreComponent } from './component/save-score/save-score.component';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    LogoComponent,
    GameComponent,
    SaveScoreComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
