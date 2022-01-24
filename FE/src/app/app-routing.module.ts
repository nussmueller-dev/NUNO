import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JoinGameComponent } from './pages/join-game/join-game.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { SelectUsernameComponent } from './pages/select-username/select-username.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'username', component: SelectUsernameComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'join', component: JoinGameComponent },
  // { path: '404', component: E404Component },

  { path: '**', redirectTo: 'welcome' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
