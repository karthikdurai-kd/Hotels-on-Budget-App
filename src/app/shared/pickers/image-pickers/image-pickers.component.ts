import { Component, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import {Plugins, Capacitor, CameraSource, CameraResultType} from '@capacitor/core'
import { EventEmitter } from '@angular/core';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-image-pickers',
  templateUrl: './image-pickers.component.html',
  styleUrls: ['./image-pickers.component.scss'],
})
export class ImagePickersComponent implements OnInit {
  selectedImage:string
  @Output() imagePick = new EventEmitter<string | File>();
  @ViewChild('filePick') filePickRef: ElementRef<HTMLInputElement>;
  filePickVal: boolean = false;
  constructor(private platform: Platform) { }

  ngOnInit() {
    console.log("Mobile: "+this.platform.is('mobile'));
    console.log("ios: "+this.platform.is('ios'));
    console.log("android: "+this.platform.is('android'));
    console.log("desktop: "+this.platform.is('desktop'));
    console.log("hybrid: "+this.platform.is('hybrid'));
    console.log("mobileweb: "+this.platform.is('mobileweb'));
    console.log("capacitor: "+this.platform.is('capacitor'));
    console.log("cordova: "+this.platform.is('cordova'));
    
    if((this.platform.is('mobile') && !this.platform.is('hybrid'))|| this.platform.is('desktop') ){
        this.filePickVal = true;
       
    }
  }
  
  onPickImage(){
    if(!Capacitor.isPluginAvailable('Camera')){
      console.log("Camera available: "+ Capacitor.isPluginAvailable('Camera'))
      this.filePickRef.nativeElement.click();
        return;
    }
    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      width: 600,
      resultType: CameraResultType.DataUrl
    }).then(image=>{
      this.selectedImage = image.dataUrl;
      this.imagePick.emit(image.dataUrl)
    }).catch(err=>{
      if(this.filePickVal){
        this.filePickRef.nativeElement.click();
      }
      console.log(err);
      return false;
    })
  }
  
  onFileChange(event: Event){
//console.log(event);
  const pickedFile = (event.target as HTMLInputElement).files[0];
  if(!pickedFile){
    return
  }
  const fr = new FileReader();
  fr.onload = ()=>{
    const fileDataURL= fr.result.toString();
     this.selectedImage = fileDataURL;
     this.imagePick.emit(this.selectedImage);
  }
  fr.readAsDataURL(pickedFile);
  }
}
