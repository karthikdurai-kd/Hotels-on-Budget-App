import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PlacesService } from '../../places.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}


@Component({
  selector: 'app-new-offers',
  templateUrl: './new-offers.page.html',
  styleUrls: ['./new-offers.page.scss'],
})
export class NewOffersPage implements OnInit {
@ViewChild('f', {static:true}) form:NgForm;
@ViewChild('imageFile') imageFileRef: ElementRef<HTMLInputElement>;
imageTemp;
flag:boolean = false;
  constructor(private placeServiceObj: PlacesService,
   private router:Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    
  }
  
  ionViewWillEnter(){
    this.form.reset();
  }
/*  onImagePick(imageData:string | File){
   this.flag = true;
  this.imageTemp = imageData;
 
    
  }*/



  

  onCreateOffer(){
    if(this.form.invalid){
      return;
    }
    console.log(this.form.value);
    this.loadingCtrl.create({keyboardClose:true, message: 'Adding Place...'})
    .then(loadingCtrlEle=>{
      loadingCtrlEle.present();
      this.placeServiceObj.addPlace(this.form.value.title, this.form.value.description, this.form.value.price, this.form.value.dateFrom, this.form.value.dateTo)
      .subscribe(resData=>{
        console.log("Server Response: "+resData);
      
        this.form.reset();
      //  console.log(this.form.value.image)
      
      })
      setTimeout(()=>{
        loadingCtrlEle.dismiss();
        this.router.navigateByUrl('/places/tabs/offers');
      }, 1500)
    })
   
   
   

  }

  onDateCheck(){
    const fromDate = this.form.value.dateFrom;
    const toDate = this.form.value.dateTo;
    if(toDate>fromDate){
      return true;
    }
    else{
      return false;
    }
  }

}
