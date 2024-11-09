import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpInterceptorService } from './core/http-interceptor/http-interceptor.service';
import { ConfigService } from './core/config.service';
import { AuthService } from './core/authentication/auth.service';
import { AuthCallbackComponent } from './core/auth-callback/auth-callback.component';
import { RouterModule } from '@angular/router';
import { GoogleAuthenticationComponent } from './core/google-authentication/google-authentication.component';
import { SignInComponent } from './features/sign-in/sign-in.component';
import { HomeComponent } from './features/home/home.component';

export function load_config(configService: ConfigService) {
  return () => configService.getSettings();
}

@NgModule({
  declarations: [
    HomeComponent,
    AuthCallbackComponent,
    AppComponent,
    GoogleAuthenticationComponent,
    SignInComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule ,
    // AppRoutingModule,
    RouterModule.forRoot([
      { path: '', component: AppComponent },
      { path: 'home', component: HomeComponent },
      { path: 'sign-in', component: SignInComponent },
      { path: '**', redirectTo: 'home', pathMatch: 'full' }
    ]),
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),   
    { provide: APP_INITIALIZER, useFactory: load_config, deps: [ConfigService], multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    
  ],
  bootstrap: [AppComponent, HomeComponent]
})
export class AppModule { }
