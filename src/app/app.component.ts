declare var google: any; // Avoid TypeScript errors on `google`

import { Component, OnInit } from '@angular/core';
import { ConfigService } from './core/config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'POC-WebClient';

  constructor(private readonly configService:ConfigService, private readonly router: Router) {}

  ngOnInit(): void {
      // Check for google object, retry if needed
      if(!!sessionStorage.getItem('id_token')){
        this.router.navigate(['home']);
      }
      else{
        this.router.navigate(['sign-in']);
        this.waitForGoogleScript(() => this.initializeGoogleSignIn());
      }
      
  }

  waitForGoogleScript(callback: () => void) {
    const maxRetries = 10;
    let attempts = 0;

    const checkGoogle = () => {
      if (typeof google !== 'undefined') {
        callback();
      } else if (attempts < maxRetries) {
        attempts++;
        setTimeout(checkGoogle, 500); // Retry every 500ms
      } else {
        console.error('Google script did not load.');
      }
    };

    checkGoogle();
  }

  initializeGoogleSignIn() {
    google.accounts.id.initialize({
      client_id: '52855828166-rf80dpnioksgh8ck9l3s5sdj92rs27qc.apps.googleusercontent.com',
      callback: (response: any) => this.handleGoogleCallback(response),
    });

    google.accounts.id.renderButton(
      document.getElementById('google-oauth'),
      {
        theme: 'filled_blue',
        size: 'large',
        shape: 'rectangle',
        width: 185
      }
    );
  }

  handleGoogleCallback(response: any) {
    if(response?.credential){
      sessionStorage.setItem('id_token',response.credential);
      console.log('Google response:', response);
      this.router.navigate(['/home']);
    }
    else{
      console.log('Sign in Failed. Google response:', response);
    }
    
  }
}
