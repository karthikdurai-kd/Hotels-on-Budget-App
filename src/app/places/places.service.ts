import { Injectable } from '@angular/core';
import { Place } from './places.structure';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import {map, tap, delay, take, switchMap} from "rxjs/operators";
import { stringify } from 'querystring';
interface placeDataFromServer{
  availableFrom: string,
  availableTo: string,
  description: string,
  imageURL: string,
  price: number
  title: string
  userId: string
}
@Injectable({
  providedIn: 'root'
})

export class PlacesService {
  
  placesSingle:Place;
  constructor(private authServiceObj: AuthService, private http:HttpClient) { }
  private places: Place[]= [
   /* new Place(
      '1',
      'Leela Palace',
      'Feel Like a King',
      'https://images.jdmagicbox.com/comp/chennai/q8/044pxx44.xx44.121001134146.l9q8/catalogue/the-leela-palace-mrc-nagar-raja-annamalai-puram-chennai-5-star-hotels-hdohwwxxb0.jpg?clr=#39392d',
      10000,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      'ac'
    ),

    new Place(
      '2',
      'ITC Grand Chola',
      'Class and Luxury at its best',
      'https://static.travelagewest.com/i/sized/780/437/www.cfmedia.vfmleonardo.com/imageRepo/6/0/101/830/736/maalc-marina-pools-7900-hor-clsc_S.jpg',
       20000,
       new Date('2020-01-01'),
       new Date('2020-12-31'),
       'adc'
      ),

      new Place(
        '3',
        'Le Royal Meridien',
        'Mini World',
        'https://r1imghtlak.mmtcdn.com/27dd89dc850111e982f00242ac110006.jpg?&output-quality=75&downsize=520:350&crop=520:350;2,0&output-format=jpg',
        140000,
        new Date('2020-01-01'),
        new Date('2020-12-31'),
        'abc'
      ),

     */ 
  ];
  
  get placeAll(){
   return [...this.places];
  }

  getPlaceSingle(id:string){
    
    return this.http.get<placeDataFromServer>('https://hotelonbudgetapp.firebaseio.com/offered-places/'+id+'.json')
    .pipe(
      tap(placeData=>{
        console.log("Place Data");
        console.log(placeData);
      }),
      map(placeData=>{
           return new Place(id, placeData.title, placeData.description, placeData.imageURL, placeData.price, new Date(placeData.availableFrom), new Date(placeData.availableTo), placeData.userId)
      })
    ).toPromise();
   /* return this.places.find(p=>{
            return p.id === id
    })*/
  }

  fetchPlace(){
    this.places=[];
    return this.http.get('https://hotelonbudgetapp.firebaseio.com/offered-places.json')
    .pipe(
     tap(resData=>{
       console.log("Response data from Fetch method tap: "+ resData);
     }),
      map(resData=>{
     // const placesNew= [];
      for(const key in resData){

         if(resData.hasOwnProperty(key)){
         
            const tempPlace= new Place(key, 
              resData[key].title, 
              resData[key].description, 
              resData[key].imageURL, 
              resData[key].price, 
              new Date(resData[key].availableFrom), 
              new Date(resData[key].availableTo), 
              resData[key].userId);
              this.places.push(tempPlace);
           
         }
      }
    // return this.places
    })
    ).toPromise();
  }

  addPlace(title: string, description:string, price:number, dateFrom:Date, dateTo:Date ){
    let generatedID:string;
    let newPlace;
    return this.authServiceObj.userIDFromAuth.pipe(take(1), switchMap(userId=>{
       newPlace = new Place(Math.random().toString(), title, description, 'https://images.jdmagicbox.com/comp/chennai/q8/044pxx44.xx44.121001134146.l9q8/catalogue/the-leela-palace-mrc-nagar-raja-annamalai-puram-chennai-5-star-hotels-hdohwwxxb0.jpg?clr=#39392d',
      price, dateFrom, dateTo, userId);
      return this.http.post<{name: string}>('https://hotelonbudgetapp.firebaseio.com/offered-places.json',{...newPlace, id:null} )
    }),tap(resData=>{
            console.log("Response Data from add method tap : "+resData);
          }),
          map(resData=>{
          
            newPlace.id = resData.name;
            this.places.push(newPlace)
            return resData.name
        }));
       
       
  }

  editPlace(id: string, title:string, description:string){
    let placeEdit: Place = this.places.find(p=> {
      return p.id==id
    })
    placeEdit.title = title;
    placeEdit.description = description;
  
    return this.http.put('https://hotelonbudgetapp.firebaseio.com/offered-places/'+placeEdit.id+'.json',{...placeEdit, id:null})
  }
  
}
