import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectUsernameComponent } from './pages/select-username/select-username.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'username', component: SelectUsernameComponent },
  // { path: '404', component: E404Component },

  { path: '**', redirectTo: 'welcome' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
