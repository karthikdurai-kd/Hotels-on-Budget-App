import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Place } from '../../places.structure';
import { PlacesService } from '../../places.service';
import { ModalController, ActionSheetController, LoadingController } from '@ionic/angular';
import { CreteBookingsComponent } from 'src/app/bookings/create-bookings/crete-bookings.component';
import { BookingsService } from 'src/app/bookings/bookings.service';
import { AuthService } from 'src/app/auth/auth.service';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.page.html',
  styleUrls: ['./place-details.page.scss'],
})
export class PlaceDetailsPage implements OnInit {
  place: Place;
  placeID: string;
  isBookable:boolean= false;
  isLoadable:boolean = false;
  constructor(private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private placeServiceObj: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetctrl: ActionSheetController,
    private bookingServiceObj: BookingsService,
    private loadingCtrl: LoadingController,
    private authServiceObj: AuthService
    ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap =>{
      this.placeID = paramMap.get('placeId');
      this.singlePlaceFetch(this.placeID).then((data)=>{
         //console.log("Came");
         this.place = data;
         this.isLoadable = true;
         this.authServiceObj.userIDFromAuth.pipe(take(1)).subscribe(userId=>{
          if(this.place.userId!= userId){
            this.isBookable=true;
         }
        })
        
      }
      )
      //this.place = this.placeServiceObj.getPlaceSingle(this.placeID);
     
    })
  }
  singlePlaceFetch(id:string){
    return this.placeServiceObj.getPlaceSingle(id).then((data)=>{
        console.log(data);
        return data;
       })
  }
 onBook(id:string){
     //this.router.navigateByUrl('/places/tabs/discover');
     this.actionSheetctrl.create({
       header: 'Choose an action',
       buttons: [
         {
           text: 'Select Date',
           handler: ()=>{
             this.openBookingModel('select')
           }
         },

      
         {
           text: 'Cancel',
           role: 'cancel'
         }
       ]
     }).then(actionSheetElement=>{
       actionSheetElement.present();
     })
   
  }

  openBookingModel(mode: 'select'){  //mode here refers that parameters should be string and string must be either select or random
         console.log(mode);
         this.modalCtrl.create(
          {component:CreteBookingsComponent,
           componentProps: {selectedPlace: this.place}
          }
         ).then(modalElement=>{
          modalElement.present();
          return modalElement.onDidDismiss();
        })
        .then(modelData=>{
          console.log(modelData.data, modelData.role);
          if(modelData.role === "Confirm"){
            this.loadingCtrl.create({keyboardClose:true, message: 'Booking your Place...'})
            .then(loadingCtrlEle=>{
              loadingCtrlEle.present();
              console.log("Booked!!!");
            const data = modelData.data.bookingConfirm;
            this.bookingServiceObj.addBookings(
              this.placeID, 
              this.place.title, 
              this.place.imageURL, 
              data.firstName, 
              data.lastName, 
              data.noOfGuest, 
              data.startDate, 
              data.endDate).subscribe(data=>{
                console.log("Bookings Data from server");
                console.log(data);
              })
              setTimeout(()=>{
                loadingCtrlEle.dismiss();
              }, 1500)
            })
            
           
          }
        })
  }

}
