import { state } from '@angular/animations';
import { Injectable } from '@angular/core';
import { User, UserManager, UserManagerSettings, WebStorageStateStore } from 'oidc-client-ts';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly loginChangedSubject = new BehaviorSubject<boolean>(false);
  public loginChanged = this.loginChangedSubject.asObservable();

  private manager!: UserManager;
  private user!: User;
  private baseUrl!:string;
  private isConfigurationLoaded = false;

  constructor() { 
    // this.loadConfiguration();
  }

  public isUsingOIDC(): boolean {
    return true;
  }

  public isLoggedIn(): boolean {
    return this.user != null && !this.user.expired;
  }

  getUser() {
    return this.user;
  }

  getUserManager() {
    return this.manager;
  }

  async handleAuthCallback(): Promise<User | null> {
    return await this.manager.signinRedirectCallback();
  }

  public login(){
    return this.manager.signinRedirect({ state: window.location.href});
  }

  public authrorizationHeaderValue(): string {
    return `Bearer ${sessionStorage.getItem('id_token')}`;
  }

  public setAuthurizationCredential(token : string){
    sessionStorage.setItem('id_token', token)
  }

  public loadConfiguration(): Promise<void> {
    this.isConfigurationLoaded = true;
    //const authority
    //const appIdentifier
    if(!this.isLoggedIn()){
      this.manager = new UserManager(getClientSetting('', ''));

      // return this.login();
      const customState = 'custom_state_value';
      return this.manager.signinRedirect().then((user: any) => {
        this.user = user;
        this.loginChangedSubject.next(this.isLoggedIn());
      }).catch((error: any) => {
        console.error(error)});
    }

    return Promise.resolve();
    

  }

  // public ManagerUserEvent(): void {
  //   this.manager.events.addUserLoaded((user: User) => this.user = user);
  // }

}

export function getClientSetting(authority: string, appIdentifier: string): UserManagerSettings {
  return {
    authority: 'https://accounts.google.com/o/oauth2/v2/auth',
    client_id: '52855828166-rf80dpnioksgh8ck9l3s5sdj92rs27qc.apps.googleusercontent.com',
    redirect_uri: `${window.location.origin }/auth-callback`,
    response_type: 'code', // or 'code' for code flow
    //response_mode: 'query',
    client_secret: "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",
    scope: 'openid profile email',  // required scopes for Google
    stateStore: new WebStorageStateStore({ store: window.sessionStorage }),
    post_logout_redirect_uri: window.location.origin,
    userStore: new WebStorageStateStore({ store: window.sessionStorage }),
    filterProtocolClaims: true,
    loadUserInfo: true,
    
    automaticSilentRenew: true,
    // accessTokenExpiringNotificationTime: 120
  };
}
