import { Component, OnInit } from '@angular/core';
import { Place } from '../places.structure';
import { PlacesService } from '../places.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  loadedPlace:Place[]=[];
  bookablePlace: Place[]=[];
  flag: boolean = true;
  
  constructor(private placeServiceObj:PlacesService, private authServiceObj: AuthService, private activatedRoute: ActivatedRoute) { }
  isDataAvailable:boolean = false;
    ngOnInit() {
      console.log("discover page ngOnInit");
     setTimeout(()=>{
      this.fetchPlace().then(()=>{
        console.log("Finished Fetching");
        this.loadedPlace = this.placeServiceObj.placeAll;
        this.isDataAvailable= true;
     })
     },1000) 
    }
    
   fetchPlace(){
     return this.placeServiceObj.fetchPlace().then(()=>{
   //   console.log(data);
    })
  }
 
  ionViewDidEnter(){
    console.log('ionViewDidEnter')
    this.loadedPlace = this.placeServiceObj.placeAll;
  }

  onSegmentChange(data: any){
    console.log(data.detail.value);
    if(data.detail.value == "bookable"){
    this.authServiceObj.userIDFromAuth.pipe(take(1)).subscribe(userID=>{
      this.flag =false;
      for(let i=0;i<this.loadedPlace.length;i++){
          if(this.loadedPlace[i].userId != userID){
            this.bookablePlace.push({...this.loadedPlace[i]});
          }

      }
      console.log(this.bookablePlace);
    })
  }
   
    else if(data.detail.value = "allPlaces"){
      this.flag = true;
      this.bookablePlace= [];
      console.log(this.loadedPlace)
    }
    
  }

}
