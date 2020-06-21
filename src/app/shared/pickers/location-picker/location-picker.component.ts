import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapModelComponent } from '../../map-model/map-model.component';


@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {

  constructor(private modelCtrlObj: ModalController) { }

  ngOnInit() {}

  onPickMapModel(){
     this.modelCtrlObj.create({component: MapModelComponent}).then(modalEle=>{
       modalEle.present();
     })
  }

}
