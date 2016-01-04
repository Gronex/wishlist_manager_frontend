import {Injectable} from 'angular2/core';
import {BackendService} from './backend';
import {User} from '../model/user';

@Injectable()
export class AuthenticationService {
  private auth: {};

  constructor(private backend: BackendService){}


  login(username: string, password: string){
    return this.backend.post({
      "username": username,
      "password": password
    }, "auth/identity/callback",[], false)
    .then((auth) => {
      this.auth = auth;
      this.setAuth();
      this.currentUser();
    });
  }

  loginWith(provider: string){
    // call get auth/:provider
  }

  setAuth(){
    if (!this.userLoaded()){
      var auth = localStorage.getItem("auth");
      if (auth){
        this.backend.setHeader("Authorization", auth.token);
        this.auth = JSON.parse(auth);
      }
    }
    else {
      this.backend.setHeader("Authorization", this.auth["token"]);
    }
    if (this.auth) localStorage.setItem("auth", JSON.stringify(this.auth));
  }

  clearAuth(){
    this.auth = {};
    this.backend.removeHeader("Authorization");
    localStorage.removeItem("auth");
  }

  currentUser(){
    this.setAuth();
    if (!this.userLoaded()) return undefined;
    return {
      id: this.auth["id"],
      name: this.auth["name"]
    }
  }

  private userLoaded(): boolean {
    return (this.auth === {} || (!!this.auth && this.auth["id"] !== undefined));
  }
}
