import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, from } from 'rxjs';
import { userModel } from './user.model';
import { map, tap } from 'rxjs/operators';
import {Plugins} from '@capacitor/core'

interface authDataFromServer{
  idToken: string;
  email: string;
  refreshToken:string;
  expiresIn: string;
  localId:string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
 private user = new BehaviorSubject<userModel>(null);
  constructor(private http: HttpClient) { }

  autoLogin(){
    return from(Plugins.Storage.get({key:'authData'})).pipe( // 'from' here changes promise to observable 
      map(storedData=>{
        if(!storedData || !storedData.value){
          return null
        }
        const parseData = JSON.parse(storedData.value) as {
          userId:string; 
          token: string; 
          expiration:string 
          email: string;
        }
        const expirationTime = new Date(parseData.expiration);
        if(expirationTime<= new Date()){
          return null;
        }
        const user = new userModel(parseData.userId, parseData.email, parseData.token, expirationTime)
        return user;
      })
    , tap(userTemp=>{
        if(userTemp){
          this.user.next(userTemp);
        }
      
    }),
     map(userTemp=>{
       return !!userTemp;
     })
    )
  }
  get isUserAuthenticated(){
    return this.user.asObservable().pipe(map(userData=>{
      if(userData){
        return !!userData.token;
      }
      else{
        return false;
      }
    }))
  }

  get userIDFromAuth(){
    return this.user.asObservable().pipe(map(userData=>{
      return userData.id;
    }))

   // return this.user.
  }
  Login(email:string, password:string){
    //this.isUserLoggedIn = true;
    return this.http.post<authDataFromServer>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
     {email: email, password: password, returnSecureToken: true}
    ).pipe(tap(this.setUserData.bind(this)))
  }

  Logoff(){
    this.user.next(null);
    Plugins.Storage.remove({key:'authData'});
  }

  signUp(email: string, password: string){
    return this.http.post<authDataFromServer>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
     {email: email, password: password, returnSecureToken: true}
    ).pipe(tap(this.setUserData.bind(this)))

  }
  private setUserData(resData: authDataFromServer){
    const expirationTime = new Date(new Date().getTime() + (+resData.expiresIn*1000));
    this.user.next(new userModel(resData.localId, resData.email, resData.idToken, expirationTime ))
    this.storeAuthData(resData.localId, resData.localId, expirationTime.toISOString(), resData.email);
  }

  private storeAuthData(userId: string, token: string, tokenExpirationDate: string, email: string){
    const data =JSON.stringify({userId: userId, token: token, expiration: tokenExpirationDate, email: email});
     Plugins.Storage.set({key: 'authData', value: data})
  }
}
