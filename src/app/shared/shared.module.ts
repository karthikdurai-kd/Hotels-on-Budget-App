import { NgModel } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MapModelComponent } from './map-model/map-model.component';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ImagePickersComponent } from './pickers/image-pickers/image-pickers.component';

@NgModule({
    declarations: [MapModelComponent, LocationPickerComponent, ImagePickersComponent],
    imports: [CommonModule, IonicModule],
    exports: [LocationPickerComponent, MapModelComponent, ImagePickersComponent],
    entryComponents: [MapModelComponent]
})
export class sharedModule{

}