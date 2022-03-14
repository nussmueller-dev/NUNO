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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AngularSvgIconModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
