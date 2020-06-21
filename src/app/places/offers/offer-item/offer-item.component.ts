import { Component, OnInit, Input } from '@angular/core';
import { Place } from '../../places.structure';

@Component({
  selector: 'app-offer-item',
  templateUrl: './offer-item.component.html',
  styleUrls: ['./offer-item.component.scss'],
})
export class OfferItemComponent implements OnInit {
@Input() places: Place;
  constructor() { }

  ngOnInit() {}



}
