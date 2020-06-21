import { Component, OnInit } from '@angular/core';
import { Place } from '../../places.structure';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from '../../places.service';
import { NgForm } from '@angular/forms';
import { Route } from '@angular/compiler/src/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-edit-offers',
  templateUrl: './edit-offers.page.html',
  styleUrls: ['./edit-offers.page.scss'],
})
export class EditOffersPage implements OnInit {
  place: Place;
  placeID: string;
  titleNg:any;
  descNg:any;
  isLoadable:boolean=false;
  constructor(private activatedRoute: ActivatedRoute, private placeSericeObj: PlacesService,
              private router: Router, private loadingCtrl: LoadingController) { 
    
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap =>{
       this.placeID = paramMap.get('placeId');
       console.log(this.placeID);
       this.fetchPlace(this.placeID).then(data=>{
         this.place= data;
        this.titleNg = this.place.title;
        this.descNg = this.place.description;
        this.isLoadable=true;
       })
   
    })
  }

  fetchPlace(id:string){
    return this.placeSericeObj.getPlaceSingle(id).then(data=>{
      return data;
    })
  }

  onEditConfirm(form: NgForm){
    if(form.invalid){
      return;
    }
    console.log(form);
    this.placeSericeObj.editPlace(this.placeID, form.value.title, form.value.description)
    .subscribe(data=>{
      //console.log("Edited Data is: "+ data);
    });
    this.loadingCtrl.create({keyboardClose:true, message: "Editing Place..."})
    .then(loadingCtrlEle=>{
      loadingCtrlEle.present();
      setTimeout(()=>{
        loadingCtrlEle.dismiss();
      
        this.router.navigateByUrl('/places/tabs/offers');
      }, 1500)
    })
  
  }

}
