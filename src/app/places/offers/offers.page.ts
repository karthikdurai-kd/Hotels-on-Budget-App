import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../places.structure';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
   placesOffer: Place[]=[];
   isDataAvailable:boolean= false;
  constructor(private placeServiceObj: PlacesService, private router: Router) { }

  ngOnInit() {
   setTimeout(()=>{
    this.fetchPlace().then(()=>{
      console.log("Finished Fetching");
      this.placesOffer = this.placeServiceObj.placeAll;
      this.isDataAvailable= true;
   })
   }, 1000)
    
    
  }

  fetchPlace(){
    return this.placeServiceObj.fetchPlace().then(()=>{
  //   console.log(data);
   })
 }


  ionViewWillEnter(){
   console.log("Offers Page Ion View Will Enter");
  // this.placeServiceObj.fetchPlace().subscribe();
   this.placesOffer = this.placeServiceObj.placeAll;
  }

  ionViewDidEnter(){

    // this.placeServiceObj.fetchPlace().subscribe();
     this.placesOffer = this.placeServiceObj.placeAll;
    }

  onEdit(placeID: string, slideRefObj: IonItemSliding){
    slideRefObj.close();
    console.log("Place ID is: "+ placeID);
    this.router.navigateByUrl('/places/tabs/offers/edit/'+ placeID);
  } 

}
