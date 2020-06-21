import { Component, OnInit } from '@angular/core';
import { bookingStructure } from './bookings.structure';
import { BookingsService } from './bookings.service';
import { IonItemSliding, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  bookings: bookingStructure[];
  isLoadable:boolean = false;
  constructor(private bookingsServiceObj: BookingsService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    console.log("Bookings ngOnInit");
    this.fetchBookingsData().then(()=>{
      console.log("Bookings Fetched Successfully");
      this.bookings = this.bookingsServiceObj.getBookingsData;
      this.isLoadable = true;
    })
  }

  fetchBookingsData(){
   return this.bookingsServiceObj.fetchPlace().then((data)=>{
        console.log(data);
   })
  }

  ionViewWillEnter(){
    console.log("Bookings ion View Will Enter")
    this.bookings = this.bookingsServiceObj.getBookingsData;
  }
  
  onBookingCancel(id: string, bookingSlideRef: IonItemSliding){
     bookingSlideRef.close();
     this.loadingCtrl.create({keyboardClose:true, message: 'Deleting...'})
     .then(loadingCtrlEle=>{
         loadingCtrlEle.present();
         this.bookingsServiceObj.deleteBooking(id).subscribe(data=>{
           console.log("delete bookings data from server");
           console.log(data);
         })
         setTimeout(()=>{
           loadingCtrlEle.dismiss();
           this.bookings = this.bookingsServiceObj.getBookingsData;
         }, 1500);
     })
     
   //  console.log(this.bookings)
  }

}
