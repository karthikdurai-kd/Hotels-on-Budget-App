import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Place } from 'src/app/places/places.structure';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { flush } from '@angular/core/testing';

@Component({
  selector: 'app-crete-bookings',
  templateUrl: './crete-bookings.component.html',
  styleUrls: ['./crete-bookings.component.scss'],
})
export class CreteBookingsComponent implements OnInit {
@Input() selectedPlace:Place
@ViewChild('f', {static: true}) form: NgForm;
  constructor(private modelCtrl: ModalController) { }

  ngOnInit() {}
  onBookPlace(){
    if(!this.form.valid){
      return;
    }
     this.modelCtrl.dismiss({bookingConfirm:{
       firstName: this.form.value.firstName,
       lastName: this.form.value.lastName,
       noOfGuest: +this.form.value.guestNo,
       startDate: new Date(this.form.value.fromDate),
       endDate: new Date(this.form.value.toDate)
     }}, 'Confirm');
  }

  onBookCancel(){
      this.modelCtrl.dismiss(null, 'Cancel');
  }

  onDatesValid(){
    const startDate = new Date(this.form.value.fromDate);
    const endDate = new Date(this.form.value.toDate);
    return endDate > startDate;
  }
}
