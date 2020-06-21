import { Component, OnInit } from '@angular/core';
import { PlacesService } from './places.service';

@Component({
  selector: 'app-places',
  templateUrl: './places.page.html',
  styleUrls: ['./places.page.scss'],
})
export class PlacesPage implements OnInit {

  constructor(private placesServiceObj: PlacesService) { }

  ngOnInit() {
    console.log("Place Page ngOnInit");
    this.fetchPlace().then(()=>{
      console.log("Finished Fetching");
       this.placesServiceObj.placeAll;
      //.isDataAvailable= true;
   })
  }
  fetchPlace(){
    return this.placesServiceObj.fetchPlace().then(()=>{
  //   console.log(data);
   })
 } 

}
