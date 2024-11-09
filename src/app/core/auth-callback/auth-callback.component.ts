// auth-callback.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserManager, WebStorageStateStore, User } from 'oidc-client-ts';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'app-auth-callback',
  template: '<p>Processing login...</p>',
})
export class AuthCallbackComponent implements OnInit {

  private userManager: UserManager;

  constructor(private router: Router, private authService : AuthService) {
    // Initialize the UserManager with configuration
    this.userManager = new UserManager({
      authority: 'https://accounts.google.com/',
      client_id: '52855828166-rf80dpnioksgh8ck9l3s5sdj92rs27qc.apps.googleusercontent.com',
      redirect_uri: `${window.location.origin }/auth-callback`,
      response_type: 'code', // or 'code' for code flow
      response_mode: 'query',
      scope: 'openid profile email',  // required scopes for Google
      stateStore: new WebStorageStateStore({ store: window.sessionStorage }), // Store state in session storage
    });
    this.userManager = this.authService.getUserManager();
  }

  ngOnInit(): void {
    this.handleAuthCallback();
  }

  private async handleAuthCallback() {
    try {
      const user = await this.authService.handleAuthCallback();
      if (user) {
        console.log('Access Token:', user.access_token);
        console.log('ID Token:', user.id_token);
        this.router.navigate(['/']); // Redirect to home or desired route
      }
    } catch (error) {
      console.error('Error handling callback:', error);
      this.router.navigate(['/']); // Redirect in case of error
    }
  }

  private storeUserData(user: User): void {
    // Store user details or access token as needed
    sessionStorage.setItem('access_token', user.access_token || '');
    sessionStorage.setItem('id_token', user.id_token || '');
  }
}
