import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JoinGameComponent } from './pages/join-game/join-game.component';
import { LoginComponent } from './pages/login/login.component';
import { ManagePlayersComponent } from './pages/manage-players/manage-players.component';
import { RegisterComponent } from './pages/register/register.component';
import { RulesComponent } from './pages/rules/rules.component';
import { SelectUsernameComponent } from './pages/select-username/select-username.component';
import { WaitingForStartComponent } from './pages/waiting-for-start/waiting-for-start.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'username', component: SelectUsernameComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'join', component: JoinGameComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'waiting', component: WaitingForStartComponent },
  { path: 'manage-players', component: ManagePlayersComponent },
  // { path: '404', component: E404Component },

  { path: '**', redirectTo: 'welcome' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
