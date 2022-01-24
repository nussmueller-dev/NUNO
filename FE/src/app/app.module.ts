import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { SelectUsernameComponent } from './pages/select-username/select-username.component';
import { BackHeaderComponent } from './shared/components/back-header/back-header.component';
import { LeaveHeaderComponent } from './shared/components/leave-header/leave-header.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    SelectUsernameComponent,
    BackHeaderComponent,
    LeaveHeaderComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
