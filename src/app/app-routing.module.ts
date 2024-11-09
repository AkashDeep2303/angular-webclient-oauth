// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthCallbackComponent } from './core/auth-callback/auth-callback.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  // Route for the auth callback
  { path: 'auth-callback', component: AuthCallbackComponent },
  
  // Route for the homepage or default page after login
  { path: '', component: AppComponent },

  // Redirect unknown routes to the home page
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
