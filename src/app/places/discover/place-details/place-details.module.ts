import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaceDetailsPageRoutingModule } from './place-details-routing.module';

import { PlaceDetailsPage } from './place-details.page';
import { CreteBookingsComponent } from 'src/app/bookings/create-bookings/crete-bookings.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaceDetailsPageRoutingModule
  ],
  declarations: [PlaceDetailsPage, CreteBookingsComponent],
  entryComponents: [CreteBookingsComponent]
})
export class PlaceDetailsPageModule {}
