import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AngularResizeEventModule } from 'angular-resize-event';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JoinGameComponent } from './pages/join-game/join-game.component';
import { LoginComponent } from './pages/login/login.component';
import { ManagePlayersComponent } from './pages/manage-players/manage-players.component';
import { PlayComponent } from './pages/play/play.component';
import { RegisterComponent } from './pages/register/register.component';
import { RulesComponent } from './pages/rules/rules.component';
import { SelectUsernameComponent } from './pages/select-username/select-username.component';
import { WaitingForStartComponent } from './pages/waiting-for-start/waiting-for-start.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { BackHeaderComponent } from './shared/components/back-header/back-header.component';
import { GameCardBackComponent } from './shared/components/game-card-back/game-card-back.component';
import { GameCardComponent } from './shared/components/game-card/game-card.component';
import { LeaveHeaderComponent } from './shared/components/leave-header/leave-header.component';
import { PlayPortraitComponent } from './shared/components/play-portrait/play-portrait.component';
import { PlayViewPlayersComponent } from './shared/components/play-view-players/play-view-players.component';
import { BoolQuestionModalComponent } from './shared/components/popups/bool-question-modal/bool-question-modal.component';
import { ErrorAlertComponent } from './shared/components/popups/error-alert/error-alert.component';
import { InfoAlertComponent } from './shared/components/popups/info-alert/info-alert.component';
import { SelectColorComponent } from './shared/components/popups/select-color-modal/select-color-modal.component';
import { SuccessAlertComponent } from './shared/components/popups/success-alert/success-alert.component';
import { SwitchComponent } from './shared/components/switch/switch.component';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { routes } from './shared/routes';

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
    GameCardComponent,
    GameCardBackComponent,
    PlayPortraitComponent,
    PlayViewPlayersComponent,
    BoolQuestionModalComponent,
    SelectColorComponent,
    InfoAlertComponent,
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
    DragDropModule,
    ClipboardModule,
    AngularResizeEventModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
