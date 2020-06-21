import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { computeStackId } from '@ionic/angular/directives/navigation/stack-utils';

@Component({
  selector: 'app-map-model',
  templateUrl: './map-model.component.html',
  styleUrls: ['./map-model.component.scss'],
})
export class MapModelComponent implements OnInit, AfterViewInit {
  @ViewChild('map') mapElementRef: ElementRef;
  constructor(private modelCtrlObj: ModalController, private renderer: Renderer2) { }
  
  ngOnInit() {}

  ngAfterViewInit(){
     this.getGoogleMaps().then(googleMaps=>{
         const mapEle = this.mapElementRef.nativeElement;
         const map = new googleMaps.Map(mapEle, {
           center: {lat: -34.397, lng: 150.644},
           zoom: 16
         });

         googleMaps.event.addListenerOnce(map, 'idle', ()=>{
           this.renderer.addClass(mapEle, 'visible');
         })
     }).catch(err=>{
       console.log(err);
     })
  }

  onCancel(){
    this.modelCtrlObj.dismiss();
  }

  private getGoogleMaps(): Promise<any>{
    console.log("Came in map method");
    const win= window as any; //here window refers to the entire browser window of type any
    const googleModule = win.google; //here win.google refers to the variable undefined initially
    if(googleModule && googleModule.maps){
      console.log("Map fetched second time");
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject)=>{
      console.log("Map's script Promise Function")
      const script = document.createElement('script');
      script.src= "https://maps.googleapis.com/maps/api/js?key=AIzaSyCMNALWUnrwX2my3sG34LgwEGwFTPs6beM";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = ()=>{
        console.log("Map's script Onload Function")
        const loadedGoogleMaps = win.google;
        if(loadedGoogleMaps && loadedGoogleMaps.maps){
          console.log("Google Map Came");
          resolve(loadedGoogleMaps.maps);
        }
        else{
          reject("Google Maps SDK has not loaded...");
        }
      }
    })
  }

}
