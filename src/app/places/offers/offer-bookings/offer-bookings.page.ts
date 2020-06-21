import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Place } from '../../places.structure';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit {
 place:Place;
 placeID:string;
 isLoadable:boolean = false;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private placeServiceObj: PlacesService) { }

  ngOnInit() {
     this.activatedRoute.paramMap.subscribe(paramMap =>{
       this.placeID = paramMap.get('placeId');
      // console.log(this.placeID);
       this.fetchPlace(this.placeID).then(data=>{
         this.place = data;
         console.log(this.place);
          this.isLoadable=true;
       })
      
     })
  }

  fetchPlace(id:string){
       return this.placeServiceObj.getPlaceSingle(id).then(data=>{
         return data;
       })
  }

  onOffer(){
    this.router.navigateByUrl('/places/tabs/offers/edit/'+ this.place.id);
  }

}
