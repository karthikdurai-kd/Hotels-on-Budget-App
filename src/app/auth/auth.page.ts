import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLogin= true;
  constructor(private authServiceObj: AuthService, 
    private router: Router, 
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
    ) { }

  ngOnInit() {
  }

  authenicate(mailID:string, password:string){
     
     if(this.isLogin){
      this.loadingCtrl.create({keyboardClose: true, message: 'Logging in...'})
      .then(loadingCtrlEle=>{
        loadingCtrlEle.present();
        this.authServiceObj.Login(mailID, password).subscribe(resData=>{
         console.log(resData);
         
         //this.isLogin=false;
         loadingCtrlEle.dismiss();
         this.router.navigateByUrl('/places/tabs/discover');
       }, errorRes=>{
         loadingCtrlEle.dismiss();
             const code= errorRes.error.error.message;
             let message = "Can't Login, Try again later...";
             if(code === "EMAIL_NOT_FOUND"){
               message = "Email ID not found!!!" 
             }
             if(code === "INVALID_PASSWORD"){
               message = "Invalid Password";
             }
             this.alertMessage(message);
       })
       
      })
     }
     else{
      this.loadingCtrl.create({keyboardClose: true, message: 'SignUp in Progress...'})
      .then(loadingCtrlEle=>{
        loadingCtrlEle.present();
        this.authServiceObj.signUp(mailID, password).subscribe(resData=>{
         console.log(resData);
         //this.isLogin=false;
         loadingCtrlEle.dismiss();
         this.router.navigateByUrl('/places/tabs/discover');
       }, errorRes=>{
         loadingCtrlEle.dismiss();
             const code= errorRes.error.error.message;
             let message = "Can't SignUp, Try again later...";
             if(code === "EMAIL_EXISTS"){
               message = "Email ID exits already!!!" 
             }
             this.alertMessage(message);
       })
       
      })
     }
    
}

onSubmit(form: NgForm){
  if(form.invalid){
    return;
  }

  const mailID = form.value.email;
  const password = form.value.password;
 this.authenicate(mailID, password);
}
 onAuthToogle(){
   this.isLogin = !this.isLogin;
 }

 alertMessage(message: string){
   this.alertCtrl.create(
    {header: 'Authentication Error...', message: message, buttons:['Okay']})
    .then(alerCtrlObj=>{
      alerCtrlObj.present();
    })
 }
}
