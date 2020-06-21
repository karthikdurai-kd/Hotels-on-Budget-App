import { Injectable } from '@angular/core';
import { bookingStructure } from './bookings.structure';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { tap, map, take, switchMap } from 'rxjs/operators';

interface bookingFormatServer{
   dateFrom: string,
   dateTo: string,
   firstName: string,
   guestNumber: number,
   lastName: string,
   placeId:string
   placeImage: string,
   placeTitle: string,
   userId: string
}

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  bookings:bookingStructure[]=[
    /*new bookingStructure(
      '132',
      '2',
      'abc',
      'Green Palce',
       'fsdfsdf',
       'Karthik',
       'Durai',
       2,
       new Date('02-09-2018'),
       new Date('11-09-2018')
    )*/
  ];
  constructor(private authServiceObj: AuthService, private http:HttpClient) { }

  get getBookingsData(){
    return [...this.bookings];
  }

  addBookings(
    placeId:string, 
    placeTitle:string, 
    placeImage:string, 
    firstName:string, 
    lastName:string, 
    guestNo:number, 
    dateFrom:Date, 
    dateTo:Date ){
     let generatedID:string;
     let bookPlace:bookingStructure;
     return this.authServiceObj.userIDFromAuth.pipe(take(1), switchMap(userId=>{
      if(!userId){
       throw new Error("No User ID found");
      }
       bookPlace = new bookingStructure('12', placeId, userId, placeTitle, placeImage, firstName, lastName, guestNo, dateFrom, dateTo);
      return this.http.post<{name:string}>('https://hotelonbudgetapp.firebaseio.com/bookings.json', {...bookPlace, id:null})
     }),
       tap(resData=>{
         console.log("Bookings Response Data");
         console.log(resData);
       }),
       map(resData=>{
            bookPlace.id = resData.name;
            this.bookings.push(bookPlace);
            return resData.name;
       })

     )
     
  }

  deleteBooking(id:string){
   return this.http.delete(`https://hotelonbudgetapp.firebaseio.com/bookings/${id}.json`)
   .pipe(
     map(()=>{
      this.bookings= this.bookings.filter(b=>{
        return b.id!= id;
      })
      console.log(this.bookings)
     })
   )
   
  }

  fetchPlace(){
  
    this.bookings=[];
   return this.authServiceObj.userIDFromAuth.pipe(take(1), switchMap(userId=>{
      return this.http.get<{[key:string]: bookingFormatServer}>(`https://hotelonbudgetapp.firebaseio.com/bookings.json?orderBy="userId"&equalTo=
      "${userId}"
      `)
    }), map(resData=>{
          for(const key in resData){
            if(resData.hasOwnProperty(key)){
              const tempPlace = new bookingStructure(
              key,
              resData[key].placeId,
              resData[key].userId,
              resData[key].placeTitle,
              resData[key].placeImage,
              resData[key].firstName,
              resData[key].lastName,
              resData[key].guestNumber,
              new Date(resData[key].dateFrom),
              new Date(resData[key].dateTo)

              );
              this.bookings.push(tempPlace)
            }
          }
        })
      ).toPromise();
  }
}
