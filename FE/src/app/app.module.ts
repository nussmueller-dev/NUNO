import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { SelectUsernameComponent } from './pages/select-username/select-username.component';
import { BackHeaderComponent } from './shared/components/back-header/back-header.component';
import { LeaveHeaderComponent } from './shared/components/leave-header/leave-header.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { JoinGameComponent } from './pages/join-game/join-game.component';
import { RulesComponent } from './pages/rules/rules.component';
import { SwitchComponent } from './shared/components/switch/switch.component';
import { WaitingForStartComponent } from './pages/waiting-for-start/waiting-for-start.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ManagePlayersComponent } from './pages/manage-players/manage-players.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { ErrorAlertComponent } from './shared/components/popups/error-alert/error-alert.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { routes } from './shared/routes';
import { SuccessAlertComponent } from './shared/components/popups/success-alert/success-alert.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { PlayComponent } from './pages/play/play.component';
import { WrongScreenOrientationComponent } from './shared/components/wrong-screen-orientation/wrong-screen-orientation.component';
import { GameCardComponent } from './shared/components/game-card/game-card.component';
import { AngularResizeEventModule } from 'angular-resize-event';
import { GameCardBackComponent } from './shared/components/game-card-back/game-card-back.component';
import { PlayPortraitComponent } from './shared/components/play-portrait/play-portrait.component';
import { PlayViewPlayersComponent } from './shared/components/play-view-players/play-view-players.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    SelectUsernameComponent,
    BackHeaderComponent,
    LeaveHeaderComponent,
    LoginComponent,
    RegisterComponent,
    JoinGameComponent,
    RulesComponent,
    SwitchComponent,
    WaitingForStartComponent,
    ManagePlayersComponent,
    ErrorAlertComponent,
    SuccessAlertComponent,
    PlayComponent,
    WrongScreenOrientationComponent,
    GameCardComponent,
    GameCardBackComponent,
    PlayPortraitComponent,
    PlayViewPlayersComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MatSnackBarModule,
    AngularSvgIconModule.forRoot(),
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    DragDropModule ,
    AngularResizeEventModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
